import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import agentsData from '@/data/agents.json';
import type { Agent } from '@/lib/types';
import { buildSystemPrompt } from '@/lib/agent-system-prompt';

interface ChatRequestBody {
  agentId: string;
  message: string;
}

const agents = agentsData as Agent[];
const VALID_AGENTS = new Map(agents.filter((a) => a.public).map((a) => [a.agentId, a]));
const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 100;

// In-memory rate limiter — resets per serverless instance lifecycle.
// Upgrade to Upstash Redis for multi-instance enforcement.
const ipWindows = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const window = ipWindows.get(ip);

  if (!window || now - window.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipWindows.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  if (window.count >= RATE_LIMIT_MAX) {
    const resetAt = window.windowStart + RATE_LIMIT_WINDOW_MS;
    return { allowed: false, remaining: 0, resetAt };
  }

  window.count += 1;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - window.count,
    resetAt: window.windowStart + RATE_LIMIT_WINDOW_MS,
  };
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  const startMs = Date.now();
  const ip = getClientIp(request);

  // Rate limit
  const rl = checkRateLimit(ip);
  const rlHeaders = {
    'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
    'X-RateLimit-Remaining': String(rl.remaining),
    'X-RateLimit-Reset': String(Math.floor(rl.resetAt / 1000)),
    'X-RateLimit-Window': '3600',
  };

  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: rlHeaders });
  }

  // Parse + validate body
  let body: Partial<ChatRequestBody>;
  try {
    body = (await request.json()) as Partial<ChatRequestBody>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: rlHeaders });
  }

  const { agentId, message } = body;

  if (!agentId || typeof agentId !== 'string') {
    return NextResponse.json({ error: 'Missing agentId' }, { status: 400, headers: rlHeaders });
  }

  const agent = VALID_AGENTS.get(agentId);
  if (!agent) {
    return NextResponse.json({ error: 'Unknown agent' }, { status: 404, headers: rlHeaders });
  }

  if (!agent.public || agent.tlpClearance !== 'GREEN') {
    return NextResponse.json({ error: 'Agent not available on public surface' }, { status: 403, headers: rlHeaders });
  }

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Missing message' }, { status: 400, headers: rlHeaders });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message exceeds ${MAX_MESSAGE_LENGTH} character limit` },
      { status: 413, headers: rlHeaders },
    );
  }

  // Client init — prefer Vercel AI Gateway (BYOK, automatic caching) when available.
  // Env vars: AI_GATEWAY_API_KEY (Vercel team gateway key) + ANTHROPIC_API_KEY (BYOK registered
  // at vercel.com/team/settings/ai-gateway). Falls back to direct Anthropic API.
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!gatewayKey && !anthropicKey) {
    console.error('[chat] No API key configured (AI_GATEWAY_API_KEY or ANTHROPIC_API_KEY)');
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503, headers: rlHeaders });
  }

  const client = gatewayKey
    ? new Anthropic({
        apiKey: gatewayKey,
        baseURL: 'https://ai-gateway.vercel.sh/v1/anthropic',
      })
    : new Anthropic({ apiKey: anthropicKey });
  const systemPrompt = buildSystemPrompt(agent);

  // Streaming SSE response
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      let outputTokens = 0;
      let fullReply = '';

      try {
        const anthropicStream = client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: 'user', content: message }],
        });

        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const chunk = event.delta.text;
            fullReply += chunk;
            controller.enqueue(enc.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
          }
          if (event.type === 'message_delta' && event.usage) {
            outputTokens = event.usage.output_tokens;
          }
        }

        // Audit log
        const durationMs = Date.now() - startMs;
        console.log(
          JSON.stringify({
            event: 'agent.chat',
            agentId,
            model: 'claude-sonnet-4-6',
            via: gatewayKey ? 'vercel-ai-gateway' : 'direct',
            inputChars: message.length,
            outputChars: fullReply.length,
            outputTokens,
            durationMs,
            ip: ip === 'unknown' ? ip : `${ip.slice(0, 8)}...`,
          }),
        );

        controller.enqueue(enc.encode('data: [DONE]\n\n'));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Stream error';
        console.error('[chat] stream error', msg);
        controller.enqueue(enc.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...rlHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
