'use client';

import { useState } from 'react';
import { Mail, User, Send, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

// Custom inline SVG replacements for brand icons to bypass Turbopack / lucide version export bugs
const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Paperclip = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB limit.');
      return;
    }

    setAttachmentFile(file);
    setUploadingAttachment(true);
    setErrorMessage('');

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('type', 'message');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });

      if (res.ok) {
        const resData = await res.json();
        setAttachmentUrl(resData.fileUrl);
      } else {
        const errData = await res.json();
        setErrorMessage(errData.error || 'Failed to upload attachment file.');
        setAttachmentFile(null);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error uploading file scan.');
      setAttachmentFile(null);
    } finally {
      setUploadingAttachment(false);
    }
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
        body: JSON.stringify({ ...formData, attachmentUrl })
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setAttachmentFile(null);
        setAttachmentUrl('');
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

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com', label: 'Professional Network', color: 'hover:text-blue-600 hover:border-blue-500/20' },
    { name: 'GitHub', icon: Github, url: 'https://github.com', label: 'Open Source', color: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-500/20' },
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com', label: 'Social Profile', color: 'hover:text-blue-500 hover:border-blue-450/20' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com', label: 'Life Updates', color: 'hover:text-pink-500 hover:border-pink-500/20' },
    { name: 'Email', icon: Mail, url: 'mailto:needmorecoffee99040@gmail.com', label: 'Direct Mail', color: 'hover:text-blue-600 hover:border-blue-500/20' }
  ];

  return (
    <section id="contact" className="py-28 relative overflow-hidden section-base border-t border-slate-100 dark:border-white/[0.02] transition-colors duration-500">
      {/* Background radial highlight */}
      <div className="absolute bottom-[10%] left-[10%] w-[35rem] h-[35rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.01] blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] dark:text-white mb-6 tracking-tight">
            Get In <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent font-extrabold">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-700 to-blue-500 mx-auto rounded-full mb-6" />
          <p className="text-slate-800 dark:text-slate-350 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Have an international engineering role, automated SQA task, or full-stack project inquiry? Connect instantly or send a secure message.
          </p>
        </div>

        {/* Social Presence Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-12">
          {socialLinks.map((social, idx) => {
            const IconComponent = social.icon;
            return (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`card-surface rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all duration-300 group/social hover:-translate-y-1 ${social.color}`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover/social:scale-110 transition-transform duration-300">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-slate-900 dark:text-white">{social.name}</p>
                  <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap">{social.label}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Contact Form Card */}
        <div className="card-surface rounded-3xl p-8 sm:p-12 relative">
          {status === 'success' ? (
            <div className="text-center py-10 space-y-5 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-outfit font-black text-2xl text-slate-900 dark:text-white tracking-tight">Message Transmitted!</h3>
              <p className="text-slate-700 dark:text-slate-350 max-w-md mx-auto text-sm sm:text-base font-medium leading-relaxed">
                Thank you for reaching out. Your message has been safely logged in my secure administrator panel. I will respond to your email as soon as possible.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-8 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] hover:border-slate-350 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm animate-fade-in font-medium">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2 text-left">
                  <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500 dark:text-blue-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      disabled={status === 'submitting'}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/[0.05] focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm font-medium transition-all duration-300 outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2 text-left">
                  <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500 dark:text-blue-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      disabled={status === 'submitting'}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/[0.05] focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm font-medium transition-all duration-300 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2 text-left">
                <label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Subject Heading
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500 dark:text-blue-400" />
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Job Opportunity"
                    disabled={status === 'submitting'}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/[0.05] focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm font-medium transition-all duration-300 outline-none"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2 text-left">
                <label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Detailed Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell me about your project, target roles, or any SQA/development questions..."
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/[0.05] focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm font-medium transition-all duration-300 outline-none resize-none"
                />
              </div>
              
              {/* File Attachment */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Attachment (Optional — PDF, PNG, JPG, DOCX)
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/[0.05] hover:border-slate-350 dark:hover:border-white/20 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100/50 cursor-pointer text-xs font-bold transition-all text-slate-700 dark:text-slate-300">
                    <Paperclip className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    {attachmentFile ? 'Change File' : 'Attach File'}
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.docx,.doc"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={status === 'submitting' || uploadingAttachment}
                    />
                  </label>
                  
                  {attachmentFile && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span className="truncate max-w-[200px]">{attachmentFile.name}</span>
                      <button
                        type="button"
                        onClick={() => { setAttachmentFile(null); setAttachmentUrl(''); }}
                        className="text-rose-500 hover:text-rose-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  
                  {uploadingAttachment && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      <div className="w-3.5 h-3.5 border-2 border-blue-600/30 border-t-blue-600 dark:border-indigo-500/30 dark:border-t-indigo-500 rounded-full animate-spin" />
                      Uploading Attachment...
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/10 disabled:bg-blue-600/50 disabled:cursor-not-allowed hover:scale-[1.01] transition-all duration-305 group cursor-pointer"
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

