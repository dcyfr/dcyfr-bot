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

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, message: trimmed }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as { reply: string };
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
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
    <div className="bg-violet-900/20 border border-violet-700/30 rounded-xl overflow-hidden">
      <div className="bg-violet-950/60 border-b border-violet-800/40 px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-violet-400">
        <span>Tools restricted to read / search / web on public surface</span>
        <span>Rate limit: 100 req / hr</span>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-4" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 && (
          <p className="text-violet-400 text-sm text-center pt-6">
            Send a message to chat with {agentId}.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'bg-violet-600/70 text-white'
                : 'bg-violet-800/50 border border-violet-700/40 text-violet-200'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-violet-800/50 border border-violet-700/40 rounded-lg px-4 py-3">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
              </span>
            </div>
          </div>
        )}
        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-violet-800/40 p-3 flex gap-3 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${agentId}… (Enter to send)`}
          rows={2}
          disabled={isLoading}
          className="flex-1 bg-violet-950/60 border border-violet-700/40 rounded-lg px-3 py-2 text-sm text-violet-200 placeholder-violet-600 resize-none focus:outline-none focus:border-violet-500"
          aria-label="Message input"
        />
        <button
          onClick={() => void handleSend()}
          disabled={isLoading || !input.trim()}
          className="shrink-0 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:text-violet-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
