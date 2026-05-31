'use client';

import { FileText, Download, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ResumeCenter() {
  const resumes = [
    {
      title: 'Full-Stack Developer Resume',
      subtitle: 'Software Engineering focus',
      description: 'Customized for software engineering positions. Emphasizes React/Next.js, Node.js, MongoDB database schemas, robust REST API design, and web app scalability.',
      highlights: [
        'MERN Stack Architecture',
        'Next.js Server Actions & SEO',
        'Secure JWT Authentication',
        'RESTful API Development'
      ],
      downloadUrl: '/CV_Hamdan.pdf',
      badge: 'Dev Focus'
    },
    {
      title: 'SQA Engineer Resume',
      subtitle: 'Quality Assurance focus',
      description: 'Tailored for SQA and Test Automation positions. Highlights E2E automation framework design, Cypress scripting, API automated testing with Postman, and CI/CD integration.',
      highlights: [
        'Cypress E2E Testing',
        'Postman Automation Collections',
        'CI/CD GitHub Actions Pipelines',
        'Jira Bug Tracking & Test Cases'
      ],
      downloadUrl: '/CV_Hamdan.pdf',
      badge: 'QA Focus'
    },
    {
      title: 'International Recruiter Resume',
      subtitle: 'Global Visa & Relocation ready',
      description: 'Optimized for international companies (e.g. Germany/Australia target). Showcases IELTS Band 7.5 English proficiency, verified BS CS UO degree, and Devzox experience.',
      highlights: [
        'IELTS band score: 7.5 Certified',
        'Bachelor of Computer Science',
        'Verified Education Credentials',
        'Ready for Relocation / Remote'
      ],
      downloadUrl: '/CV_Hamdan.pdf',
      badge: 'Visa Ready'
    }
  ];

  return (
    <section id="resume" className="py-28 relative overflow-hidden section-alt border-y border-slate-100 dark:border-white/[0.02] transition-colors duration-500">
      {/* Background decoration subtle blue lights */}
      <div className="absolute top-[30%] right-[5%] w-[35rem] h-[35rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.01] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.01] blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] dark:text-white mb-6 tracking-tight">
            Resume <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent font-extrabold">Center</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-700 to-blue-500 mx-auto rounded-full mb-6" />
          <p className="text-slate-800 dark:text-slate-350 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Download tailored versions of my resume aligned with your organizational requirements and specific engineering disciplines.
          </p>
        </div>

        {/* Resumes Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {resumes.map((res, idx) => (
            <div
              key={idx}
              className="card-surface rounded-3xl p-8 flex flex-col justify-between h-full relative group transition-all duration-300 hover:scale-[1.01]"
            >
              {/* Badge & Top Row */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform duration-300">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-blue-650 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                    {res.badge}
                  </span>
                </div>

                <h3 className="font-outfit font-black text-xl text-slate-900 dark:text-white mb-1 leading-snug group-hover:text-blue-600 transition-colors">
                  {res.title}
                </h3>
                <p className="text-blue-650 dark:text-blue-400 text-xs font-black mb-4">
                  {res.subtitle}
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 font-medium">
                  {res.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-3 mb-8 pt-6 border-t border-slate-100 dark:border-white/[0.05]">
                  <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Key CV Highlights
                  </h4>
                  <ul className="space-y-2.5">
                    {res.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 text-left">
                        <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <a
                  href={res.downloadUrl}
                  download
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/10 active:scale-[0.99] transition-all duration-300 cursor-pointer text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Resume PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
