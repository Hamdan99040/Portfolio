'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'py-4 bg-[#060814]/80 backdrop-blur-lg border-b border-white/5 shadow-lg shadow-indigo-950/10' 
        : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="#home" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            Z
          </div>
          <span className="font-outfit font-bold text-lg tracking-wider text-white group-hover:text-indigo-400 transition-colors duration-300">
            ZAIN<span className="text-indigo-500">.</span>QA
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={`#${link.id}`}
                  className={`relative py-2 text-slate-300 hover:text-white transition-colors duration-300 ${
                    activeSection === link.id ? 'text-white' : ''
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Secure Vault Portal CTA */}
          <Link
            href="/vault"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-950/40 border border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-950/80 shadow-md hover:shadow-indigo-500/10 transition-all duration-300 group"
          >
            <Lock className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300 group-hover:scale-110 transition-all duration-300" />
            Secure Vault
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-4">
          <Link
            href="/vault"
            className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-400 hover:text-indigo-300"
          >
            <Lock className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] z-40 bg-[#060814]/95 backdrop-blur-xl border-t border-white/5 flex flex-col justify-between py-8 px-6 animate-fade-in">
          <ul className="flex flex-col gap-6 text-lg font-medium">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={`#${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 ${
                    activeSection === link.id 
                      ? 'text-indigo-400 font-semibold' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="flex flex-col gap-4">
            <Link
              href="/vault"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all duration-300"
            >
              <ShieldCheck className="w-5 h-5" />
              Access Private Secure Vault
            </Link>
            <p className="text-center text-xs text-slate-500">
              Authorized personnel only. Secure 2FA enforced.
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}
