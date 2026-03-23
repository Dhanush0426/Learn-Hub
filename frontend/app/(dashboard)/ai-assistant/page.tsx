'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Sparkles, BookOpen, Lightbulb, HelpCircle } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string; }

// Backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const EXAMPLE_PROMPTS = [
  { icon: BookOpen, text: 'Explain machine learning in simple terms' },
  { icon: Lightbulb, text: 'Python lists vs tuples - what is the difference?' },
  { icon: HelpCircle, text: 'How does async/await work in JavaScript?' },
  { icon: Sparkles, text: 'Write a Python binary search function' },
];

async function queryHF(userMessage: string, history: Message[]): Promise<string> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || localStorage.getItem('token') : '';
    const res = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: history.slice(-5) // Send the last 5 messages for context
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return 'AI request failed: ' + (err.error || res.statusText);
    }

    const data = await res.json();
    return data.reply || 'Unexpected response format from backend.';
  } catch (e: any) {
    return 'Network error: ' + e.message;
  }
}


export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I am your AI Learning Assistant powered by Hugging Face. Ask me anything about your courses, programming concepts, or get help understanding topics. What would you like to learn today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg: Message = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const reply = await queryHF(msg, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } finally {
      setLoading(false);
    }
  };

  const showPrompts = messages.length <= 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-height))', overflow: 'hidden' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={20} color="white" />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>AI Learning Assistant</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Powered by Hugging Face · Meta-Llama-3</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span className="badge badge-success">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, flexDirection: m.role === 'user' ? 'row-reverse' : 'row', maxWidth: '85%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: m.role === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--bg-secondary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
              {m.role === 'user' ? <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>U</span> : <Bot size={16} style={{ color: 'var(--accent)' }} />}
            </div>
            <div style={{ background: m.role === 'user' ? 'var(--accent)' : 'var(--surface)', border: '1px solid', borderColor: m.role === 'user' ? 'var(--accent)' : 'var(--border)', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding: '12px 16px', fontSize: 14, lineHeight: 1.7, color: m.role === 'user' ? 'white' : 'var(--text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 12, alignSelf: 'flex-start', alignItems: 'center' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
              <Bot size={16} style={{ color: 'var(--accent)' }} />
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px', padding: '12px 20px', display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'bounce 1.2s infinite 0s' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'bounce 1.2s infinite 0.2s' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'bounce 1.2s infinite 0.4s' }} />
            </div>
          </div>
        )}

        {/* Example prompts */}
        {showPrompts && !loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 8 }}>
            {EXAMPLE_PROMPTS.map(({ icon: Icon, text }) => (
              <button
                key={text}
                onClick={() => send(text)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.4 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.background = 'var(--accent-muted)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
              >
                <Icon size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                {text}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 24px 20px', borderTop: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '8px 8px 8px 16px', transition: 'border-color 0.2s' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            placeholder="Ask me anything about your courses..."
            disabled={loading}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'inherit' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{ width: 36, height: 36, borderRadius: 8, background: input.trim() && !loading ? 'var(--accent)' : 'var(--border)', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s', flexShrink: 0 }}
          >
            {loading ? <Loader2 size={16} color="white" style={{ animation: 'spin 0.8s linear infinite' }} /> : <Send size={16} color={input.trim() ? 'white' : 'var(--text-muted)'} />}
          </button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
          Powered by Hugging Face · Meta-Llama-3 model
        </div>
      </div>

      <style>{`@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }`}</style>
    </div>
  );
}
