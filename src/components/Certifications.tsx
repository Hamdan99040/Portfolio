'use client';

import { useState, useEffect } from 'react';
import { Award, ShieldCheck, ChevronRight, Sparkles, X, FileText, Download, ExternalLink, Eye } from 'lucide-react';
import Image from 'next/image';

interface Certification {
  id?: string;
  _id?: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  type: string;
}

export default function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [previewCert, setPreviewCert] = useState<Certification | null>(null);

  useEffect(() => {
    async function fetchCertifications() {
      try {
        const res = await fetch('/api/certifications');
        if (res.ok) {
          const data = await res.json();
          setCertifications(data);
        }
      } catch (err) {
        console.error('Failed to fetch certifications:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCertifications();
  }, []);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewCert(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const categories = ['All', 'Academic', 'Professional', 'Technical', 'Language'];

  const filteredCerts = filter === 'All'
    ? certifications
    : certifications.filter(c => c.type.toLowerCase() === filter.toLowerCase());

  // Helper to determine if a URL points to a viewable local file (uploaded image/pdf)
  const isLocalFile = (url: string) => url && url.startsWith('/uploads/');
  const isImageFile = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isPdfFile = (url: string) => /\.pdf$/i.test(url);
  const isViewable = (url: string) => isLocalFile(url) && (isImageFile(url) || isPdfFile(url));

  const handleCertClick = (cert: Certification, e: React.MouseEvent) => {
    if (!cert.credentialUrl || cert.credentialUrl === '#') return;

    // If it's a viewable uploaded file, open in our premium modal
    if (isViewable(cert.credentialUrl)) {
      e.preventDefault();
      setPreviewCert(cert);
    }
    // Otherwise, the default <a> behavior opens the external URL
  };

  return (
    <section id="certifications" className="py-28 relative overflow-hidden section-base border-y border-slate-100 dark:border-white/[0.02] transition-colors duration-500">
      {/* Background visual subtle blue lights */}
      <div className="absolute top-[20%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.01] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[35rem] h-[35rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.01] blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] dark:text-white mb-6 tracking-tight">
            Professional <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent font-extrabold">Certifications</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-700 to-blue-500 mx-auto rounded-full mb-6" />
          <p className="text-slate-800 dark:text-slate-350 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Verified academic degrees, professional credentials, and technical specialization certifications from global authorities.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center items-center gap-3.5 flex-wrap mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                filter === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10 hover:bg-blue-750 hover:scale-[1.01]'
                  : 'bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-455 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/[0.15] hover:bg-slate-50/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Certifications Display Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="text-center py-24 text-slate-600 dark:text-slate-400 font-bold">
            No certifications found in this category.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCerts.map((cert) => (
              <a
                key={cert.id || cert._id}
                href={cert.credentialUrl && cert.credentialUrl !== '#' ? cert.credentialUrl : undefined}
                target={cert.credentialUrl && cert.credentialUrl !== '#' && !isViewable(cert.credentialUrl) ? '_blank' : undefined}
                rel="noopener noreferrer"
                onClick={(e) => handleCertClick(cert, e)}
                className={`card-surface rounded-3xl p-7 flex flex-col justify-between h-full relative group transition-all duration-500 ease-out text-left ${
                  cert.credentialUrl && cert.credentialUrl !== '#' ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                      {cert.type}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                      {cert.date}
                    </span>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-outfit font-black text-base sm:text-lg text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors leading-snug">
                        {cert.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>
                </div>

                {cert.credentialUrl && cert.credentialUrl !== '#' && (
                  <div className="flex items-center text-xs font-black text-blue-600 dark:text-blue-450 mt-4 group-hover:text-blue-700 transition-colors">
                    {isViewable(cert.credentialUrl) ? (
                      <>
                        <Eye className="w-4 h-4 mr-1.5" />
                        View Credential Evidence
                      </>
                    ) : (
                      <>
                        Verify Certificate Credential
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* Premium Document Preview Modal — for uploaded images & PDFs           */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {previewCert && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onClick={() => setPreviewCert(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Modal content */}
          <div
            className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#0c1020] rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-2xl overflow-hidden flex flex-col animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-950/60 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-outfit font-bold text-sm sm:text-base text-slate-800 dark:text-white truncate">
                    {previewCert.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold truncate">
                    {previewCert.issuer} — {previewCert.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Download button */}
                <a
                  href={previewCert.credentialUrl}
                  download
                  className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </a>
                {/* Open in new tab */}
                <a
                  href={previewCert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors"
                  title="Open in New Tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                {/* Close */}
                <button
                  onClick={() => setPreviewCert(null)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-red-100 dark:hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body — content preview */}
            <div className="flex-grow overflow-auto p-2 sm:p-4 bg-slate-100/50 dark:bg-slate-950/40 flex items-center justify-center min-h-[300px]">
              {isImageFile(previewCert.credentialUrl) ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={previewCert.credentialUrl}
                    alt={previewCert.title}
                    width={900}
                    height={700}
                    className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-lg"
                    preload
                    unoptimized
                  />
                  {/* Subtle watermark overlay */}
                  <div className="absolute inset-0 pointer-events-none select-none flex flex-wrap items-center justify-center gap-12 opacity-[0.04] rotate-[-20deg] scale-110 overflow-hidden">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <span key={i} className="text-lg font-extrabold text-slate-900 dark:text-white tracking-widest uppercase whitespace-nowrap">
                        VERIFIED CREDENTIAL — MUHAMMAD HAMDAN YASEEN
                      </span>
                    ))}
                  </div>
                </div>
              ) : isPdfFile(previewCert.credentialUrl) ? (
                <iframe
                  src={previewCert.credentialUrl}
                  className="w-full h-[72vh] rounded-xl border border-slate-200 dark:border-white/5"
                  title={`PDF Preview: ${previewCert.title}`}
                />
              ) : (
                <div className="text-center text-slate-500 py-12">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-bold">Preview not available for this file type.</p>
                  <a
                    href={previewCert.credentialUrl}
                    download
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-widest flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Verified Credential Evidence
              </span>
              <span>
                {previewCert.type} — {previewCert.date}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
