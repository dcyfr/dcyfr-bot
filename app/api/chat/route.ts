import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import agentsData from '@/data/agents.json';

interface ChatRequestBody {
  agentId: string;
  message: string;
}

const VALID_AGENT_IDS = new Set((agentsData as Array<{ agentId: string }>).map((a) => a.agentId));
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: NextRequest) {
  let body: Partial<ChatRequestBody>;
  try {
    body = (await request.json()) as Partial<ChatRequestBody>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { agentId, message } = body;
  if (!agentId || typeof agentId !== 'string') {
    return NextResponse.json({ error: 'Missing agentId' }, { status: 400 });
  }
  if (!VALID_AGENT_IDS.has(agentId)) {
    return NextResponse.json({ error: 'Unknown agent' }, { status: 404 });
  }
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message exceeds ${MAX_MESSAGE_LENGTH} character limit` },
      { status: 413 },
    );
  }

  const reply = `Chat interface coming soon. The ${agentId} agent will be available when dcyfr.bot launches in Q4 2026.`;

  return NextResponse.json({ reply }, {
    headers: {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Window': '3600',
      'X-RateLimit-Policy': 'public-surface',
    },
  });
}
