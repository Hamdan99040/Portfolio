'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, LogOut, FileText, Plus, Trash2, Edit3, 
  Mail, Settings, FolderCode, Briefcase, Award, CheckCircle, 
  ExternalLink, Copy, AlertCircle, Eye, ShieldAlert, Sparkles,
  Sun, Moon, Search, Bell, Clock, ChevronRight, User, Calendar,
  MapPin, Check, FileDown, ArrowUpRight, Paperclip, Menu, X
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
  attachmentUrl?: string;
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
  attachmentUrl?: string;
}

export default function VaultDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'portfolio' | 'projects' | 'experience' | 'certificates' | 'resume' | 'vault' | 'messages' | 'settings'>('dashboard');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Modals / Drawers for CRUD additions
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projForm, setProjForm] = useState({
    title: '', description: '', problemSolved: '', role: '',
    github: '', demo: '', image: '', category: 'MERN', technologies: ''
  });

  const [showAddExp, setShowAddExp] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expForm, setExpForm] = useState({
    company: '', role: '', period: '', description: '', type: 'Internship', attachmentUrl: ''
  });

  const [showAddCert, setShowAddCert] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [certForm, setCertForm] = useState({
    title: '', issuer: '', date: '', credentialUrl: '', type: 'Academic'
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Theme configuration
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  // Document Viewing Handler
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

  // Experience CRUD Actions
  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    try {
      const url = editingExp 
        ? `/api/experiences/${editingExp.id || editingExp._id}` 
        : '/api/experiences';
      const method = editingExp ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expForm)
      });

      if (res.ok) {
        setActionSuccess(editingExp ? 'Experience updated successfully!' : 'Experience added successfully!');
        setShowAddExp(false);
        setEditingExp(null);
        setExpForm({
          company: '', role: '', period: '', description: '', type: 'Internship', attachmentUrl: ''
        });
        refreshAllData();
      } else {
        const data = await res.json();
        setActionError(data.error || 'Failed to save experience.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Database connection error.');
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;
    try {
      const res = await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActionSuccess('Experience record deleted.');
        refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Certification CRUD Actions
  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    try {
      const url = editingCert 
        ? `/api/certifications/${editingCert.id || editingCert._id}` 
        : '/api/certifications';
      const method = editingCert ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certForm)
      });

      if (res.ok) {
        setActionSuccess(editingCert ? 'Certification updated successfully!' : 'Certification added successfully!');
        setShowAddCert(false);
        setEditingCert(null);
        setCertForm({
          title: '', issuer: '', date: '', credentialUrl: '', type: 'Academic'
        });
        refreshAllData();
      } else {
        const data = await res.json();
        setActionError(data.error || 'Failed to save certification.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Database connection error.');
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm('Are you sure you want to remove this certification?')) return;
    try {
      const res = await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActionSuccess('Certification removed.');
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

  // Profile update submission
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      title: formData.get('title'),
      location: formData.get('location'),
      bio: formData.get('bio'),
      cvUrl: formData.get('cvUrl'),
      avatarUrl: formData.get('avatarUrl'),
      profiles: {
        github: formData.get('github'),
        linkedin: formData.get('linkedin'),
        upwork: formData.get('upwork'),
        email: formData.get('email')
      }
    };

    try {
      const res = await fetch('/api/auth/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setActionSuccess('Branding configuration saved successfully!');
        setAdminUser(resData.user);
      } else {
        setActionError(resData.error || 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Error updating profile settings.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060814] flex flex-col items-center justify-center transition-colors duration-300">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 dark:border-indigo-500/30 dark:border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-500 mt-4 tracking-widest uppercase font-semibold">Authorizing Session Node...</span>
      </div>
    );
  }

  // Helper lists for sidebar navigation
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Briefcase },
    { id: 'portfolio', label: 'Portfolio Preview', icon: FolderCode },
    { id: 'projects', label: 'Projects', icon: Award },
    { id: 'experience', label: 'Experience', icon: Calendar },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'resume', label: 'Resume / CV', icon: FileText },
    { id: 'vault', label: 'Secure Vault', icon: Lock },
    { id: 'messages', label: 'Messages', icon: Mail, badge: messages.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060814] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300 relative">
      
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-blue-500/[0.04] dark:bg-indigo-500/[0.02] blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[20%] right-1/4 w-[35rem] h-[35rem] bg-indigo-500/[0.03] dark:bg-purple-500/[0.02] blur-[130px] pointer-events-none rounded-full" />

      {/* MOBILE HEADER */}
      <header className="md:hidden w-full flex items-center justify-between py-4 px-6 border-b border-slate-200 dark:border-white/5 bg-white/90 dark:bg-[#060814]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/10">
            Z
          </div>
          <span className="font-outfit font-extrabold text-sm tracking-widest text-slate-900 dark:text-white uppercase">
            OPERATING SYSTEM
          </span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* LEFT SIDEBAR - Desktop / Mobile Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 dark:border-white/5 bg-white/90 dark:bg-[#0d1224]/80 backdrop-blur-xl p-6 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:sticky md:h-screen
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-6">
          {/* Logo / Title */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/20">
              H
            </div>
            <div className="text-left">
              <h1 className="font-outfit font-extrabold text-sm tracking-wider text-slate-900 dark:text-white uppercase">
                Muhammad Hamdan Yaseen
              </h1>
              <p className="text-[10px] text-blue-600 dark:text-indigo-400 uppercase tracking-widest font-bold">
                Personal OS
              </p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-indigo-950 flex items-center justify-center text-blue-600 dark:text-indigo-400 font-extrabold">
                {adminUser?.name?.charAt(0) || 'H'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 animate-pulse" />
            </div>
            <div className="text-left min-w-0">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">{adminUser?.name || 'Muhammad Hamdan Yaseen'}</h4>
              <p className="text-[10px] text-slate-500 truncate">{adminUser?.title || 'Full Stack Dev | SQA'}</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-left">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                    if (item.id === 'vault') {
                      setViewerDoc(null);
                      setGeneratedLink('');
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15 dark:bg-indigo-600 dark:shadow-indigo-600/10' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50/50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  {'badge' in item && item.badge > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar Actions */}
        <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/5">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-3">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
              {theme === 'light' ? 'Dark Theme' : 'Light Theme'}
            </span>
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10">Toggle</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-grow flex flex-col md:max-w-[calc(100%-16rem)] min-w-0">
        
        {/* TOP NAVBAR */}
        <header className="hidden md:flex items-center justify-between py-4 px-8 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#060814]/50 backdrop-blur-md sticky top-0 z-30">
          {/* Search Bar mockup */}
          <div className="relative w-64 text-left">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search workspaces... ⌘K" 
              disabled
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/5 text-xs text-slate-500 outline-none"
            />
          </div>

          {/* Right Navbar Controls */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {messages.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 dark:bg-indigo-500 animate-ping" />
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#0d1224] border border-slate-200 dark:border-white/5 shadow-2xl p-4 space-y-3 z-50 text-left animate-fade-in">
                  <h4 className="font-outfit font-bold text-xs uppercase tracking-wider text-slate-500">Notifications</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {messages.slice(0, 3).map((m) => (
                      <div key={m.id || m._id} className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-[11px]">
                        <p className="font-bold text-slate-800 dark:text-white truncate">New inquiry from {m.name}</p>
                        <p className="text-slate-500 line-clamp-1">{m.subject}</p>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <p className="text-slate-500 text-xs py-4 text-center">No new notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Session Verification Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Secured Session Verified
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 focus:outline-none cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">
                  {adminUser?.name?.charAt(0) || 'Z'}
                </div>
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#0d1224] border border-slate-200 dark:border-white/5 shadow-xl p-2 z-50 text-left animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{adminUser?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{adminUser?.email}</p>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('settings'); setShowProfileDropdown(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors mt-1"
                  >
                    <Settings className="w-3.5 h-3.5" /> Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <main className="flex-grow p-6 md:p-8 space-y-6 overflow-y-auto max-w-6xl w-full mx-auto">
          {/* Action alerts */}
          {actionError && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm text-left animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
          )}
          {actionSuccess && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm text-left animate-fade-in">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* TAB 1: CORE DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 text-left animate-fade-in">
              {/* Hero welcome card */}
              <div className="rounded-[24px] bg-gradient-to-tr from-blue-600 to-indigo-700 dark:from-indigo-900/60 dark:to-purple-950/40 p-8 text-white relative overflow-hidden shadow-lg shadow-blue-600/15">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full blur-[60px] pointer-events-none" />
                <div className="relative z-10 space-y-3 max-w-2xl">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider uppercase">
                    Developer Portal Active
                  </span>
                  <h2 className="font-outfit font-extrabold text-2xl sm:text-3xl tracking-wide">
                    Welcome back, {adminUser?.name || 'Hamdan'}!
                  </h2>
                  <p className="text-sm text-blue-100/90 leading-relaxed font-medium">
                    This is your personal operating system. Manage your public project case studies, academic transcripts, work histories, and secure vault documents for visa/university applications.
                  </p>
                  
                  {/* Skill tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['React.js', 'Next.js', 'MERN Stack', 'QA Automation', 'Cypress Testing'].map((skill, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/10 text-[10px] font-bold text-white">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Stat 1 */}
                <div className="glassmorphism rounded-[24px] p-6 flex flex-col justify-between h-full hover:border-blue-600/20 dark:hover:border-indigo-500/20 transition-all duration-300 shadow-sm relative group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-3 rounded-2xl bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-indigo-400">
                      <User className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                      +12.4% <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-800 dark:text-white">1,280</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Profile Views</p>
                  </div>
                  <div className="mt-3 w-full h-8 overflow-hidden pointer-events-none opacity-50 dark:opacity-30">
                    {/* Tiny visual SVG graph */}
                    <svg viewBox="0 0 100 20" className="w-full h-full">
                      <path d="M0,15 Q15,5 30,12 T60,5 T90,15 T100,5" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600 dark:text-indigo-400" />
                    </svg>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="glassmorphism rounded-[24px] p-6 flex flex-col justify-between h-full hover:border-blue-600/20 dark:hover:border-indigo-500/20 transition-all duration-300 shadow-sm relative group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-3 rounded-2xl bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-indigo-400">
                      <FolderCode className="w-5 h-5" />
                    </span>
                    <button 
                      onClick={() => setActiveTab('projects')}
                      className="text-[10px] text-blue-600 dark:text-indigo-400 font-bold bg-blue-50 dark:bg-white/5 hover:bg-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      Manage <ChevronRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-800 dark:text-white">{projects.length}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Public Projects</p>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-4">Filterable portfolio case studies</p>
                </div>

                {/* Stat 3 */}
                <div className="glassmorphism rounded-[24px] p-6 flex flex-col justify-between h-full hover:border-blue-600/20 dark:hover:border-indigo-500/20 transition-all duration-300 shadow-sm relative group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-3 rounded-2xl bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-indigo-400">
                      <Lock className="w-5 h-5" />
                    </span>
                    <button 
                      onClick={() => setActiveTab('vault')}
                      className="text-[10px] text-blue-600 dark:text-indigo-400 font-bold bg-blue-50 dark:bg-white/5 hover:bg-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      Open <ChevronRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-800 dark:text-white">{documents.length}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Encrypted Scans</p>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-4">Watermarks overlay active</p>
                </div>

                {/* Stat 4 */}
                <div className="glassmorphism rounded-[24px] p-6 flex flex-col justify-between h-full hover:border-blue-600/20 dark:hover:border-indigo-500/20 transition-all duration-300 shadow-sm relative group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-3 rounded-2xl bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-indigo-400">
                      <Mail className="w-5 h-5" />
                    </span>
                    <button 
                      onClick={() => setActiveTab('messages')}
                      className="text-[10px] text-blue-600 dark:text-indigo-400 font-bold bg-blue-50 dark:bg-white/5 hover:bg-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      Inbox <ChevronRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-800 dark:text-white">{messages.length}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Recruiter Inquiries</p>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-4">Contact form submissions</p>
                </div>
              </div>

              {/* Main Panel grid: Chart & Activity Feed */}
              <div className="grid lg:grid-cols-12 gap-6 items-start">
                
                {/* Profile Traffic Analytics Chart */}
                <div className="lg:col-span-8 glassmorphism rounded-[24px] p-6 border border-slate-200/50 dark:border-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-outfit font-bold text-lg text-slate-800 dark:text-white">Profile Traffic Analytics</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Simulated monthly recruiter traffic logs</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded bg-blue-50 dark:bg-white/5 text-[10px] font-bold text-blue-600 dark:text-indigo-400">Monthly</span>
                      <span className="px-2 py-1 rounded text-[10px] font-semibold text-slate-400">Weekly</span>
                    </div>
                  </div>

                  {/* SVG Linear Analytics Chart */}
                  <div className="w-full h-56 pt-4 relative">
                    <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800" strokeDasharray="4" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800" strokeDasharray="4" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800" strokeDasharray="4" />

                      {/* Linear Path */}
                      <path 
                        d="M0,130 L50,110 L100,120 L150,70 L200,90 L250,40 L300,50 L350,30 L400,60 L450,20 L500,45" 
                        fill="none" 
                        stroke="#2563eb" 
                        strokeWidth="3" 
                        className="dark:stroke-indigo-500"
                      />
                      
                      {/* Gradient fill */}
                      <path 
                        d="M0,130 L50,110 L100,120 L150,70 L200,90 L250,40 L300,50 L350,30 L400,60 L450,20 L500,45 L500,150 L0,150 Z" 
                        fill="url(#chartGradient)"
                      />

                      {/* Dots on peak */}
                      <circle cx="250" cy="40" r="4" fill="#2563eb" className="dark:fill-indigo-500" />
                      <circle cx="450" cy="20" r="4" fill="#2563eb" className="dark:fill-indigo-500" />
                    </svg>
                    
                    {/* Bottom labels */}
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold uppercase mt-4">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May (Current)</span>
                    </div>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="lg:col-span-4 glassmorphism rounded-[24px] p-6 border border-slate-200/50 dark:border-white/5 space-y-6 h-full flex flex-col">
                  <div>
                    <h3 className="font-outfit font-bold text-lg text-slate-800 dark:text-white">Activity Logs</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Security audit timeline</p>
                  </div>

                  <div className="space-y-4 flex-grow">
                    {[
                      { title: 'Secure document previewed', time: '10 mins ago', desc: 'BS Degree PDF viewed with CONFIDENTIAL watermark' },
                      { title: 'IELTS Band 7.5 added', time: '1 hour ago', desc: 'Academic credentials list synchronized' },
                      { title: 'Visitor link generated', time: '4 hours ago', desc: 'Temporary share URL generated for embassy verification' },
                      { title: 'New message received', time: '1 day ago', desc: 'Inquiry from Jane Miller (TechCorp Solutions)' },
                    ].map((act, i) => (
                      <div key={i} className="flex gap-3 text-left relative group">
                        {i < 3 && (
                          <span className="absolute left-[9px] top-6 bottom-[-20px] w-0.5 bg-slate-200 dark:bg-slate-800" />
                        )}
                        <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex-shrink-0 flex items-center justify-center text-[10px] text-blue-600 dark:text-indigo-400 font-bold z-10">
                          {i + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">{act.title}</h4>
                            <span className="text-[9px] text-slate-400 font-semibold">{act.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{act.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PORTFOLIO PREVIEW */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div>
                <h3 className="font-outfit font-extrabold text-xl text-slate-800 dark:text-white">
                  🖥️ Public Portfolio Frontend Presentation
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This mock layout visualizes how the public homepage is structured using your active database configurations.
                </p>
              </div>

              <div className="p-8 rounded-[24px] bg-white dark:bg-[#060814]/40 border border-slate-200 dark:border-white/5 space-y-12 shadow-sm">
                
                {/* Landing Hero Section Preview */}
                <div className="space-y-4 max-w-3xl border-b border-slate-100 dark:border-white/5 pb-8">
                  <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-indigo-950 text-[10px] font-bold text-blue-600 dark:text-indigo-400 uppercase tracking-widest">
                    SQA Engineer & Full Stack MERN Developer
                  </span>
                  <h1 className="font-outfit font-black text-3xl sm:text-4xl text-slate-800 dark:text-white tracking-wide leading-tight">
                    Hi, I'm <span className="text-blue-600 dark:text-indigo-500">{adminUser?.name || 'Muhammad Hamdan Yaseen'}</span>
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {adminUser?.bio || 'Passionate developer and QA automation specialist. Dedicated to building secure, scalable applications and testing them comprehensively.'}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 shadow-md">
                      Get In Touch
                    </button>
                    <button className="px-5 py-2.5 rounded-xl text-xs font-bold text-blue-600 dark:text-white bg-blue-50 dark:bg-white/5 hover:bg-blue-100 border border-slate-200 dark:border-white/10">
                      Explore Projects
                    </button>
                  </div>
                </div>

                {/* Projects Section Grid Preview */}
                <div className="space-y-6">
                  <div className="text-center md:text-left">
                    <h3 className="font-outfit font-extrabold text-xl text-slate-800 dark:text-white">Showcased Applications</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">A curated collection of production-grade case-studies</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.slice(0, 3).map((proj) => (
                      <div key={proj.id || proj._id} className="rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 overflow-hidden flex flex-col justify-between h-full group hover:border-blue-600/20 dark:hover:border-indigo-500/20 transition-all duration-300">
                        {proj.image && (
                          <div className="h-36 w-full relative overflow-hidden bg-slate-200">
                            <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="p-5 space-y-3 flex-grow flex flex-col justify-between text-left">
                          <div className="space-y-2">
                            <span className="text-[9px] font-extrabold text-blue-600 dark:text-indigo-400 uppercase tracking-widest">{proj.category}</span>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{proj.title}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">{proj.description}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 pt-2">
                            {proj.technologies.slice(0, 3).map((tech, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-slate-200/50 dark:bg-white/5 text-[9px] font-semibold text-slate-500">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer preview note */}
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-white/5 border border-blue-100/50 dark:border-white/5 text-center text-xs text-slate-500 dark:text-slate-400">
                  You can update any of these details using the Projects, Experience, and Settings tabs in the sidebar.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS MANAGEMENT CONSOLE */}
          {activeTab === 'projects' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="font-outfit font-extrabold text-xl text-slate-800 dark:text-white">
                    🚀 Projects Showcase Manager
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add, edit, or remove the project case studies displayed on the public front page.
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
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 dark:bg-indigo-600 hover:bg-blue-500 dark:hover:bg-indigo-500 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add New Project
                </button>
              </div>

              {/* Add/Edit Project Drawer */}
              {showAddProject && (
                <div className="glassmorphism rounded-[24px] p-6 border border-slate-200/50 dark:border-white/10 space-y-6 animate-fade-in">
                  <h4 className="font-outfit font-bold text-base text-slate-800 dark:text-white">
                    {editingProject ? '✏️ Edit Selected Project' : '✨ Add New Project Case-Study'}
                  </h4>

                  <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Project Title</label>
                        <input
                          type="text"
                          required
                          value={projForm.title}
                          onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                          placeholder="e.g. Discover Zone Platform"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Category Tag</label>
                        <select
                          value={projForm.category}
                          onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                        >
                          <option value="MERN">MERN Stack</option>
                          <option value="React Native">React Native Mobile</option>
                          <option value="SQA">QA Automation Framework</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Project Description</label>
                      <textarea
                        required
                        rows={3}
                        value={projForm.description}
                        onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                        placeholder="Brief overview explaining what the application does..."
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none resize-none"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Problem Solved</label>
                        <textarea
                          required
                          rows={2}
                          value={projForm.problemSolved}
                          onChange={(e) => setProjForm({ ...projForm, problemSolved: e.target.value })}
                          placeholder="What engineering bottleneck did you resolve?"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs outline-none resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Your Engineering Role</label>
                        <textarea
                          required
                          rows={2}
                          value={projForm.role}
                          onChange={(e) => setProjForm({ ...projForm, role: e.target.value })}
                          placeholder="e.g. Lead Full-Stack Dev and SQA Architect"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">GitHub URL</label>
                        <input
                          type="text"
                          value={projForm.github}
                          onChange={(e) => setProjForm({ ...projForm, github: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Live Demo URL</label>
                        <input
                          type="text"
                          value={projForm.demo}
                          onChange={(e) => setProjForm({ ...projForm, demo: e.target.value })}
                          placeholder="https://demo.com"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Showcase Image</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={projForm.image}
                            onChange={(e) => setProjForm({ ...projForm, image: e.target.value })}
                            placeholder="URL or Upload ->"
                            className="flex-grow px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs outline-none"
                          />
                          <label className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100/55 dark:bg-white/5 hover:bg-slate-200 hover:border-slate-350 dark:hover:border-white/20 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                            <Paperclip className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept=".png,.jpg,.jpeg"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  setActionError('');
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  formData.append('type', 'project');
                                  const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData
                                  });
                                  if (res.ok) {
                                    const data = await res.json();
                                    setProjForm({ ...projForm, image: data.fileUrl });
                                  } else {
                                    const errData = await res.json();
                                    setActionError(errData.error || 'Failed to upload project image.');
                                  }
                                } catch (err) {
                                  console.error(err);
                                  setActionError('Network error uploading project image.');
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Technologies Used (Comma Separated)</label>
                      <input
                        type="text"
                        required
                        value={projForm.technologies}
                        onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })}
                        placeholder="React, Node.js, Express, MongoDB, Cypress"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                      />
                    </div>

                    <div className="flex gap-3 justify-end items-center pt-2">
                      <button
                        type="button"
                        onClick={() => { setShowAddProject(false); setEditingProject(null); }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md"
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
                    className="glassmorphism rounded-[24px] p-6 border border-slate-200/50 dark:border-white/5 flex flex-col justify-between h-full group relative hover:border-blue-600/20 dark:hover:border-indigo-500/20 transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase bg-blue-50 dark:bg-indigo-500/10 text-blue-600 dark:text-indigo-400 border border-blue-100 dark:border-indigo-500/20">
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
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                            title="Edit project"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id || proj._id || '')}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-outfit font-bold text-lg text-slate-800 dark:text-white mb-2">{proj.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">{proj.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-4">
                      {proj.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-transparent">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WORK EXPERIENCE ROADMAP */}
          {activeTab === 'experience' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="font-outfit font-extrabold text-xl text-slate-800 dark:text-white">
                    💼 Work Experience Console
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add, edit, or delete professional career roadmap listings.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setEditingExp(null);
                    setExpForm({ company: '', role: '', period: '', description: '', type: 'Internship', attachmentUrl: '' });
                    setShowAddExp(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 dark:bg-indigo-600 hover:bg-blue-500 dark:hover:bg-indigo-500 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              </div>

              {/* Add/Edit Experience Form Drawer */}
              {showAddExp && (
                <div className="glassmorphism rounded-[24px] p-6 border border-slate-200/50 dark:border-white/10 space-y-6 animate-fade-in">
                  <h4 className="font-outfit font-bold text-base text-slate-800 dark:text-white">
                    {editingExp ? '✏️ Edit Selected Work Experience' : '💼 Add Professional Work History'}
                  </h4>

                  <form onSubmit={handleExpSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Company Name</label>
                        <input
                          type="text"
                          required
                          value={expForm.company}
                          onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                          placeholder="e.g. TechGlobal Solutions"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Your Engineering Role</label>
                        <input
                          type="text"
                          required
                          value={expForm.role}
                          onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                          placeholder="e.g. SQA Engineer"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Employment Period</label>
                        <input
                          type="text"
                          required
                          value={expForm.period}
                          onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                          placeholder="e.g. Sep 2025 - Mar 2026"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Employment Type</label>
                        <select
                          value={expForm.type}
                          onChange={(e) => setExpForm({ ...expForm, type: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                        >
                          <option value="Internship">Internship</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Responsibility Description</label>
                      <textarea
                        required
                        rows={3}
                        value={expForm.description}
                        onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                        placeholder="Detail your technical tasks, frameworks used, and testing metrics..."
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Reference / Experience Attachment (Optional)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={expForm.attachmentUrl || ''}
                          onChange={(e) => setExpForm({ ...expForm, attachmentUrl: e.target.value })}
                          placeholder="Attachment URL or Upload ->"
                          className="flex-grow px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs outline-none"
                        />
                        <label className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100/55 dark:bg-white/5 hover:bg-slate-200 hover:border-slate-350 dark:hover:border-white/20 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                          <Paperclip className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                setActionError('');
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('type', 'experience');
                                const res = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData
                                });
                                if (res.ok) {
                                  const data = await res.json();
                                  setExpForm({ ...expForm, attachmentUrl: data.fileUrl });
                                } else {
                                  const errData = await res.json();
                                  setActionError(errData.error || 'Failed to upload attachment.');
                                }
                              } catch (err) {
                                console.error(err);
                                  setActionError('Network error uploading attachment.');
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end items-center pt-2">
                      <button
                        type="button"
                        onClick={() => { setShowAddExp(false); setEditingExp(null); }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md"
                      >
                        {editingExp ? 'Save Changes' : 'Add Record'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Experiences Timeline */}
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id || exp._id} className="glassmorphism rounded-[24px] p-6 border border-slate-200/50 dark:border-white/5 flex justify-between items-start gap-4 hover:border-blue-600/20 dark:hover:border-indigo-500/20 transition-all duration-300">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-indigo-500/10 text-blue-600 dark:text-indigo-400 text-[9px] font-bold uppercase tracking-wider">
                          {exp.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {exp.period}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-bold text-lg text-slate-800 dark:text-white">{exp.role}</h4>
                        <p className="text-xs text-blue-600 dark:text-indigo-400 font-bold">{exp.company}</p>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">{exp.description}</p>
                      
                      {exp.attachmentUrl && (
                        <div className="pt-2">
                          <a
                            href={exp.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-indigo-500/10 border border-blue-100 dark:border-indigo-500/20 text-[10px] font-bold text-blue-600 dark:text-indigo-400 hover:bg-blue-100 dark:hover:bg-indigo-500/20 transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View Experience Reference
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button 
                        onClick={() => {
                          setEditingExp(exp);
                          setExpForm({
                            company: exp.company,
                            role: exp.role,
                            period: exp.period,
                            description: exp.description,
                            type: exp.type,
                            attachmentUrl: exp.attachmentUrl || ''
                          });
                          setShowAddExp(true);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="Edit record"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteExp(exp.id || exp._id || '')}
                        className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-500"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CERTIFICATIONS MANAGER */}
          {activeTab === 'certificates' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="font-outfit font-extrabold text-xl text-slate-800 dark:text-white">
                    🎓 Certifications & Credentials
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage certifications showcasing Meta MERN Stack, Automation Testing, or IELTS.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setEditingCert(null);
                    setCertForm({ title: '', issuer: '', date: '', credentialUrl: '', type: 'Academic' });
                    setShowAddCert(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 dark:bg-indigo-600 hover:bg-blue-500 dark:hover:bg-indigo-500 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Certificate
                </button>
              </div>

              {/* Add/Edit Cert Form Drawer */}
              {showAddCert && (
                <div className="glassmorphism rounded-[24px] p-6 border border-slate-200/50 dark:border-white/10 space-y-6 animate-fade-in">
                  <h4 className="font-outfit font-bold text-base text-slate-800 dark:text-white">
                    {editingCert ? '✏️ Edit Selected Certificate' : '🎓 Register New Course Credential'}
                  </h4>

                  <form onSubmit={handleCertSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Certificate Title</label>
                        <input
                          type="text"
                          required
                          value={certForm.title}
                          onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                          placeholder="e.g. MERN Stack Development Masterclass"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Issuing Organization</label>
                        <input
                          type="text"
                          required
                          value={certForm.issuer}
                          onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                          placeholder="e.g. Coursera / Meta"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Year / Date</label>
                        <input
                          type="text"
                          required
                          value={certForm.date}
                          onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                          placeholder="e.g. 2025"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Credential File / Verification Link</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={certForm.credentialUrl}
                            onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                            placeholder="URL or Upload ->"
                            className="flex-grow px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs outline-none"
                          />
                          <label className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100/55 dark:bg-white/5 hover:bg-slate-200 hover:border-slate-350 dark:hover:border-white/20 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                            <Paperclip className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  setActionError('');
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  formData.append('type', 'cert');
                                  const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData
                                  });
                                  if (res.ok) {
                                    const data = await res.json();
                                    setCertForm({ ...certForm, credentialUrl: data.fileUrl });
                                  } else {
                                    const errData = await res.json();
                                    setActionError(errData.error || 'Failed to upload certificate.');
                                  }
                                } catch (err) {
                                  console.error(err);
                                  setActionError('Network error uploading certificate.');
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Certification Category</label>
                        <select
                          value={certForm.type}
                          onChange={(e) => setCertForm({ ...certForm, type: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs outline-none"
                        >
                          <option value="Academic">Academic Degree</option>
                          <option value="Professional">Professional / Work</option>
                          <option value="Technical">Technical / Course</option>
                          <option value="Language">Language Score</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end items-center pt-2">
                      <button
                        type="button"
                        onClick={() => { setShowAddCert(false); setEditingCert(null); }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md"
                      >
                        {editingCert ? 'Save Changes' : 'Register Certificate'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Certifications Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {certifications.map((cert) => (
                  <div key={cert.id || cert._id} className="glassmorphism rounded-[24px] p-5 border border-slate-200/50 dark:border-white/5 flex justify-between items-center gap-4 hover:border-blue-600/20 dark:hover:border-indigo-500/20 transition-all duration-300">
                    <div className="space-y-2 text-left min-w-0">
                      <span className="text-[9px] font-extrabold uppercase text-indigo-500 dark:text-purple-400 tracking-wider block">
                        {cert.type}
                      </span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate max-w-[220px]" title={cert.title}>
                        {cert.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]" title={cert.issuer}>
                        {cert.issuer}
                      </p>
                      <span className="inline-block text-[10px] text-slate-400 font-semibold">{cert.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {cert.credentialUrl && cert.credentialUrl !== '#' && (
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-blue-50 dark:bg-white/5 hover:bg-blue-100 text-blue-600 dark:text-indigo-400"
                          title="Verify credential link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button 
                        onClick={() => {
                          setEditingCert(cert);
                          setCertForm({
                            title: cert.title,
                            issuer: cert.issuer,
                            date: cert.date,
                            credentialUrl: cert.credentialUrl || '',
                            type: cert.type
                          });
                          setShowAddCert(true);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="Edit credential"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCert(cert.id || cert._id || '')}
                        className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-500"
                        title="Delete credential"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: RESUME / CV CONTAINER */}
          {activeTab === 'resume' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="font-outfit font-extrabold text-xl text-slate-800 dark:text-white">
                    📄 Curriculum Vitae Preview
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Review and download the primary PDF resume formatted for embassy/visa and recruiters.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-350 dark:hover:border-white/25 shadow-sm cursor-pointer transition-all">
                    <Paperclip className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
                    Upload New PDF CV
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setActionError('');
                          setActionSuccess('');
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('type', 'resume');
                          const res = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData
                          });
                          if (res.ok) {
                            const data = await res.json();
                            const updateRes = await fetch('/api/auth/session', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                ...adminUser,
                                cvUrl: data.fileUrl,
                                profiles: adminUser.profiles
                              })
                            });
                            if (updateRes.ok) {
                              setActionSuccess('Curriculum Vitae updated successfully!');
                              refreshAllData();
                            } else {
                              setActionError('Failed to save CV configuration.');
                            }
                          } else {
                            const errData = await res.json();
                            setActionError(errData.error || 'Failed to upload CV file.');
                          }
                        } catch (err) {
                          console.error(err);
                          setActionError('Network error uploading CV file.');
                        }
                      }}
                    />
                  </label>
                  
                  {adminUser?.cvUrl && adminUser.cvUrl !== '#' && (
                    <a 
                      href={adminUser.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-700 shadow-md transition-colors"
                    >
                      <FileDown className="w-4 h-4" />
                      Download PDF CV
                    </a>
                  )}
                </div>
              </div>

              {/* Premium Simulated Resume view */}
              <div className="p-8 rounded-[24px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 shadow-sm space-y-6 font-sans">
                {/* Header */}
                <div className="border-b border-slate-200 dark:border-white/10 pb-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="space-y-1">
                    <h2 className="font-outfit font-black text-2xl text-slate-800 dark:text-white">{adminUser?.name || 'Muhammad Hamdan Yaseen'}</h2>
                    <p className="text-sm font-bold text-blue-600 dark:text-indigo-400 uppercase tracking-widest">{adminUser?.title || 'Full Stack Developer & SQA Engineer'}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {adminUser?.location || 'Lahore, Pakistan'}
                    </p>
                  </div>
                  
                  <div className="text-left md:text-right text-xs text-slate-500 space-y-1 font-semibold">
                    <p>Email: {adminUser?.email || 'needmorecoffee99040@gmail.com'}</p>
                    <p>GitHub: github.com</p>
                    <p>LinkedIn: linkedin.com</p>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="space-y-2 text-left">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Professional Summary</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {adminUser?.bio || 'Passionate MERN Stack Developer and Software Quality Assurance (SQA) Engineer. Dedicated to building secure, scalable web applications and ensuring flawless user experiences through comprehensive manual and automated testing.'}
                  </p>
                </div>

                {/* Skills */}
                <div className="space-y-2 text-left">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Core Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {['MERN Stack', 'Next.js', 'Typescript', 'Node.js', 'QA Automation', 'Cypress', 'Postman API Testing', 'CI/CD Pipelines'].map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-slate-100 dark:bg-white/5 text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 font-bold border border-slate-200/50 dark:border-transparent">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience History */}
                <div className="space-y-3 text-left">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Work History</h3>
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id || exp._id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">{exp.role}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold">{exp.period}</span>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-indigo-400 font-bold">{exp.company} • {exp.type}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ENCRYPTED SECURE VAULT PANEL */}
          {activeTab === 'vault' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Documents list card */}
                <div className="glassmorphism rounded-[24px] p-6 border border-slate-200/50 dark:border-white/5 space-y-6 h-full shadow-sm">
                  <div>
                    <h3 className="font-outfit font-bold text-lg text-slate-800 dark:text-white mb-1">
                      📁 Private Document Scan Files
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
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
                            ? 'bg-blue-500/10 border-blue-500/40 text-blue-800 dark:text-indigo-300 dark:bg-indigo-500/10 dark:border-indigo-500/40'
                            : 'bg-slate-100/55 dark:bg-white/5 border-slate-200/50 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-indigo-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-xs sm:text-sm truncate">{doc.name}</h4>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">{doc.type}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400" title="Preview document">
                            <Eye className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Upload and Temporary Link Generator */}
                <div className="space-y-6">
                  {/* Upload New Secure Document Card */}
                  <div className="glassmorphism rounded-[24px] p-6 border border-slate-200/50 dark:border-white/5 space-y-6 shadow-sm">
                    <div>
                      <h3 className="font-outfit font-bold text-lg text-slate-800 dark:text-white mb-1">
                        📤 Upload New Encrypted Document
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Encrypt credentials dynamically to prevent unauthorized manipulation.
                      </p>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const file = formData.get('secureFile') as File | null;
                        if (!file) {
                          setActionError('Please select a file.');
                          return;
                        }

                        setActionError('');
                        setActionSuccess('');

                        const reader = new FileReader();
                        reader.onloadend = async () => {
                          const base64Content = reader.result as string;
                          try {
                            const res = await fetch('/api/vault/documents', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                name: formData.get('docName'),
                                type: formData.get('docType'),
                                fileName: file.name,
                                fileContent: base64Content,
                                watermarkText: formData.get('watermarkText')
                              })
                            });

                            if (res.ok) {
                              setActionSuccess('Document encrypted and logged in vault!');
                              refreshAllData();
                              e.currentTarget.reset();
                            } else {
                              const errData = await res.json();
                              setActionError(errData.error || 'Failed to encrypt document.');
                            }
                          } catch (err) {
                            console.error(err);
                            setActionError('Network error encrypting secure file.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="space-y-4 text-xs"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Document Name</label>
                          <input
                            type="text"
                            name="docName"
                            required
                            placeholder="e.g. BSCS Degree Scan"
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 outline-none"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Document Type</label>
                          <select
                            name="docType"
                            required
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 outline-none font-bold"
                          >
                            <option value="DEGREE">DEGREE</option>
                            <option value="TRANSCRIPT">TRANSCRIPT</option>
                            <option value="PASSPORT">PASSPORT</option>
                            <option value="IELTS">IELTS SCORE</option>
                            <option value="OTHER">OTHER SCAN</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Watermark text</label>
                          <input
                            type="text"
                            name="watermarkText"
                            defaultValue="FOR VISA VERIFICATION - CONFIDENTIAL"
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PDF or Image Scan</label>
                          <input
                            type="file"
                            name="secureFile"
                            accept=".pdf,.png,.jpg,.jpeg"
                            required
                            className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-600 dark:file:bg-indigo-500/10 dark:file:text-indigo-400 hover:file:bg-blue-100 cursor-pointer"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl font-bold text-white bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-700 transition-colors shadow-md cursor-pointer text-xs uppercase tracking-wider"
                      >
                        Encrypt and Save Scan
                      </button>
                    </form>
                  </div>

                  {/* Secure link generator card */}
                  <div className="glassmorphism rounded-[24px] p-6 border border-slate-200/50 dark:border-white/5 space-y-6 shadow-sm">
                    <div>
                      <h3 className="font-outfit font-bold text-lg text-slate-800 dark:text-white mb-1">
                        🔗 Temporary Secure Link Generator
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Creates an expiring access URL for visa offices, recruiters, or embassies.
                      </p>
                    </div>

                    <form onSubmit={handleGenerateShareLink} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">
                          Target Document File
                        </label>
                        <select
                          required
                          value={shareDocId}
                          onChange={(e) => setShareDocId(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
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
                          <label className="text-xs font-bold text-slate-500">
                            Link Duration (Hours)
                          </label>
                          <select
                            value={shareHours}
                            onChange={(e) => setShareHours(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                          >
                            <option value="1">1 Hour</option>
                            <option value="12">12 Hours</option>
                            <option value="24">24 Hours (Recommended)</option>
                            <option value="72">3 Days</option>
                            <option value="168">7 Days</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500">
                            Custom Watermark Overlaid
                          </label>
                          <input
                            type="text"
                            required
                            value={shareWatermark}
                            onChange={(e) => setShareWatermark(e.target.value)}
                            placeholder="FOR RECRUITER ONLY"
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!shareDocId}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/40 disabled:text-slate-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors shadow-lg cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate Shareable Token Link
                      </button>
                    </form>

                    {generatedLink && (
                      <div className="mt-4 p-4 rounded-[20px] bg-blue-50/50 dark:bg-indigo-950/40 border border-blue-200/50 dark:border-indigo-500/20 space-y-2.5 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-indigo-400">Expiring Visitor Link</span>
                          <span className="text-[10px] text-slate-400 font-semibold">Secure AES Token Generated</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={generatedLink}
                            className="flex-grow px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 text-xs outline-none"
                          />
                          <button
                            onClick={handleCopyLink}
                            className="p-2 rounded-lg bg-blue-600 dark:bg-indigo-600 hover:bg-blue-500 dark:hover:bg-indigo-500 text-white flex items-center justify-center cursor-pointer"
                            title="Copy Link"
                          >
                            {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          This URL lets guests view this file without a login. The watermark: <span className="font-semibold text-slate-600 dark:text-slate-400">"{shareWatermark}"</span> is locked inside.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Watermarked preview container */}
              {viewerDoc && (
                <div className="glassmorphism rounded-[24px] p-6 border border-slate-200/60 dark:border-white/10 space-y-6 animate-fade-in shadow-sm">
                  <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
                    <div>
                      <h3 className="font-outfit font-extrabold text-lg text-slate-800 dark:text-white">
                        🔒 Secure Document Viewer
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Reviewing {viewerDoc.name} ({viewerDoc.fileName})
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-indigo-500/10 border border-blue-200 dark:border-indigo-500/20 text-[10px] sm:text-xs font-semibold text-blue-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                        Watermark: "{viewerDoc.watermarkText}"
                      </div>
                      <button
                        onClick={() => setViewerDoc(null)}
                        className="px-3 py-1 text-xs bg-slate-200/70 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
                      >
                        Close View
                      </button>
                    </div>
                  </div>

                  {/* Watermarked Simulated Paper Viewer */}
                  <div className="relative border border-slate-200 dark:border-white/5 rounded-2xl h-[450px] w-full bg-white dark:bg-slate-950 overflow-hidden flex flex-col justify-between p-8 font-serif shadow-inner">
                    
                    {/* Visual Non-Removable Watermark Overlay Grid */}
                    <div className="absolute inset-0 z-20 pointer-events-none select-none opacity-[0.05] dark:opacity-[0.08] flex flex-wrap items-center justify-center gap-16 p-4 overflow-hidden rotate-[-25deg] scale-125">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <span key={i} className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-300 font-sans tracking-widest uppercase whitespace-nowrap">
                          {viewerDoc.watermarkText}
                        </span>
                      ))}
                    </div>

                    {/* Content of the Document */}
                    <div className="relative z-10 w-full h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start border-b-2 border-slate-200 dark:border-slate-700 pb-4">
                        <div className="text-left font-sans">
                          <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-300 tracking-wider">OFFICIAL ACADEMIC VERIFICATION</h2>
                          <p className="text-[9px] text-slate-400 font-mono tracking-widest mt-1">RECORD KEY: {viewerDoc.id || viewerDoc._id}</p>
                        </div>
                        <div className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[9px] uppercase tracking-wider rounded font-bold">
                          CONFIDENTIAL RECORD
                        </div>
                      </div>

                      <div className="my-8 space-y-6 text-slate-600 dark:text-slate-300 text-left font-serif leading-relaxed text-xs sm:text-sm">
                        <p>
                          This document serves as verification of degrees and achievements of applicant:
                        </p>
                        
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
                          <p><strong className="text-slate-500 dark:text-slate-400">Graduate Name:</strong> Muhammad Hamdan Yaseen</p>
                          <p><strong className="text-slate-500 dark:text-slate-400">Award Title:</strong> Bachelor of Science in Computer Science (BS CS)</p>
                          <p><strong className="text-slate-500 dark:text-slate-400">Issuing Authority:</strong> University Of Okara</p>
                          <p><strong className="text-slate-500 dark:text-slate-400">Language Score:</strong> IELTS English Band 7.5 Certified</p>
                          <p><strong className="text-slate-500 dark:text-slate-400">Operational Focus:</strong> MERN Web Developer | QA Automation Specialist</p>
                        </div>

                        <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-sans italic leading-relaxed">
                          Note: This visual representation is generated securely by Hamdan's encrypted Next.js vault dashboard. It corresponds to verified credential logs stored in local memory databases.
                        </p>
                      </div>

                      <div className="flex justify-between items-end border-t border-slate-200 dark:border-slate-800 pt-4 mt-auto">
                        <div className="text-left font-sans">
                          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">SYSTEM TIMESTAMP</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono font-semibold">{new Date(viewerDoc.uploadedAt).toLocaleString()}</p>
                        </div>
                        
                        <div className="text-right font-sans">
                          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1">VERIFICATION STATUS</p>
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
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

          {/* TAB 8: MESSAGES INBOX */}
          {activeTab === 'messages' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div>
                <h3 className="font-outfit font-extrabold text-xl text-slate-800 dark:text-white">
                  ✉️ Incoming Recruitment Messages
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Submissions logged directly from the homepage contact portal.
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="glassmorphism rounded-[24px] p-12 text-center text-slate-500 border border-slate-200/50 dark:border-white/5 font-semibold shadow-sm">
                  Inbox is currently empty.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id || msg._id}
                      className="glassmorphism rounded-[24px] p-6 border border-slate-200/50 dark:border-white/5 relative group space-y-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="text-left">
                          <h4 className="font-outfit font-bold text-base text-slate-850 dark:text-white">{msg.name}</h4>
                          <a href={`mailto:${msg.email}`} className="text-xs text-blue-600 dark:text-indigo-400 hover:underline font-semibold">
                            {msg.email}
                          </a>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
                            {new Date(msg.sentAt).toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleDeleteMessage(msg.id || msg._id || '')}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/25 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-all cursor-pointer"
                            title="Delete Message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 space-y-2">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Subject: <span className="text-slate-900 dark:text-white">{msg.subject}</span>
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                          {msg.message}
                        </p>
                        
                        {msg.attachmentUrl && (
                          <div className="pt-2 border-t border-slate-200 dark:border-white/5 mt-2 flex items-center">
                            <a
                              href={msg.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all"
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              View Recruiter Attachment
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: SETTINGS / BRANDING METADATA */}
          {activeTab === 'settings' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div>
                <h3 className="font-outfit font-extrabold text-xl text-slate-800 dark:text-white">
                  ⚙️ Profile Settings
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your branding metadata rendered across the public homepages and dashboards.
                </p>
              </div>

              <div className="glassmorphism rounded-[24px] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 shadow-sm">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        defaultValue={adminUser?.name || 'Muhammad Hamdan Yaseen'}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Role Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        defaultValue={adminUser?.title || 'Full Stack Developer | SQA Engineer'}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        defaultValue={adminUser?.email || 'needmorecoffee99040@gmail.com'}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location Area</label>
                      <input
                        type="text"
                        name="location"
                        required
                        defaultValue={adminUser?.location || 'Lahore, Pakistan'}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">GitHub URL</label>
                      <input
                        type="text"
                        name="github"
                        defaultValue={adminUser?.profiles?.github || 'https://github.com'}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">LinkedIn URL</label>
                      <input
                        type="text"
                        name="linkedin"
                        defaultValue={adminUser?.profiles?.linkedin || 'https://linkedin.com'}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upwork URL</label>
                      <input
                        type="text"
                        name="upwork"
                        defaultValue={adminUser?.profiles?.upwork || 'https://upwork.com'}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Bio Summary</label>
                    <textarea
                      name="bio"
                      required
                      rows={4}
                      defaultValue={adminUser?.bio || 'Passionate MERN Stack Developer and Software Quality Assurance (SQA) Engineer. Dedicated to building secure, scalable web applications and ensuring flawless user experiences through comprehensive manual and automated testing.'}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md cursor-pointer"
                  >
                    Save branding configurations
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
