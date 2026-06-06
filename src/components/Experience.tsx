'use client';

import { useState, useEffect } from 'react';
import { Calendar, Briefcase, FileText, ExternalLink, X, Download, Eye } from 'lucide-react';
import Image from 'next/image';

interface Experience {
  id?: string;
  _id?: string;
  company: string;
  role: string;
  period: string;
  description: string;
  type: string;
  attachmentUrl?: string;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewExp, setPreviewExp] = useState<Experience | null>(null);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const res = await fetch('/api/experiences');
        if (res.ok) {
          const expData = await res.json();
          setExperiences(expData);
        }
      } catch (err) {
        console.error('Failed to fetch experiences:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setPreviewExp(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const isImageFile = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isPdfFile = (url: string) => /\.pdf$/i.test(url);
  const isLocalFile = (url: string) => url && url.startsWith('/uploads/');
  const isViewable = (url: string) => isLocalFile(url) && (isImageFile(url) || isPdfFile(url));

  return (
    <section id="experience" className="py-28 relative overflow-hidden section-alt border-y border-slate-100 dark:border-white/[0.02] transition-colors duration-500">
      {/* Background neon subtle blue elements */}
      <div className="absolute top-[20%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.01] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.01] blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-20">
          <h2 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] dark:text-white mb-6 tracking-tight">
            Work <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent font-extrabold">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-700 to-blue-500 mx-auto rounded-full mb-6" />
          <p className="text-slate-800 dark:text-slate-350 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Professional track record of development and quality assurance roles held in the software industry.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-10 relative">
            {/* Elegant vertical timeline line */}
            <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-600 via-blue-450 to-transparent transform -translate-x-1/2 hidden sm:block" />

            <div className="space-y-12">
              {experiences.map((exp, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={exp.id || exp._id}
                    className={`flex flex-col sm:flex-row items-stretch justify-between w-full relative ${
                      isEven ? 'sm:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Timeline Node dot */}
                    <div className="absolute left-6 sm:left-1/2 top-8 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-[#060814] transform -translate-x-1/2 shadow-md z-20 hidden sm:block" />

                    {/* Timeline card panel */}
                    <div className="w-full sm:w-[46%] text-left">
                      <div className="card-surface rounded-3xl p-8 relative hover:-translate-y-1 transition-all duration-300">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                          <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                            {exp.type}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-bold">
                            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            {exp.period}
                          </span>
                        </div>

                        <h3 className="font-outfit font-black text-xl text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                          {exp.role}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-black mb-4 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {exp.company}
                        </p>

                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                          {exp.description}
                        </p>

                        {/* Attachment — show "View Reference Letter" button if file uploaded */}
                        {exp.attachmentUrl && exp.attachmentUrl !== '' && (
                          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.05]">
                            {isViewable(exp.attachmentUrl) ? (
                              <button
                                onClick={() => setPreviewExp(exp)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all duration-300 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Experience Letter
                              </button>
                            ) : (
                              <a
                                href={exp.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all duration-300"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                View Reference
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Spacer for vertical balance */}
                    <div className="w-full sm:w-[46%] hidden sm:block" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* Experience Reference Letter Preview Modal                  */}
      {/* ══════════════════════════════════════════════════════════ */}
      {previewExp && previewExp.attachmentUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onClick={() => setPreviewExp(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Modal */}
          <div
            className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#0c1020] rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-2xl overflow-hidden flex flex-col animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-950/60 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-outfit font-bold text-sm sm:text-base text-slate-800 dark:text-white truncate">
                    {previewExp.role} — {previewExp.company}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Experience Reference Letter · {previewExp.period}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={previewExp.attachmentUrl}
                  download
                  className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                <a
                  href={previewExp.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors"
                  title="Open in New Tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setPreviewExp(null)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-red-100 dark:hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-grow overflow-auto p-2 sm:p-4 bg-slate-100/50 dark:bg-slate-950/40 flex items-center justify-center min-h-[300px]">
              {isImageFile(previewExp.attachmentUrl) ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={previewExp.attachmentUrl}
                    alt={`${previewExp.company} reference letter`}
                    width={900}
                    height={700}
                    className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-lg"
                    preload
                    unoptimized
                  />
                </div>
              ) : isPdfFile(previewExp.attachmentUrl) ? (
                <iframe
                  src={previewExp.attachmentUrl}
                  className="w-full h-[72vh] rounded-xl border border-slate-200 dark:border-white/5"
                  title={`PDF: ${previewExp.company} reference`}
                />
              ) : null}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-widest flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                Verified Work Reference
              </span>
              <span>{previewExp.type} · {previewExp.period}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
