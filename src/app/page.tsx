import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import SkillsGrid from '@/components/SkillsGrid';
import ProjectsGrid from '@/components/ProjectsGrid';
import Experience from '@/components/Experience';
import ContactForm from '@/components/ContactForm';
import Chatbot from '@/components/Chatbot';
import Link from 'next/link';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#060814]">
      {/* Dynamic Background Glowing Gradients */}
      <div className="absolute top-0 left-1/4 w-[50rem] h-[50rem] rounded-full bg-indigo-500/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-1/4 w-[40rem] h-[40rem] rounded-full bg-purple-500/[0.02] blur-[120px] pointer-events-none" />

      {/* Global Glassmorphic Floating Navigation Header */}
      <Navbar />

      {/* Core Public Sections */}
      <main className="flex-grow">
        {/* Section 1: Introduction & Glowing Avatar Banner */}
        <Hero />

        {/* Section 2: Biography & Academic / IELTS Timeline */}
        <About />

        {/* Section 3: Technical Skills Matrix Grid */}
        <SkillsGrid />

        {/* Section 4: Filterable Projects Showcase Case-Studies */}
        <ProjectsGrid />

        {/* Section 5: Work Experience and Course Credentials */}
        <Experience />

        {/* Section 6: Inquiries and Secure Message Logging */}
        <ContactForm />
      </main>

      {/* Persistent Floating Chatbot Agent Helper */}
      <Chatbot />

      {/* Premium Footer with Secure Dashboard Portal */}
      <footer className="w-full py-12 px-6 border-t border-white/5 bg-[#03050d] relative z-10 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              Z
            </div>
            <p className="text-slate-500 text-left">
              &copy; {new Date().getFullYear()} Zain Ul Abadin. All rights reserved.
            </p>
          </div>

          {/* Bottom links */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400 font-medium">
            <Link href="#about" className="hover:text-indigo-400 transition-colors">About</Link>
            <Link href="#skills" className="hover:text-indigo-400 transition-colors">Skills</Link>
            <Link href="#projects" className="hover:text-indigo-400 transition-colors">Projects</Link>
            <Link href="#contact" className="hover:text-indigo-400 transition-colors">Contact</Link>
            
            {/* Private Vault shortcut */}
            <Link
              href="/vault"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-400 hover:text-white hover:bg-indigo-600 hover:border-transparent transition-all duration-300"
            >
              <ShieldCheck className="w-4 h-4" />
              Secure Documents Vault
            </Link>
          </div>
        </div>
        
        {/* Heart watermark note */}
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-white/[0.03] text-center text-[10px] text-slate-600 flex items-center justify-center gap-1">
          Designed with <Heart className="w-3 h-3 text-indigo-500 fill-indigo-500" /> for international recruiters & visa verification.
        </div>
      </footer>
    </div>
  );
}
