'use client';

import { GraduationCap, BookOpen, Globe, Star, ChevronRight } from 'lucide-react';

interface EducationItem {
  level: string;
  degree: string;
  institution: string;
  year: string;
  grade?: string;
  subjects?: string[];
  status: 'completed' | 'ongoing' | 'future';
  icon: React.ReactNode;
  highlight?: string;
}

const educationData: EducationItem[] = [
  {
    level: 'Matriculation (SSC)',
    degree: 'Secondary School Certificate',
    institution: 'Government High School',
    year: '2018 – 2020',
    grade: 'A Grade',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    status: 'completed',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    level: 'ICS — Intermediate',
    degree: 'Intermediate of Computer Science',
    institution: 'Government Degree College',
    year: '2020 – 2022',
    grade: 'A Grade',
    subjects: ['Computer Science', 'Mathematics', 'Physics', 'English'],
    status: 'completed',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    level: 'Bachelor\'s Degree',
    degree: 'BS Computer Science',
    institution: 'University of Okara',
    year: '2022 – 2026',
    grade: 'CGPA 3.2+',
    subjects: [
      'Software Engineering',
      'Database Systems',
      'Web Engineering',
      'Quality Assurance',
      'Data Structures',
      'Operating Systems',
    ],
    status: 'completed',
    icon: <GraduationCap className="w-5 h-5" />,
    highlight: 'Final Year Project: Discover Zone (MERN Stack)',
  },
  {
    level: 'Master\'s — Future Goal',
    degree: 'MS Computer Science / Software Engineering',
    institution: 'Germany or Australia (Target)',
    year: '2027 – 2029 (Planned)',
    subjects: [
      'AI & Machine Learning',
      'Cloud Computing',
      'Advanced Software Architecture',
    ],
    status: 'future',
    icon: <Globe className="w-5 h-5" />,
    highlight: 'Currently preparing applications',
  },
];

const statusConfig = {
  completed: {
    badge: 'Completed',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/[0.08] dark:border-emerald-500/15 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  ongoing: {
    badge: 'In Progress',
    color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-500/[0.08] dark:border-blue-500/15 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  future: {
    badge: 'Future Goal',
    color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-500/[0.08] dark:border-amber-500/15 dark:text-amber-400',
    dot: 'bg-amber-400',
  },
};

export default function Education() {
  return (
    <section
      id="education"
      className="py-28 relative overflow-hidden section-base transition-colors duration-500"
    >
      {/* Far background glow */}
      <div className="absolute top-[10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-600/[0.035] blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-4">
            Academic Background
          </p>
          <h2 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white mb-5 tracking-tight">
            Education{' '}
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent">
              Timeline
            </span>
          </h2>
          <div className="w-16 h-[3px] bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full mb-6" />
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            A structured academic journey from secondary education through university, building toward an international Master&apos;s degree.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical connector line */}
          <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-gradient-to-b from-blue-600 via-blue-400/60 to-transparent hidden sm:block" />

          <div className="space-y-8">
            {educationData.map((edu, i) => {
              const cfg = statusConfig[edu.status];
              return (
                <div key={i} className="relative sm:pl-16 group">
                  {/* Node */}
                  <div className="hidden sm:flex absolute left-0 top-6 w-12 h-12 rounded-2xl bg-white dark:bg-[#07091a] border border-slate-200 dark:border-white/[0.07] items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-md group-hover:shadow-blue-600/20 transition-all duration-400 z-10">
                    {edu.icon}
                  </div>

                  {/* Card */}
                  <div className={`card-surface rounded-2xl p-7 transition-all duration-300 ${
                    edu.status === 'future'
                      ? 'border-dashed border-amber-200 dark:border-amber-500/15 bg-amber-50/20 dark:bg-amber-500/[0.03]'
                      : ''
                  }`}>
                    {/* Top row */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${cfg.color} mb-2`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${edu.status === 'ongoing' ? 'animate-pulse' : ''}`} />
                          {cfg.badge}
                        </span>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          {edu.level}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] px-2.5 py-1 rounded-lg">
                        {edu.year}
                      </span>
                    </div>

                    {/* Title + institution */}
                    <h3 className="font-outfit font-black text-xl text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {edu.institution}
                    </p>

                    {/* Grade pill */}
                    {edu.grade && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/[0.08] border border-blue-100 dark:border-blue-500/15 text-xs font-bold text-blue-600 dark:text-blue-400 mb-4">
                        <Star className="w-3 h-3 fill-current" />
                        {edu.grade}
                      </div>
                    )}

                    {/* Subjects */}
                    {edu.subjects && edu.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {edu.subjects.map((sub) => (
                          <span
                            key={sub}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Highlight */}
                    {edu.highlight && (
                      <div className="flex items-start gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-white/[0.05]">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {edu.highlight}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
