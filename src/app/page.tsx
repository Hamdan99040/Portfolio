import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Education from '@/components/Education';
import SkillsGrid from '@/components/SkillsGrid';
import ProjectsGrid from '@/components/ProjectsGrid';
import Experience from '@/components/Experience';
import Certifications from '@/components/Certifications';
import ResumeCenter from '@/components/ResumeCenter';
import ContactForm from '@/components/ContactForm';
import Chatbot from '@/components/Chatbot';
import Link from 'next/link';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Dynamic Background Glowing Gradients - Subtle Blue Only */}
      <div className="absolute top-0 left-1/4 w-[50rem] h-[50rem] rounded-full bg-blue-500/[0.03] dark:bg-blue-500/[0.02] blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-1/4 w-[40rem] h-[40rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.01] blur-[120px] pointer-events-none" />

      {/* Global Glassmorphic Floating Navigation Header */}
      <Navbar />

      {/* Core Public Sections in Alternating Colors */}
      <main className="flex-grow">
        {/* Section 1: Introduction & Glowing Avatar Banner (Base: White) */}
        <Hero />

        {/* Section 2: Biography & Academic Timeline (Alt: F8FAFC) */}
        <About />

        {/* Section 3: Educational Timeline (Base: White) */}
        <Education />

        {/* Section 4: Technical Skills Matrix Grid (Alt: F8FAFC) */}
        <SkillsGrid />

        {/* Section 5: Filterable Projects Showcase Case-Studies (Base: White) */}
        <ProjectsGrid />

        {/* Section 6: Work Experience (Alt: F8FAFC) */}
        <Experience />

        {/* Section 7: Standalone Certifications (Base: White) */}
        <Certifications />

        {/* Section 8: Downloadable Resume Center (Alt: F8FAFC) */}
        <ResumeCenter />

        {/* Section 9: Inquiries and Secure Message Logging (Base: White) */}
        <ContactForm />
      </main>

      {/* Persistent Floating Chatbot Agent Helper */}
      <Chatbot />

      {/* Premium Dark Footer with Secure Dashboard Portal */}
      <footer className="w-full py-16 px-6 border-t border-white/5 bg-[#030408] relative z-10 text-xs sm:text-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/10">
              H
            </div>
            <div className="text-left">
              <p className="font-outfit font-black text-slate-200 tracking-tight">HAMDAN.DEV</p>
              <p className="text-slate-500 text-[11px] font-medium mt-0.5">
                &copy; {new Date().getFullYear()} Muhammad Hamdan. All rights reserved.
              </p>
            </div>
          </div>

          {/* Bottom Nav Links & Shortcut */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 text-slate-400 font-bold">
            <Link href="#about" className="hover:text-blue-400 transition-colors">About</Link>
            <Link href="#education" className="hover:text-blue-400 transition-colors">Education</Link>
            <Link href="#skills" className="hover:text-blue-400 transition-colors">Skills</Link>
            <Link href="#projects" className="hover:text-blue-400 transition-colors">Projects</Link>
            <Link href="#experience" className="hover:text-blue-400 transition-colors">Experience</Link>
            <Link href="#certifications" className="hover:text-blue-400 transition-colors">Certifications</Link>
            <Link href="#resume" className="hover:text-blue-400 transition-colors">Resumes</Link>
            <Link href="#contact" className="hover:text-blue-400 transition-colors">Contact</Link>
            
            {/* Private Vault shortcut */}
            <Link
              href="/vault"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-600 hover:border-transparent transition-all duration-300 shadow-sm shadow-blue-500/5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Secure Documents Vault
            </Link>
          </div>
        </div>
        
        {/* Heart watermark note */}
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/[0.03] text-center text-[10px] text-slate-600 flex items-center justify-center gap-1 font-bold">
          Designed with <Heart className="w-3.5 h-3.5 text-blue-500 fill-blue-500" /> for international recruiters & visa verification.
        </div>
      </footer>
    </div>
  );
}
