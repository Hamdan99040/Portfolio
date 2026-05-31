'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, FolderCode, X, Layers, Briefcase, HelpCircle } from 'lucide-react';

interface Project {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  problemSolved: string;
  role: string;
  github: string;
  demo: string;
  image: string;
  category: string;
  technologies: string[];
}

export default function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const categories = ['All', 'MERN', 'React Native', 'SQA'];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase() === filter.toLowerCase() || (filter === 'SQA' && p.category.toLowerCase() === 'sqa'));

  return (
    <section id="projects" className="py-28 relative overflow-hidden section-base border-y border-slate-100 dark:border-white/[0.02] transition-colors duration-500">
      {/* Dynamic backdrop subtle blue glow */}
      <div className="absolute top-[10%] left-[5%] w-[35rem] h-[35rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.01] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.01] blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-20">
          <h2 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] dark:text-white mb-6 tracking-tight">
            Featured <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent font-extrabold">Projects Showcase</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-700 to-blue-500 mx-auto rounded-full mb-6" />
          <p className="text-slate-800 dark:text-slate-350 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            A curated showcase of high-security MERN stack web applications, native mobile apps, and robust SQA automation pipelines.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="flex justify-center items-center gap-3.5 flex-wrap mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                filter === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10 hover:bg-blue-750 hover:scale-[1.01]'
                  : 'bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-455 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/[0.15] hover:bg-slate-50/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid Display */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-24 text-slate-600 dark:text-slate-400 font-bold">
            No projects found in this category.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project) => (
              <div
                key={project.id || project._id}
                onClick={() => setSelectedProject(project)}
                className="card-surface rounded-3xl cursor-pointer flex flex-col justify-between h-full overflow-hidden group"
              >
                {/* Image / Header Graphic */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 dark:from-[#060814]/90 to-transparent z-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95"
                  />
                  <span className="absolute top-5 left-5 z-20 px-3.5 py-1.5 rounded-xl text-[10px] font-black text-white bg-blue-600/80 backdrop-blur-md border border-blue-400/20 tracking-wider uppercase">
                    {project.category}
                  </span>
                </div>

                {/* Content Panel */}
                <div className="p-8 flex-grow flex flex-col justify-between text-left">
                  <div>
                    <h3 className="font-outfit font-black text-xl text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-450 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
                      {project.description}
                    </p>
                  </div>

                  {/* Technologies row */}
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg text-[10px] font-black bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.05] text-slate-700 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-3 py-1 rounded-lg text-[10px] font-black bg-blue-50 border border-blue-100 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-300">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-xs font-black text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                      View Details & Case Study
                      <Sparkles className="w-4 h-4 ml-1.5 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Case Study Overlay Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
            <div className="card-surface rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header Graphic */}
              <div className="relative h-64 w-full bg-slate-950 flex-shrink-0">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-5 right-5 z-30 p-2.5 rounded-2xl bg-white/85 dark:bg-slate-950/70 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:border-slate-350 transition-all duration-300 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#060814] to-transparent z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedProject.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute bottom-6 left-6 z-20 text-left">
                  <span className="px-3.5 py-1.5 rounded-xl text-[10px] font-black text-white bg-blue-600 backdrop-blur-md border border-blue-400/20 mb-3 inline-block tracking-wider uppercase">
                    {selectedProject.category}
                  </span>
                  <h3 className="font-outfit font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Scrollable details panel */}
              <div className="p-8 sm:p-10 overflow-y-auto space-y-8 flex-grow text-left">
                {/* Short Overview */}
                <div>
                  <p className="text-slate-800 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-slate-200/50 dark:border-white/[0.05]">
                  {/* Problem Solved */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      <HelpCircle className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                      Problem Solved
                    </h4>
                    <p className="text-slate-700 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                      {selectedProject.problemSolved}
                    </p>
                  </div>

                  {/* My Role */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      <Briefcase className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                      My Role
                    </h4>
                    <p className="text-slate-700 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                      {selectedProject.role}
                    </p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="space-y-4 pt-6 border-t border-slate-200/50 dark:border-white/[0.05]">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                    Technologies Utilized
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 border border-blue-100 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/50 dark:border-white/[0.05] flex flex-wrap gap-4 items-center justify-end flex-shrink-0">
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] hover:border-slate-350 transition-all duration-300 cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                    </svg>
                    GitHub Source Code
                  </a>
                )}
                {selectedProject.demo && (
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] transition-all duration-300 cursor-pointer shadow-md shadow-blue-600/10"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Launch Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
