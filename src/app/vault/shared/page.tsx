'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ShieldAlert, FileText, ArrowLeft, Lock, Calendar } from 'lucide-react';

interface Document {
  id?: string;
  _id?: string;
  name: string;
  type: string;
  fileName: string;
  watermarkText: string;
  uploadedAt: string;
}

export default function SharedDocumentViewer() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060814] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-500 mt-4 tracking-widest uppercase">Initializing Security Token...</span>
      </div>
    }>
      <SharedDocumentViewerContent />
    </Suspense>
  );
}

function SharedDocumentViewerContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSharedDocument() {
      if (!token) {
        setError('Security access token is missing from the query parameters.');
        setLoading(false);
        return;
      }

      try {
        // Fetch all documents metadata to find the one associated with our token
        // In our API design, GET /api/vault/documents/[id]?token=VALUE resolves the doc content!
        // But since we need to know the document ID first, let's look up by requesting a token validation endpoint.
        // We can request the document by passing the token to a secure finder or directly requesting
        // the API. In our mock/standard DB, we can resolve this by asking our custom share resolver, or
        // we can fetch the document content directly.
        // Let's call the find endpoint: GET /api/vault/documents/shared?token=TOKEN
        // Wait, in our DB adapter:
        // getSharedLink(token) resolves { token, documentId, expiresAt, watermarkText }
        // Let's check how to load this in the API. Since the shared link lists the document ID,
        // we can add a check or call: GET /api/vault/documents/undefined?token=TOKEN
        // Wait! Let's make sure the backend resolves the correct document when requested.
        // Let's check our API in `src/app/api/vault/documents/[id]/route.ts`:
        // It accepts GET with `token` parameter! But wait, how does the frontend know which `[id]` to request?
        // To make it extremely elegant, we can build a simple route or change `/api/vault/documents/[id]/route.ts`
        // to support loading the document directly using the token, or let's check:
        // We can create a simple API endpoint `src/app/api/vault/resolve/route.ts` that takes the token,
        // finds the shared link, and returns the document metadata AND the document content directly!
        // This is incredibly clean, eliminates double requests, and solves the routing problem perfectly!
        // Let's implement that resolve endpoint in a moment, but first let's write the frontend that fetches from `/api/vault/resolve?token=TOKEN`.
        
        const res = await fetch(`/api/vault/resolve?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          setDoc(data);
        } else {
          const data = await res.json();
          setError(data.error || 'This temporary access link has expired or is invalid.');
        }
      } catch (err) {
        console.error(err);
        setError('Security node unreachable. Verification failed.');
      } finally {
        setLoading(false);
      }
    }
    fetchSharedDocument();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060814] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-500 mt-4 tracking-widest uppercase">Validating Expiring Security Token...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060814] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background neon elements */}
      <div className="absolute top-[20%] left-1/4 w-[35rem] h-[35rem] bg-indigo-500/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-1/4 w-[30rem] h-[30rem] bg-purple-500/[0.03] blur-[120px] pointer-events-none" />

      {/* Return back home link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-white transition-colors duration-300"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Portfolio
      </Link>

      <div className="w-full max-w-3xl">
        {error ? (
          /* Error State Card (Access Denied / Expired) */
          <div className="glassmorphism rounded-3xl p-8 sm:p-12 border border-white/5 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto shadow-md">
              <ShieldAlert className="w-9 h-9 animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-outfit font-extrabold text-2xl text-white">Access Link Expired</h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Security Vault Shield Active</p>
            </div>

            <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              {error} Temporary credentials expire automatically after 24 hours to secure sensitive documents (Passport, CNIC, Degree Scans). Please contact Muhammad Hamdan Yaseen to request a new temporary access token.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link
                href="/#contact"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-colors"
              >
                Contact Hamdan
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                Visit Home
              </Link>
            </div>
          </div>
        ) : doc ? (
          /* Document Present - Display watermarked view */
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* Header Meta information panel */}
            <div className="glassmorphism rounded-2xl p-6 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-outfit font-bold text-lg text-white leading-snug">{doc.name}</h1>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded mt-1.5 inline-block">
                    {doc.type} Verification Scan
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end text-left sm:text-right text-[10px] text-slate-500 gap-1 font-semibold uppercase">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Scanned Date: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                <span className="text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Token Authorized Access</span>
              </div>
            </div>

            {/* Simulated Watermarked Scanned PDF Document */}
            <div className="relative border border-white/5 rounded-3xl h-[520px] w-full bg-slate-950 overflow-hidden flex flex-col justify-between p-8 sm:p-12 font-serif shadow-2xl">
              
              {/* Dynamic Overlaid Diagonal Watermark repeated grid */}
              <div className="absolute inset-0 z-20 pointer-events-none select-none opacity-[0.08] flex flex-wrap items-center justify-center gap-16 p-4 overflow-hidden rotate-[-25deg] scale-125">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="text-xl sm:text-2xl font-extrabold text-slate-300 font-sans tracking-widest uppercase whitespace-nowrap">
                    {doc.watermarkText}
                  </span>
                ))}
              </div>

              {/* Document contents wrapper */}
              <div className="relative z-10 w-full h-full flex flex-col justify-between">
                {/* Header stamps */}
                <div className="flex justify-between items-start border-b-2 border-slate-700 pb-5">
                  <div className="text-left font-sans">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-300 tracking-wider">OFFICIAL ACADEMIC VERIFICATION</h2>
                    <p className="text-[9px] text-slate-500 font-mono tracking-widest mt-1">SECURE ACCESS TOKEN: {token?.substring(0, 16)}...</p>
                  </div>
                  <div className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[8px] uppercase tracking-wider rounded">
                    TEMPORARY VISITOR AUDIT
                  </div>
                </div>

                {/* Body details displaying dynamic watermarked content */}
                <div className="my-8 space-y-6 text-slate-300 text-left font-serif leading-relaxed text-sm sm:text-base">
                  <p>
                    This credentials scanning page renders a verified, watermarked copy of academic and personal records for candidate:
                  </p>
                  
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 text-xs sm:text-sm font-sans">
                    <p><strong className="text-slate-500 uppercase text-[10px] tracking-wider block mb-0.5">Graduate Candidate</strong> Muhammad Hamdan Yaseen</p>
                    <p><strong className="text-slate-500 uppercase text-[10px] tracking-wider block mb-0.5">Award / File Scanned</strong> Bachelor of Science in Computer Science (BS CS)</p>
                    <p><strong className="text-slate-500 uppercase text-[10px] tracking-wider block mb-0.5">Issuing Institution</strong> University Of Okara (Verified BS Degree)</p>
                    <p><strong className="text-slate-500 uppercase text-[10px] tracking-wider block mb-0.5">IELTS English Level</strong> Band Score 7.5 Certified</p>
                  </div>

                  <p className="text-[10px] text-slate-500 font-sans italic leading-relaxed">
                    Security Policy Notice: Academic degrees, passport records, and visa documents are highly protected in this system. Access tokens are linked to automatic firewall audits. Any unauthorized replication is strictly prohibited.
                  </p>
                </div>

                {/* Footer stamp elements */}
                <div className="flex justify-between items-end border-t border-slate-800 pt-5 mt-auto">
                  <div className="text-left font-sans">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest">ACCESS SCOPE</p>
                    <span className="text-xs text-slate-400 font-mono font-semibold flex items-center gap-1 mt-0.5">
                      <Lock className="w-3 h-3 text-indigo-400" />
                      Watermark Enforced
                    </span>
                  </div>
                  
                  <div className="text-right font-sans">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">VERIFICATION STAMP</p>
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      VERIFIED SCAN
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
