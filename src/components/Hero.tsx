'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail, MapPin, Star } from 'lucide-react';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.10 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const avatarAnim = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden section-base transition-colors duration-300"
    >
      {/* Far-background ambient blobs — very faint, far from content */}
      <div className="absolute top-[-10%] left-[-5%] w-[55rem] h-[55rem] rounded-full bg-blue-500/[0.025] dark:bg-blue-600/[0.04] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[45rem] h-[45rem] rounded-full bg-blue-400/[0.02] dark:bg-blue-500/[0.03] blur-[160px] pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-16 items-center relative z-10 w-full"
      >
        {/* ── Text Column ── */}
        <div className="md:col-span-7 flex flex-col items-start text-left space-y-7">

          {/* Availability badge */}
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-semibold shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Open to International Roles · Germany &amp; Australia
          </motion.div>

          {/* Heading */}
          <motion.div variants={item} className="space-y-3">
            <h1 className="font-outfit font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.07]">
              Hey, I&apos;m{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent">
                  Hamdan
                </span>
                {/* Underline accent */}
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 to-blue-400 rounded-full opacity-50" />
              </span>
            </h1>
            <h2 className="font-outfit font-semibold text-lg sm:text-xl text-slate-500 dark:text-slate-400 tracking-wide">
              Full Stack Developer &nbsp;·&nbsp; SQA Engineer &nbsp;·&nbsp; MERN Specialist
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={item}
            className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed"
          >
            I build high-security, scalable MERN stack applications and ensure flawless quality through automated Cypress &amp; Postman testing pipelines.
            BS CS from{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              University of Okara
            </span>{' '}
            · IELTS Band{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">7.5</span>.
          </motion.p>

          {/* Location pill */}
          <motion.div
            variants={item}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500 font-medium"
          >
            <MapPin className="w-3.5 h-3.5" />
            Okara, Pakistan — available for remote &amp; relocation
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-3 pt-1"
          >
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group"
            >
              View Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] hover:border-blue-200 dark:hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-blue-500/[0.06] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
              Contact Me
            </a>

            <a
              href="/CV_Hamdan.pdf"
              download
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/[0.08] transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Download CV
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            variants={item}
            className="flex items-center gap-5 pt-2"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-600">
              Connect
            </span>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:needmorecoffee99040@gmail.com"
              aria-label="Email"
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            >
              <Mail className="w-5 h-5" />
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={item}
            className="flex flex-wrap gap-3 pt-1"
          >
            {[
              { icon: Star, label: 'IELTS Band 7.5' },
              { icon: Star, label: 'BS Computer Science' },
              { icon: Star, label: 'Devzox Intern' },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                <Icon className="w-3 h-3 text-blue-500" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Avatar Column ── */}
        <motion.div
          variants={avatarAnim}
          className="md:col-span-5 flex justify-center items-center relative"
        >
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-[360px] md:h-[360px] flex justify-center items-center">
            {/* Soft ambient glow under avatar */}
            <div className="absolute -inset-6 bg-gradient-to-tr from-blue-600/[0.08] to-blue-400/[0.06] rounded-full blur-2xl pointer-events-none" />

            {/* Pulsing outer rings */}
            <div className="absolute inset-0 rounded-full border border-blue-200/40 dark:border-blue-500/10 animate-pulse-ring" />
            <div className="absolute inset-5 rounded-full border border-blue-200/25 dark:border-blue-500/[0.06] animate-pulse-ring" style={{ animationDelay: '1.8s' }} />

            {/* Avatar frame — clean blue gradient ring */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-[320px] md:h-[320px] rounded-full p-[3px] bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-400 shadow-2xl shadow-blue-500/[0.12] animate-avatar-glow overflow-hidden flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-slate-100 dark:bg-[#060814] overflow-hidden">
                <Image
                  src="/avatar.jpg"
                  alt="Muhammad Hamdan — Full Stack Developer & SQA Engineer"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Floating badge — top right */}
            <div className="absolute top-4 -right-4 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] shadow-lg text-xs font-bold text-slate-700 dark:text-white animate-float">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Available
            </div>

            {/* Floating badge — bottom left */}
            <div className="absolute bottom-8 -left-6 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] shadow-lg text-xs font-bold text-blue-600 dark:text-blue-400" style={{ animationDelay: '2s' }}>
              <span className="text-sm">🎓</span>
              BS CS · UO
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
