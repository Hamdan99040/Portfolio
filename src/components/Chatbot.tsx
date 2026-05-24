'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi there! 👋 I'm **Zain's Personal AI Agent**. I can answer questions about his MERN stack apps (like *Discover Zone*), SQA testing automation skills, BS Computer Science degree, or his goals for Germany/Australia. Ask me anything!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "⚠️ Sorry, I encountered an error communicating with my server brain. Please try again in a moment."
        }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "📡 Network connection issue. I couldn't reach Zain's database servers. Please verify your connection."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Tell me about Discover Zone',
    'What are his QA automation skills?',
    'MERN Stack background',
    'Why Germany/Australia?',
    'How to contact Zain?'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-inter">
      {/* Floating Trigger Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 relative group animate-avatar-glow"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#060814] rounded-full" />
          {/* Tooltip on hover */}
          <span className="absolute right-16 bg-[#0d1224] text-xs font-semibold text-white px-3 py-1.5 rounded-lg border border-white/5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            Chat with Zain's AI Agent
          </span>
        </button>
      )}

      {/* Chat Drawer expanded */}
      {isOpen && (
        <div className="glassmorphism border border-white/10 rounded-3xl w-[90vw] sm:w-[400px] h-[550px] shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="font-outfit font-bold text-sm text-white flex items-center gap-1.5">
                  Zain's Advisor Agent
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </h4>
                <p className="text-[10px] text-slate-400">Offline-friendly AI Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Messages */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-left shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white/5 border border-white/5 text-slate-300 rounded-tl-none leading-relaxed'
                  }`}
                >
                  {/* Parse basic bold markdown syntax **text** and list bullet items */}
                  {msg.content.split('\n').map((para, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {para.split('**').map((chunk, j) => {
                        if (j % 2 === 1) return <strong key={j} className="text-white font-semibold">{chunk}</strong>;
                        // Handle bullet points starting with -
                        if (chunk.trim().startsWith('-')) {
                          return <span key={j} className="block pl-2">{chunk}</span>;
                        }
                        return chunk;
                      })}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white/5 border border-white/5 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Drawer Options */}
          <div className="p-4 bg-slate-900/40 border-t border-white/5 space-y-3">
            {/* Suggestions Chips (Horizontal scroll if needed) */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-nowrap -mx-2 px-2">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-white/5 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-400 transition-all duration-300"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about MERN, QA, Germany goals..."
                disabled={loading}
                className="flex-grow px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 focus:border-indigo-500/50 focus:bg-slate-950 text-white placeholder-slate-600 text-xs transition-all duration-300 outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-indigo-900 disabled:text-slate-500 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
