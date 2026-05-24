'use client';

import { Calendar, GraduationCap, Globe, Award, Sparkles, Download } from 'lucide-react';

export default function About() {
  const timelineEvents = [
    {
      icon: <GraduationCap className="w-5 h-5" />,
      date: '2022 - 2026',
      title: 'BS Computer Science',
      institution: 'University of Okara',
      description: 'Graduated with high honors. Studied Software Engineering, Database Systems, Web Engineering, and Quality Assurance frameworks. Spearheaded development and testing for multiple student-led software products.'
    },
    {
      icon: <Award className="w-5 h-5" />,
      date: '2026',
      title: 'IELTS English Proficiency',
      institution: 'British Council Certification',
      description: 'Achieved an outstanding Band Score of 7.5, demonstrating exceptional professional written and verbal English communication capabilities necessary for German, Australian, and international workplaces.'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      date: 'Future Goals',
      title: 'International Career Integration',
      institution: 'Germany & Australia Alignment',
      description: 'Actively preparing to contribute to agile international dev teams. Combining MERN full-stack development expertise with Cypress automated QA testing to provide high-quality, end-to-end features with zero regressions.'
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#060814]/20">
      {/* Background neon glows */}
      <div className="absolute top-[20%] left-[5%] w-[25rem] h-[25rem] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-white mb-4">
            About <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">My Journey</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Bridging Software Development and Quality Assurance to deliver robust, state-of-the-art web products.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Biographical column */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h3 className="font-outfit font-bold text-2xl text-white">
              Who is <span className="text-indigo-400">Zain Ul Abadin</span>?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              I am a specialized software engineer who enjoys both creating applications and proving their resilience. With my training in MERN stack (MongoDB, Express, React, Node) and Cypress automation testing, I approach code with a dual perspective: building features with a clean architecture while keeping verification in mind.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              I believe modern products must not only have premium visual designs, but also undergo robust operational checking. Whether it is automated integration tests, API verification suites, or manual UI edge-case audits, I strive to make sure every release is resilient.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="/CV_Zain_Ul_Abadin.pdf"
                download
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                Download Complete CV
              </a>
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                Schedule A Meeting
              </a>
            </div>
          </div>

          {/* Timeline Column */}
          <div className="lg:col-span-7 space-y-8 relative pl-6 sm:pl-8 before:absolute before:left-3.5 sm:before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-indigo-500 before:via-purple-500 before:to-transparent">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative group text-left animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                {/* Timeline Icon Node */}
                <div className="absolute -left-[30px] sm:-left-[38px] top-1.5 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white group-hover:border-transparent group-hover:scale-105 transition-all duration-500">
                  {event.icon}
                </div>

                {/* Content Card */}
                <div className="glassmorphism rounded-2xl p-6 border border-white/5 hover:border-indigo-500/20 transition-all duration-300 relative ml-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                      {event.date}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Verified Record
                    </span>
                  </div>
                  <h4 className="font-outfit font-bold text-lg text-white mb-1 group-hover:text-indigo-400 transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400 mb-3">
                    {event.institution}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {event.description}
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
