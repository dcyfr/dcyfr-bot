'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  agentId: string;
}

export function ChatInterface({ agentId }: Readonly<Props>) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function appendChunk(chunk: string) {
    setMessages((prev) => {
      const last = prev.at(-1);
      if (last?.role !== 'assistant') return prev;
      return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
    });
  }

  // Returns true if the stream is done.
  function processSseLine(line: string): boolean {
    if (!line.startsWith('data: ')) return false;
    const payload = line.slice(6).trim();
    if (payload === '[DONE]') return true;

    try {
      const parsed = JSON.parse(payload) as { chunk?: string; error?: string };
      if (parsed.error) throw new Error(parsed.error);
      if (parsed.chunk) appendChunk(parsed.chunk);
    } catch (err) {
      if (!(err instanceof SyntaxError)) throw err;
    }
    return false;
  }

  async function readStream(reader: ReadableStreamDefaultReader<Uint8Array>) {
    const dec = new TextDecoder();
    let buf = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() ?? '';

      for (const line of lines) {
        if (processSseLine(line)) return;
      }
    }
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }, { role: 'assistant', content: '' }]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, message: trimmed }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? `Request failed: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');
      await readStream(reader);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setMessages((prev) => {
        const last = prev.at(-1);
        return last?.role === 'assistant' && last.content === '' ? prev.slice(0, -1) : prev;
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <div className="bg-card/20 border border-border/80/30 rounded-xl overflow-hidden">
      <div className="bg-background/60 border-b border-border/40 px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-muted-foreground">
        <span>Preview mode — read/search/web tools only</span>
        <span>Rate limit: 100 req / hr</span>
      </div>

      <div className="h-80 overflow-y-auto p-4 space-y-4" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 && (
          <p className="text-muted-foreground text-sm text-center pt-6">
            Ask {agentId} anything within its area of expertise.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'bg-primary/70 text-white'
                : 'bg-muted/50 border border-border/80/40 text-muted-foreground'
            }`}>
              <p className="whitespace-pre-wrap">
                {msg.content}
                {isLoading && i === messages.length - 1 && msg.role === 'assistant' && (
                  <span className="inline-block w-1.5 h-3.5 bg-primary/80 animate-pulse ml-0.5 align-text-bottom" />
                )}
              </p>
            </div>
          </div>
        ))}
        {isLoading && messages.at(-1)?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="bg-muted/50 border border-border/80/40 rounded-lg px-4 py-3">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-bounce" />
              </span>
            </div>
          </div>
        )}
        {error && <p className="text-destructive text-xs text-center">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border/40 p-3 flex gap-3 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${agentId}… (Enter to send, Shift+Enter for newline)`}
          rows={2}
          disabled={isLoading}
          className="flex-1 bg-background/60 border border-border/80/40 rounded-lg px-3 py-2 text-sm text-muted-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:border-primary/50"
          aria-label="Message input"
          maxLength={2000}
        />
        <button
          onClick={() => void handleSend()}
          disabled={isLoading || !input.trim()}
          className="shrink-0 bg-primary hover:bg-primary disabled:bg-muted disabled:text-primary text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
