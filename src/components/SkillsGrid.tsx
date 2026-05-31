'use client';

import { useState } from 'react';
import { Code, ShieldCheck, CheckCircle } from 'lucide-react';

interface Skill {
  name: string;
  level: number; // 0-100
  desc: string;
}

export default function SkillsGrid() {
  const devSkills: Skill[] = [
    { name: 'JavaScript / ES6+', level: 90, desc: 'Core language expertise, asynchronous operations, event-loop optimization' },
    { name: 'React.js', level: 92, desc: 'Hooks, custom state management, context APIs, and component architecture' },
    { name: 'Next.js', level: 88, desc: 'App Router, Server Actions, SEO optimization, and API route design' },
    { name: 'Node.js', level: 85, desc: 'Scalable backend runtimes, stream handling, and event-driven servers' },
    { name: 'Express.js', level: 88, desc: 'RESTful API architectures, middleware design, and secure routing' },
    { name: 'MongoDB', level: 82, desc: 'Mongoose modeling, indexing, aggregation pipelines, and optimization' },
    { name: 'REST APIs', level: 90, desc: 'Robust standards, endpoints security, integration, and documentation' },
    { name: 'React Native', level: 80, desc: 'Cross-platform mobile applications, Expo, native bridging' }
  ];

  const qaSkills: Skill[] = [
    { name: 'Automation Testing', level: 88, desc: 'Framework design, UI verification, CI/CD pipeline integrations' },
    { name: 'Cypress', level: 90, desc: 'E2E testing, visual assertions, custom commands, and fixtures' },
    { name: 'API Testing', level: 88, desc: 'Request chaining, environment management, assertion tests' },
    { name: 'Postman', level: 92, desc: 'Collections, pre-request scripting, automated test suites' },
    { name: 'Manual Testing', level: 90, desc: 'Exploratory validation, usability, and cross-browser audits' },
    { name: 'Test Cases Design', level: 92, desc: 'Traceability matrices, boundary analysis, positive/negative paths' },
    { name: 'Bug Reporting', level: 95, desc: 'Structured logs, reproduction steps, regression tracking in Jira' }
  ];

  return (
    <section id="skills" className="py-28 relative overflow-hidden section-alt border-y border-slate-100 dark:border-white/[0.02] transition-colors duration-500">
      {/* Visual background subtle blue lights */}
      <div className="absolute top-[20%] right-[5%] w-[35rem] h-[35rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.01] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.01] blur-[130px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-20">
          <h2 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] dark:text-white mb-6 tracking-tight">
            Technical <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent font-extrabold">Skill Matrix</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-700 to-blue-500 mx-auto rounded-full mb-6" />
          <p className="text-slate-800 dark:text-slate-350 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Equipped with a solid MERN stack developer foundation and rigorous SQA verification practices to build and deliver robust, zero-regression software systems.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Development Column */}
          <div className="card-surface rounded-3xl p-8 sm:p-10 relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/25 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-500/5">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-outfit font-black text-xl text-slate-900 dark:text-white tracking-tight">Full Stack Development</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">MERN Stack, API Architecture, Native Apps</p>
              </div>
            </div>

            <div className="space-y-6">
              {devSkills.map((skill, idx) => (
                <SkillItem key={idx} skill={skill} colorClass="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500" />
              ))}
            </div>
          </div>

          {/* QA / Testing Column */}
          <div className="card-surface rounded-3xl p-8 sm:p-10 relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/25 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-500/5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-outfit font-black text-xl text-slate-900 dark:text-white tracking-tight">Quality Assurance & SQA</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">E2E Automation, API Verification, Manual Audits</p>
              </div>
            </div>

            <div className="space-y-6">
              {qaSkills.map((skill, idx) => (
                <SkillItem key={idx} skill={skill} colorClass="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SkillItemProps {
  skill: Skill;
  colorClass: string;
}

function SkillItem({ skill, colorClass }: SkillItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="space-y-2.5 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          {skill.name}
        </span>
        <span className="px-2.5 py-0.5 text-[10px] font-black rounded-lg bg-blue-50 border border-blue-100 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-300 transition-all duration-300">
          {skill.level}%
        </span>
      </div>
      
      {/* Skill Bar Container */}
      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/[0.05] overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${skill.level}%` }}
        />
      </div>

      {/* Dynamic Tooltip Info description on Hover */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isHovered ? 'max-h-24 mt-2 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/50 dark:border-white/[0.04] text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {skill.desc}
        </div>
      </div>
    </div>
  );
}

