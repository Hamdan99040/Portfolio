'use client';

import { useState, useEffect } from 'react';
import { Calendar, Briefcase, Award, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';

interface Experience {
  id?: string;
  _id?: string;
  company: string;
  role: string;
  period: string;
  description: string;
  type: string;
}

interface Certification {
  id?: string;
  _id?: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  type: string;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [expRes, certRes] = await Promise.all([
          fetch('/api/experiences'),
          fetch('/api/certifications')
        ]);
        
        if (expRes.ok) {
          const expData = await expRes.json();
          setExperiences(expData);
        }
        if (certRes.ok) {
          const certData = await certRes.json();
          setCertifications(certData);
        }
      } catch (err) {
        console.error('Failed to fetch experiences/certifications:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <section id="experience" className="py-24 relative overflow-hidden bg-[#060814]/40">
      {/* Background neon elements */}
      <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[25rem] h-[25rem] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Experience & <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Certifications</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Professional track record of roles I have held and certified competencies verified by industry credentials.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Work Experience Timeline */}
            <div className="lg:col-span-7 space-y-8">
              <h3 className="font-outfit font-bold text-xl text-white flex items-center gap-2.5 mb-6 text-left">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                Professional Career Track
              </h3>

              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div
                    key={exp.id || exp._id}
                    className="glassmorphism rounded-3xl p-6 sm:p-8 border border-white/5 hover:border-indigo-500/20 transition-all duration-300 relative group text-left"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
                        {exp.type}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.period}
                      </span>
                    </div>

                    <h4 className="font-outfit font-bold text-xl text-white group-hover:text-indigo-400 transition-colors">
                      {exp.role}
                    </h4>
                    <p className="text-slate-400 text-sm font-semibold mb-4">
                      {exp.company}
                    </p>
                    
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications showcase */}
            <div className="lg:col-span-5 space-y-8">
              <h3 className="font-outfit font-bold text-xl text-white flex items-center gap-2.5 mb-6 text-left">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Award className="w-4 h-4" />
                </div>
                Verified Credentials
              </h3>

              <div className="space-y-4">
                {certifications.map((cert) => (
                  <a
                    key={cert.id || cert._id}
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glassmorphism rounded-2xl p-5 border border-white/5 hover:border-purple-500/20 flex items-start gap-4 transition-all duration-300 group text-left block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">
                          {cert.type}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {cert.date}
                        </span>
                      </div>
                      <h4 className="font-outfit font-bold text-sm text-white group-hover:text-purple-400 transition-colors truncate">
                        {cert.title}
                      </h4>
                      <p className="text-slate-400 text-xs truncate">
                        {cert.issuer}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all self-center flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
