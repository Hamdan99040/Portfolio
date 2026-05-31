'use client';

import { Calendar, GraduationCap, Globe, Award, Download, Code, ShieldCheck } from 'lucide-react';

export default function About() {
  const highlights = [
    { icon: GraduationCap, label: 'BS Computer Science', sub: 'University of Okara · 2022–2026', color: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-500/[0.08] dark:border-blue-500/15 dark:text-blue-400' },
    { icon: Award,         label: 'IELTS Band 7.5',       sub: 'British Council · 2026',           color: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-500/[0.08] dark:border-blue-500/15 dark:text-blue-400' },
    { icon: Code,          label: 'MERN Stack Expert',     sub: 'React · Node · MongoDB',           color: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-500/[0.08] dark:border-blue-500/15 dark:text-blue-400' },
    { icon: ShieldCheck,   label: 'SQA Engineer',          sub: 'Cypress · Postman · Manual QA',   color: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-500/[0.08] dark:border-blue-500/15 dark:text-blue-400' },
    { icon: Globe,         label: 'International Ready',   sub: 'Germany · Australia · Remote',     color: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-500/[0.08] dark:border-blue-500/15 dark:text-blue-400' },
  ];

  const timelineEvents = [
    {
      icon: <GraduationCap className="w-5 h-5" />,
      date: '2022 – 2026',
      title: 'BS Computer Science',
      institution: 'University of Okara',
      description:
        'Graduated with strong academic standing. Studied Software Engineering, Database Systems, Web Engineering, Data Structures, and Quality Assurance frameworks. Led development and testing for the Discover Zone final year project.',
    },
    {
      icon: <Award className="w-5 h-5" />,
      date: '2026',
      title: 'IELTS English Proficiency',
      institution: 'British Council Certification',
      description:
        'Achieved Band Score 7.5 — demonstrating exceptional professional written and verbal English communication capabilities essential for international workplaces in Germany, Australia, and beyond.',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      date: 'Goal',
      title: 'International Career',
      institution: 'Germany · Australia · Remote',
      description:
        'Actively targeting international engineering teams. Combining MERN full-stack expertise with Cypress automated QA to deliver high-quality, zero-regression features for global product companies.',
    },
  ];

  return (
    <section
      id="about"
      className="py-28 relative overflow-hidden section-alt transition-colors duration-500"
    >
      {/* Far-background glow */}
      <div className="absolute top-[5%] right-[5%] w-[40rem] h-[40rem] rounded-full bg-blue-500/[0.025] dark:bg-blue-600/[0.04] blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-4">
            Who I Am
          </p>
          <h2 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white mb-5 tracking-tight">
            About{' '}
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent">
              My Journey
            </span>
          </h2>
          <div className="w-16 h-[3px] bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full mb-6" />
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Bridging software development and quality assurance to deliver robust, world-class web products.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* ── Bio column ── */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div>
              <h3 className="font-outfit font-black text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight mb-4">
                Who is{' '}
                <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  Hamdan?
                </span>
              </h3>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <p>
                  I&apos;m a software engineer who loves both building applications and proving their resilience. With expertise in MERN stack development and Cypress automation testing, I approach code from a dual perspective: clean architecture with bulletproof verification built in.
                </p>
                <p>
                  I believe modern products must have premium visual designs <em>and</em> robust operational quality. Whether it&apos;s automated integration tests, API verification suites, or manual UI audits — every release I ship is production-ready.
                </p>
              </div>
            </div>

            {/* Highlight pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map(({ icon: Icon, label, sub, color }) => (
                <div
                  key={label}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border ${color} transition-all duration-300`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">{label}</p>
                    <p className="text-[10px] font-medium opacity-70 mt-0.5 leading-tight">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href="/CV_Hamdan.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.99] transition-all duration-300 text-sm"
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] hover:border-blue-200 dark:hover:border-blue-500/20 hover:bg-blue-50/40 active:scale-[0.99] transition-all duration-300 text-sm"
              >
                Contact Me
              </a>
            </div>
          </div>

          {/* ── Timeline column ── */}
          <div className="lg:col-span-7 relative pl-10 timeline-line space-y-10">
            {timelineEvents.map((ev, i) => (
              <div key={i} className="relative group text-left">
                {/* Node */}
                <div className="absolute -left-[41px] top-2.5 w-10 h-10 rounded-2xl bg-white dark:bg-[#07091a] border border-slate-200 dark:border-white/[0.07] text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-md group-hover:shadow-blue-600/20 transition-all duration-400">
                  {ev.icon}
                </div>

                {/* Card */}
                <div className="card-surface rounded-2xl p-7 ml-4 group-hover:border-blue-200 dark:group-hover:border-blue-500/20">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/[0.10] border border-blue-100 dark:border-blue-500/15 px-2.5 py-1 rounded-lg">
                      <Calendar className="w-3 h-3" />
                      {ev.date}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Verified Record
                    </span>
                  </div>
                  <h4 className="font-outfit font-black text-lg text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {ev.title}
                  </h4>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-wide">
                    {ev.institution}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {ev.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
