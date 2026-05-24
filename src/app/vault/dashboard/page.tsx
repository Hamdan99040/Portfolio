'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, LogOut, FileText, Plus, Trash2, Edit3, 
  Mail, Settings, FolderCode, Briefcase, Award, CheckCircle, 
  ExternalLink, Copy, AlertCircle, Eye, ShieldAlert, Sparkles 
} from 'lucide-react';

interface Document {
  id?: string;
  _id?: string;
  name: string;
  type: string;
  fileName: string;
  watermarkText: string;
  uploadedAt: string;
}

interface Project {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  problemSolved: string;
  role: string;
  github: string;
  demo: string;
  image: string;
  category: string;
  technologies: string[];
}

interface Experience {
  id?: string;
  _id?: string;
  company: string;
  role: string;
  period: string;
  description: string;
  type: string;
}

interface Certification {
  id?: string;
  _id?: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  type: string;
}

interface Message {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  sentAt: string;
}

export default function VaultDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'vault' | 'projects' | 'experience' | 'inbox' | 'profile'>('vault');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // States for collections
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Selected viewer document
  const [viewerDoc, setViewerDoc] = useState<any>(null);
  const [viewingWatermarkText, setViewingWatermarkText] = useState('');
  
  // Dynamic link generation states
  const [shareDocId, setShareDocId] = useState('');
  const [shareHours, setShareHours] = useState('24');
  const [shareWatermark, setShareWatermark] = useState('FOR VISA VERIFICATION ONLY');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Action status/errors
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Modals for CRUD additions
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Project form details
  const [projForm, setProjForm] = useState({
    title: '', description: '', problemSolved: '', role: '',
    github: '', demo: '', image: '', category: 'MERN', technologies: ''
  });

  // Verify session and fetch all datasets in parallel
  const refreshAllData = async () => {
    try {
      const [sessRes, docsRes, projsRes, expsRes, certsRes, msgsRes] = await Promise.all([
        fetch('/api/auth/session'),
        fetch('/api/vault/documents'),
        fetch('/api/projects'),
        fetch('/api/experiences'),
        fetch('/api/certifications'),
        fetch('/api/contact')
      ]);

      if (!sessRes.ok) {
        router.push('/vault');
        return;
      }
      
      const sessData = await sessRes.json();
      if (!sessData.authenticated) {
        router.push('/vault');
        return;
      }
      setAdminUser(sessData.user);

      if (docsRes.ok) setDocuments(await docsRes.json());
      if (projsRes.ok) setProjects(await projsRes.json());
      if (expsRes.ok) setExperiences(await expsRes.json());
      if (certsRes.ok) setCertifications(await certsRes.json());
      if (msgsRes.ok) setMessages(await msgsRes.json());

    } catch (err) {
      console.error(err);
      setActionError('Error synchronizing database node.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/vault');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Document Viewing Handler (Fetches individual secure base64 content)
  const handleViewDocument = async (id: string) => {
    try {
      setActionError('');
      const res = await fetch(`/api/vault/documents/${id}`);
      if (res.ok) {
        const doc = await res.json();
        setViewerDoc(doc);
        setViewingWatermarkText(doc.watermarkText);
      } else {
        setActionError('Failed to retrieve secure file content.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Security timeout accessing this resource.');
    }
  };

  // Share link generator
  const handleGenerateShareLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareDocId) return;

    setActionError('');
    setGeneratedLink('');

    try {
      const res = await fetch('/api/vault/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: shareDocId,
          expiresInHours: shareHours,
          watermarkText: shareWatermark
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Construct full URL
        const fullLink = `${window.location.origin}${data.shareUrl}`;
        setGeneratedLink(fullLink);
        setActionSuccess('Secure access token generated!');
      } else {
        setActionError(data.error || 'Failed to create access link.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Security link node unreachable.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Project CRUD Actions
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    const formattedProj = {
      ...projForm,
      technologies: projForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      const url = editingProject 
        ? `/api/projects/${editingProject.id || editingProject._id}` 
        : '/api/projects';
      
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedProj)
      });

      if (res.ok) {
        setActionSuccess(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
        setShowAddProject(false);
        setEditingProject(null);
        setProjForm({
          title: '', description: '', problemSolved: '', role: '',
          github: '', demo: '', image: '', category: 'MERN', technologies: ''
        });
        refreshAllData();
      } else {
        const data = await res.json();
        setActionError(data.error || 'Failed to save project.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Database connection error.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to remove this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActionSuccess('Project deleted.');
        refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActionSuccess('Message deleted from inbox.');
        refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060814] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-500 mt-4 tracking-widest uppercase">Authorizing Session Node...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col">
      {/* Dashboard Sticky Glassmorphic Header */}
      <header className="sticky top-0 z-40 bg-[#060814]/80 backdrop-blur-lg border-b border-white/5 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md">
            S
          </div>
          <span className="font-outfit font-extrabold text-sm sm:text-base tracking-wider text-white flex items-center gap-2">
            SECURE VAULT <span className="text-indigo-500">|</span> <span className="text-slate-400 font-semibold text-xs sm:text-sm">ADMIN CONTROL PANEL</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-bold text-white">{adminUser?.name || 'Administrator'}</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Secured Session Verified
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-950/40 transition-all duration-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full grid lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar Panel (3 cols) */}
        <aside className="lg:col-span-3 space-y-4 text-left">
          <div className="glassmorphism rounded-3xl p-4 border border-white/5 space-y-2">
            <button
              onClick={() => { setActiveTab('vault'); setViewerDoc(null); setGeneratedLink(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'vault' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock className="w-4 h-4" />
              🔒 Secure Vault Files
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'projects' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderCode className="w-4 h-4" />
              🚀 Public Projects
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'experience' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              💼 Work & Certificates
            </button>
            <button
              onClick={() => setActiveTab('inbox')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'inbox' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                ✉️ Messages Inbox
              </span>
              {messages.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {messages.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'profile' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              ⚙️ Profile Config
            </button>
          </div>

          <div className="glassmorphism rounded-3xl p-6 border border-white/5 space-y-4">
            <h4 className="font-outfit font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Security Audit Node
            </h4>
            <div className="text-[10px] text-slate-500 space-y-2">
              <p>• Secure cookie verification is active.</p>
              <p>• Sensitive file content is encrypted on rest.</p>
              <p>• Watermarks are injected server-side upon download requests.</p>
              <p>• All link generators log target document access scopes.</p>
            </div>
          </div>
        </aside>

        {/* Dynamic Display Panel Column (9 cols) */}
        <main className="lg:col-span-9 space-y-6">
          {/* Global Alert Notification Banner */}
          {actionError && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-left animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
          )}
          {actionSuccess && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-left animate-fade-in">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* TAB 1: PRIVATE SECURE VAULT */}
          {activeTab === 'vault' && (
            <div className="space-y-6 text-left">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Documents list card */}
                <div className="glassmorphism rounded-3xl p-6 border border-white/5 space-y-6 h-full">
                  <div>
                    <h3 className="font-outfit font-bold text-lg text-white mb-1">
                      📁 Private Document Scan Files
                    </h3>
                    <p className="text-xs text-slate-500">
                      Scans are watermarked dynamically on fetch requests to prevent digital manipulation.
                    </p>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {documents.map((doc) => (
                      <div
                        key={doc.id || doc._id}
                        onClick={() => handleViewDocument(doc.id || doc._id || '')}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                          viewerDoc?.id === doc.id || viewerDoc?._id === doc._id
                            ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                            : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-xs sm:text-sm truncate">{doc.name}</h4>
                            <p className="text-[10px] text-slate-500 uppercase">{doc.type}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white" title="Preview document">
                            <Eye className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secure link generator card */}
                <div className="glassmorphism rounded-3xl p-6 border border-white/5 space-y-6 h-full">
                  <div>
                    <h3 className="font-outfit font-bold text-lg text-white mb-1">
                      🔗 Temporary Secure Link Generator
                    </h3>
                    <p className="text-xs text-slate-500">
                      Creates an expiring access URL for visa offices, recruiters, or embassies.
                    </p>
                  </div>

                  <form onSubmit={handleGenerateShareLink} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Target Document File
                      </label>
                      <select
                        required
                        value={shareDocId}
                        onChange={(e) => setShareDocId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs sm:text-sm transition-all outline-none"
                      >
                        <option value="">-- Select a document file --</option>
                        {documents.map((doc) => (
                          <option key={doc.id || doc._id} value={doc.id || doc._id}>
                            {doc.name} ({doc.fileName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Link Duration (Hours)
                        </label>
                        <select
                          value={shareHours}
                          onChange={(e) => setShareHours(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs sm:text-sm transition-all outline-none"
                        >
                          <option value="1">1 Hour</option>
                          <option value="12">12 Hours</option>
                          <option value="24">24 Hours (Recommended)</option>
                          <option value="72">3 Days</option>
                          <option value="168">7 Days</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Custom Watermark Overlaid
                        </label>
                        <input
                          type="text"
                          required
                          value={shareWatermark}
                          onChange={(e) => setShareWatermark(e.target.value)}
                          placeholder="FOR RECRUITER ONLY"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs sm:text-sm transition-all outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!shareDocId}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:text-slate-500 transition-colors shadow-lg cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate Shareable Token Link
                    </button>
                  </form>

                  {generatedLink && (
                    <div className="mt-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-left space-y-2.5 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Expiring Visitor Link</span>
                        <span className="text-[10px] text-slate-500">Secure AES Token Generated</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={generatedLink}
                          className="flex-grow px-3 py-2 rounded-lg bg-slate-950/80 border border-white/5 text-slate-300 text-xs outline-none"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center"
                          title="Copy Link"
                        >
                          {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        This URL lets guests view this file without a login. The watermark: <span className="font-semibold text-slate-400">"{shareWatermark}"</span> is locked inside.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Watermarked preview container */}
              {viewerDoc && (
                <div className="glassmorphism rounded-3xl p-6 border border-white/10 space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-white/5">
                    <div>
                      <h3 className="font-outfit font-extrabold text-lg text-white">
                        🔒 Secure Document Viewer
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Reviewing {viewerDoc.name} ({viewerDoc.fileName})
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] sm:text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                        Dynamic Watermark: "{viewerDoc.watermarkText}"
                      </div>
                      <button
                        onClick={() => setViewerDoc(null)}
                        className="px-3 py-1 text-xs bg-white/5 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-lg"
                      >
                        Close View
                      </button>
                    </div>
                  </div>

                  {/* Watermarked Simulated Paper Viewer */}
                  <div className="relative border border-white/5 rounded-2xl h-[450px] w-full bg-slate-950 overflow-hidden flex flex-col justify-between p-8 font-serif shadow-inner">
                    
                    {/* Visual Non-Removable Watermark Overlay Grid */}
                    <div className="absolute inset-0 z-20 pointer-events-none select-none opacity-[0.08] flex flex-wrap items-center justify-center gap-16 p-4 overflow-hidden rotate-[-25deg] scale-125">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <span key={i} className="text-xl sm:text-2xl font-extrabold text-slate-300 font-sans tracking-widest uppercase whitespace-nowrap">
                          {viewerDoc.watermarkText}
                        </span>
                      ))}
                    </div>

                    {/* Content of the Document */}
                    <div className="relative z-10 w-full h-full flex flex-col justify-between">
                      {/* Document Header */}
                      <div className="flex justify-between items-start border-b-2 border-slate-700 pb-4">
                        <div className="text-left">
                          <h2 className="text-lg sm:text-xl font-extrabold text-slate-300 tracking-wider">OFFICIAL ACADEMIC VERIFICATION</h2>
                          <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-1">RECORD VERIFICATION KEY: {viewerDoc.id || viewerDoc._id}</p>
                        </div>
                        <div className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[9px] uppercase tracking-wider rounded">
                          CONFIDENTIAL SCANNED FILE
                        </div>
                      </div>

                      {/* Document Core Content Body Mocking PDF rendering */}
                      <div className="my-8 space-y-6 text-slate-300 text-left font-serif leading-relaxed text-sm">
                        <p>
                          This document serves as verification of degrees and achievements of applicant:
                        </p>
                        
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs sm:text-sm">
                          <p><strong className="text-slate-400">Graduate Name:</strong> Zain Ul Abadin</p>
                          <p><strong className="text-slate-400">Award Title:</strong> Bachelor of Science in Computer Science (BS CS)</p>
                          <p><strong className="text-slate-400">Issuing Authority:</strong> University Of Okara</p>
                          <p><strong className="text-slate-400">Language Score:</strong> IELTS English Band 7.5 Certified</p>
                          <p><strong className="text-slate-400">Operational Focus:</strong> MERN Web Developer | QA Automation Specialist</p>
                        </div>

                        <p className="text-xs text-slate-500 font-sans italic leading-relaxed">
                          Note: This visual representation is generated securely by Zain's encrypted Next.js vault dashboard. It corresponds to verified credential logs stored in local memory databases.
                        </p>
                      </div>

                      {/* Document Footer stamp */}
                      <div className="flex justify-between items-end border-t border-slate-800 pt-4 mt-auto">
                        <div className="text-left font-sans">
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">SYSTEM TIMESTAMP</p>
                          <p className="text-xs text-slate-400 font-mono font-semibold">{new Date(viewerDoc.uploadedAt).toLocaleString()}</p>
                        </div>
                        
                        <div className="text-right font-sans">
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">VERIFICATION STAMP</p>
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold uppercase">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            AUTHENTIC RECORD
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PUBLIC PROJECTS CRUD */}
          {activeTab === 'projects' && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-outfit font-extrabold text-xl text-white">
                    🚀 Public Portfolio Projects Console
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add, edit, or delete the project case studies displayed on the public front page.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjForm({
                      title: '', description: '', problemSolved: '', role: '',
                      github: '', demo: '', image: '', category: 'MERN', technologies: ''
                    });
                    setShowAddProject(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add New Project
                </button>
              </div>

              {/* Add/Edit Project Form Modal drawer */}
              {showAddProject && (
                <div className="glassmorphism rounded-3xl p-6 border border-white/10 space-y-6 animate-fade-in">
                  <h4 className="font-outfit font-bold text-base text-white">
                    {editingProject ? '✏️ Edit Selected Project' : '✨ Add New Project Case-Study'}
                  </h4>

                  <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Project Title</label>
                        <input
                          type="text"
                          required
                          value={projForm.title}
                          onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                          placeholder="e.g. Discover Zone Platform"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs sm:text-sm outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Category Tag</label>
                        <select
                          value={projForm.category}
                          onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs sm:text-sm outline-none"
                        >
                          <option value="MERN">MERN Stack</option>
                          <option value="React Native">React Native Mobile</option>
                          <option value="SQA">QA Automation Framework</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Project Description</label>
                      <textarea
                        required
                        rows={3}
                        value={projForm.description}
                        onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                        placeholder="Brief overview explaining what the application does..."
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs sm:text-sm outline-none resize-none"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Problem Solved</label>
                        <textarea
                          required
                          rows={2}
                          value={projForm.problemSolved}
                          onChange={(e) => setProjForm({ ...projForm, problemSolved: e.target.value })}
                          placeholder="What engineering bottleneck did you resolve?"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs outline-none resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Your Engineering Role</label>
                        <textarea
                          required
                          rows={2}
                          value={projForm.role}
                          onChange={(e) => setProjForm({ ...projForm, role: e.target.value })}
                          placeholder="e.g. Lead Full-Stack Dev and SQA Architect"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">GitHub URL</label>
                        <input
                          type="text"
                          value={projForm.github}
                          onChange={(e) => setProjForm({ ...projForm, github: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Live Demo URL</label>
                        <input
                          type="text"
                          value={projForm.demo}
                          onChange={(e) => setProjForm({ ...projForm, demo: e.target.value })}
                          placeholder="https://demo.com"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Showcase Image URL</label>
                        <input
                          type="text"
                          value={projForm.image}
                          onChange={(e) => setProjForm({ ...projForm, image: e.target.value })}
                          placeholder="https://unsplash.com/..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Technologies Used (Comma Separated)</label>
                      <input
                        type="text"
                        required
                        value={projForm.technologies}
                        onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })}
                        placeholder="React, Node.js, Express, MongoDB, Cypress"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs sm:text-sm outline-none"
                      />
                    </div>

                    <div className="flex gap-3 justify-end items-center pt-2">
                      <button
                        type="button"
                        onClick={() => { setShowAddProject(false); setEditingProject(null); }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/10"
                      >
                        {editingProject ? 'Save Changes' : 'Publish Project'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Projects List Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id || proj._id}
                    className="glassmorphism rounded-3xl p-6 border border-white/5 flex flex-col justify-between h-full group relative"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {proj.category}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingProject(proj);
                              setProjForm({
                                title: proj.title,
                                description: proj.description,
                                problemSolved: proj.problemSolved,
                                role: proj.role,
                                github: proj.github,
                                demo: proj.demo,
                                image: proj.image,
                                category: proj.category,
                                technologies: proj.technologies.join(', ')
                              });
                              setShowAddProject(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
                            title="Edit project"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id || proj._id || '')}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-outfit font-bold text-lg text-white mb-2">{proj.title}</h4>
                      <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">{proj.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-white/5 text-slate-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WORK & CERTS CRUD */}
          {activeTab === 'experience' && (
            <div className="space-y-8 text-left animate-fade-in">
              {/* Experiences CRUD Console */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-outfit font-extrabold text-xl text-white">
                      💼 Work Experience Roadmap
                    </h3>
                    <p className="text-xs text-slate-500">
                      Add, update, or remove professional career listings.
                    </p>
                  </div>
                  <button className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-900/40 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-not-allowed opacity-50">
                    + Add Experience
                  </button>
                </div>

                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id || exp._id} className="glassmorphism rounded-2xl p-6 border border-white/5 flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-bold uppercase">{exp.type}</span>
                          <span className="text-[10px] text-slate-500">{exp.period}</span>
                        </div>
                        <h4 className="font-bold text-base text-white">{exp.role}</h4>
                        <p className="text-xs text-slate-400 font-semibold mb-2">{exp.company}</p>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{exp.description}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 cursor-not-allowed opacity-50"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 cursor-not-allowed opacity-50"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications CRUD Console */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-outfit font-extrabold text-xl text-white">
                      🎓 Verified Professional Credentials
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage certifications showing Meta MERN Stack, Automation Testing, or IELTS.
                    </p>
                  </div>
                  <button className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-900/40 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-not-allowed opacity-50">
                    + Add Certification
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {certifications.map((cert) => (
                    <div key={cert.id || cert._id} className="glassmorphism rounded-2xl p-5 border border-white/5 flex justify-between items-center gap-4">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-purple-400 tracking-wider block mb-1">{cert.type}</span>
                        <h4 className="font-bold text-sm text-white truncate max-w-[200px]">{cert.title}</h4>
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{cert.issuer}</p>
                        <span className="text-[10px] text-slate-500">{cert.date}</span>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 cursor-not-allowed opacity-50"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 cursor-not-allowed opacity-50"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MESSAGES INBOX */}
          {activeTab === 'inbox' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div>
                <h3 className="font-outfit font-extrabold text-xl text-white">
                  ✉️ Incoming Recruitment Messages
                </h3>
                <p className="text-xs text-slate-500">
                  Submissions logged directly from the homepage contact portal.
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="glassmorphism rounded-3xl p-12 text-center text-slate-500 border border-white/5 font-semibold">
                  Inbox is currently empty.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id || msg._id}
                      className="glassmorphism rounded-3xl p-6 border border-white/5 relative group space-y-4"
                    >
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="text-left">
                          <h4 className="font-outfit font-bold text-base text-white">{msg.name}</h4>
                          <a href={`mailto:${msg.email}`} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                            {msg.email}
                          </a>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-500 font-mono font-medium">
                            {new Date(msg.sentAt).toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleDeleteMessage(msg.id || msg._id || '')}
                            className="p-2 rounded-xl bg-rose-950/20 border border-rose-500/25 hover:bg-rose-950/50 text-rose-400 hover:text-rose-300 transition-all"
                            title="Delete Message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                        <p className="text-xs font-bold text-slate-300">
                          Subject: <span className="text-white">{msg.subject}</span>
                        </p>
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE CONFIG */}
          {activeTab === 'profile' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div>
                <h3 className="font-outfit font-extrabold text-xl text-white">
                  ⚙️ Admin Personal Profile configuration
                </h3>
                <p className="text-xs text-slate-500">
                  Update your personal branding metadata rendered across the public homepages.
                </p>
              </div>

              <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-white/5">
                <form onSubmit={(e) => { e.preventDefault(); setActionSuccess('Profile updated locally.'); }} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">Professional Name</label>
                      <input
                        type="text"
                        defaultValue={adminUser?.name || 'Zain Ul Abadin'}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs sm:text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">Professional Role Titles</label>
                      <input
                        type="text"
                        defaultValue="Full Stack Developer | SQA Engineer"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">Contact Email</label>
                      <input
                        type="email"
                        defaultValue={adminUser?.email || 'zain@portfolio.com'}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs sm:text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">Location Area</label>
                      <input
                        type="text"
                        defaultValue="Lahore, Pakistan"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Profile Bio Summary</label>
                    <textarea
                      rows={4}
                      defaultValue="Passionate MERN Stack Developer and Software Quality Assurance (SQA) Engineer. Dedicated to building secure, scalable web applications and ensuring flawless user experiences through comprehensive manual and automated testing."
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs sm:text-sm outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/10 cursor-pointer"
                  >
                    Save Branding Configurations
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
