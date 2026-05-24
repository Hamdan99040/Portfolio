'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail, ShieldAlert } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Neon Glows */}
      <div className="absolute top-[20%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[25rem] h-[25rem] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center relative z-10 w-full">
        {/* Bio Text Column */}
        <div className="md:col-span-7 flex flex-col items-start text-left">
          {/* Availability Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 animate-pulse-ring">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for International Roles (Germany/Australia)
          </div>

          {/* Heading */}
          <h1 className="font-outfit font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-6 leading-[1.1]">
            Hey, I'm <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Zain Ul Abadin</span>
          </h1>

          <h2 className="font-outfit font-bold text-lg sm:text-2xl text-slate-300 mb-6">
            Full Stack Developer <span className="text-indigo-500">|</span> SQA Engineer <span className="text-indigo-500">|</span> MERN Specialist
          </h2>

          <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
            I bridge the gap between building high-security, scalable MERN stack web applications and ensuring flawless operational quality through automated Cypress/Postman pipeline testing. Graduated with a BS CS from the University of Okara, IELTS Band 7.5 certified, and ready for modern product engineering teams.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Link
              href="#projects"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/40 transition-all duration-300 group"
            >
              Explore Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#contact"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              Get In Touch
            </a>
            <a
              href="/CV_Zain_Ul_Abadin.pdf"
              download
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/20 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Download CV
            </a>
          </div>

          {/* Social Profiles Grid */}
          <div className="flex items-center gap-4 text-slate-500">
            <span className="text-xs uppercase tracking-widest font-semibold text-slate-600">Connect:</span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300" aria-label="GitHub">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors duration-300" aria-label="LinkedIn">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://upwork.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors duration-300" aria-label="Upwork">
              <span className="text-xs font-extrabold uppercase border border-slate-500 rounded px-1 group-hover:border-emerald-400">Up</span>
            </a>
            <a href="mailto:zain@portfolio.com" className="hover:text-purple-400 transition-colors duration-300" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Animated Avatar Column */}
        <div className="md:col-span-5 flex justify-center items-center">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-[350px] md:h-[350px] flex justify-center items-center">
            {/* Pulsing decorative outer rings */}
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/10 animate-pulse-ring" />
            <div className="absolute inset-4 rounded-full border-2 border-purple-500/5 animate-pulse-ring" style={{ animationDelay: '1.5s' }} />
            
            {/* Avatar Glowing Frame */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full p-2.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 animate-avatar-glow overflow-hidden">
              <div className="relative w-full h-full rounded-full bg-[#060814] overflow-hidden flex items-center justify-center">
                {/* Fallback to interactive premium text if image fails, else load Next.js dynamic image */}
                <Image
                  src="/avatar.png"
                  alt="Zain Ul Abadin Portfolio Headshot"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
