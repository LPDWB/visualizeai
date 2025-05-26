"use client";
import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';

export function AIChat() {
  const { currentFile } = useStore();
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { role: 'user', content: input }]);
    setLoading(true);
    setInput('');
    try {
      // Prepare data: first 100 rows
      const dataSample = currentFile ? currentFile.data.slice(0, 100) : [];
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, data: dataSample }),
      });
      const { result } = await res.json();
      setMessages((msgs) => [...msgs, { role: 'ai', content: result || 'No response.' }]);
    } catch (e) {
      setMessages((msgs) => [...msgs, { role: 'ai', content: 'Error contacting AI.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="w-full glass-card rounded-2xl shadow-xl border border-white/10 backdrop-blur-md bg-background/60 flex flex-col min-h-[400px]">
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-muted-foreground text-center">Ask anything about your data. E.g. "What are the top 3 categories?"</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/60 text-foreground border'} shadow-sm`}>{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start"><div className="animate-pulse bg-muted/40 rounded-xl px-4 py-2">AI is typing…</div></div>
        )}
      </div>
      <form
        className="flex gap-2 border-t border-white/10 p-3 bg-background/70 backdrop-blur"
        onSubmit={e => { e.preventDefault(); handleSend(); }}
      >
        <input
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type your question…"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input.trim()}>Send</Button>
      </form>
    </div>
  );
} 