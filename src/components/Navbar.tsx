'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Menu, X, ShieldCheck, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection]  = useState('home');
  const [theme, setTheme]                  = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'education', 'skills', 'projects', 'experience', 'certifications', 'contact'];
      const y = window.scrollY + 180;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const navLinks = [
    { id: 'home',         label: 'Home' },
    { id: 'about',        label: 'About' },
    { id: 'education',    label: 'Education' },
    { id: 'skills',       label: 'Skills' },
    { id: 'projects',     label: 'Projects' },
    { id: 'experience',   label: 'Experience' },
    { id: 'certifications', label: 'Certs' },
    { id: 'contact',      label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 bg-white/90 dark:bg-[#060814]/92 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/[0.05] shadow-sm shadow-slate-900/[0.04]'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="#home" className="flex items-center gap-2.5 group" aria-label="Home">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-base text-white shadow-md shadow-blue-600/25 group-hover:bg-blue-700 transition-colors duration-300">
            H
          </div>
          <span className="font-outfit font-bold text-base tracking-wide text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            HAMDAN<span className="text-blue-600 dark:text-blue-400">.</span>DEV
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          <ul className="flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={`#${link.id}`}
                  className={`relative px-3 py-2 rounded-lg transition-colors duration-300 ${
                    activeSection === link.id
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.10] text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Vault CTA */}
          <Link
            href="/vault"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/[0.10] border border-blue-200/60 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/30 shadow-sm transition-all duration-300 group"
          >
            <Lock className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
            Secure Vault
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
          <Link
            href="/vault"
            className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/[0.10] border border-blue-200/60 dark:border-blue-500/20 text-blue-600 dark:text-blue-400"
            aria-label="Secure Vault"
          >
            <Lock className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] z-40 bg-white/98 dark:bg-[#060814]/98 backdrop-blur-xl border-t border-slate-200 dark:border-white/[0.05] flex flex-col justify-between py-8 px-6 animate-fade-in">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={`#${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    activeSection === link.id
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3">
            <Link
              href="/vault"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all duration-300"
            >
              <ShieldCheck className="w-5 h-5" />
              Access Secure Vault
            </Link>
            <p className="text-center text-xs text-slate-400 dark:text-slate-600">
              Authorized access only · Session audited
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}
