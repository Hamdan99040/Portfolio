'use client';

import { useState } from 'react';
import { Code, ShieldCheck, Cpu, TestTube, Bug, Database, Layers, CheckCircle } from 'lucide-react';

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
    <section id="skills" className="py-24 relative overflow-hidden bg-[#060814]/40">
      {/* Visual background lights */}
      <div className="absolute top-[30%] right-[5%] w-[25rem] h-[25rem] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Technical <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Skill Set</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Equipped with complete MERN stack full-stack development skills and rigorous QA automation practices to build and deliver zero-defect systems.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Development Column */}
          <div className="glassmorphism rounded-3xl p-8 border border-white/5 relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-xl text-white">Full Stack Development</h3>
                <p className="text-xs text-slate-500">MERN Stack, APIs, and Native Applications</p>
              </div>
            </div>

            <div className="space-y-6">
              {devSkills.map((skill, idx) => (
                <SkillItem key={idx} skill={skill} colorClass="bg-indigo-500" glowClass="shadow-indigo-500/20" />
              ))}
            </div>
          </div>

          {/* QA / Testing Column */}
          <div className="glassmorphism rounded-3xl p-8 border border-white/5 relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-xl text-white">Quality Assurance & SQA</h3>
                <p className="text-xs text-slate-500">Automation, API verification, manual audits</p>
              </div>
            </div>

            <div className="space-y-6">
              {qaSkills.map((skill, idx) => (
                <SkillItem key={idx} skill={skill} colorClass="bg-purple-500" glowClass="shadow-purple-500/20" />
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
  glowClass: string;
}

function SkillItem({ skill, colorClass, glowClass }: SkillItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="space-y-2 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-300 flex items-center gap-1.5">
          <CheckCircle className={`w-3.5 h-3.5 opacity-60 text-slate-400 group-hover:opacity-100 group-hover:text-indigo-400 transition-all`} />
          {skill.name}
        </span>
        <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
          {skill.level}%
        </span>
      </div>
      
      {/* Skill Bar Container */}
      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${skill.level}%` }}
        />
      </div>

      {/* Dynamic Tooltip Info description on Hover */}
      <div className={`text-xs text-slate-500 overflow-hidden transition-all duration-300 ${
        isHovered ? 'max-h-12 mt-1 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        {skill.desc}
      </div>
    </div>
  );
}
