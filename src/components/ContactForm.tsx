'use client';

import { useState } from 'react';
import { Mail, User, Send, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill in all the required fields.');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await res.json();
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Failed to connect to the server. Please check your network.');
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#060814]/40">
      {/* Background radial highlight */}
      <div className="absolute bottom-[10%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Get In <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Touch</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Have an international role, a freelance request, or just want to chat? Drop me a message below!
          </p>
        </div>

        <div className="glassmorphism rounded-3xl p-8 sm:p-12 border border-white/5 shadow-2xl relative">
          {status === 'success' ? (
            <div className="text-center py-10 space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-outfit font-bold text-2xl text-white">Message Transmitted!</h3>
              <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base">
                Thank you for reaching out. Your message has been safely logged in my secure administrator panel. I will respond to your email as soon as possible.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2 text-left">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      disabled={status === 'submitting'}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/50 border border-white/5 focus:border-indigo-500/50 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-slate-600 text-sm transition-all duration-300 outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2 text-left">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      disabled={status === 'submitting'}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/50 border border-white/5 focus:border-indigo-500/50 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-slate-600 text-sm transition-all duration-300 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2 text-left">
                <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Subject Heading
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Job Opportunity"
                    disabled={status === 'submitting'}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/50 border border-white/5 focus:border-indigo-500/50 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-slate-600 text-sm transition-all duration-300 outline-none"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2 text-left">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Detailed Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell me about your project, target roles, or any questions..."
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-white/5 focus:border-indigo-500/50 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-slate-600 text-sm transition-all duration-300 outline-none resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-indigo-800 disabled:to-purple-800 disabled:text-slate-400 shadow-lg shadow-indigo-600/10 disabled:cursor-not-allowed hover:shadow-indigo-500/20 transition-all duration-300 group"
              >
                {status === 'submitting' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Transmitting Message...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    Transmit Secure Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
