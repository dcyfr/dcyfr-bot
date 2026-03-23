import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface ChatRequestBody {
  agentId: string;
  message: string;
}

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
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 });
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
