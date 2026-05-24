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
    <section id="projects" className="py-24 relative overflow-hidden bg-[#060814]/20">
      {/* Dynamic backdrop glow */}
      <div className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Featured <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Projects Showcase</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            A curated list of my designs, dynamic web platforms, native mobile applications, and QA automation frameworks.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="flex justify-center items-center gap-3 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid Display */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium">
            No projects found in this category.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id || project._id}
                onClick={() => setSelectedProject(project)}
                className="glassmorphism glassmorphism-hover rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between h-full group"
              >
                {/* Image / Header Graphic */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060814] to-transparent z-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <span className="absolute top-4 left-4 z-20 px-3 py-1 rounded-lg text-xs font-bold text-white bg-indigo-600/80 backdrop-blur-md border border-indigo-400/20">
                    {project.category}
                  </span>
                </div>

                {/* Content Panel */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-outfit font-bold text-xl text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                      {project.description}
                    </p>
                  </div>

                  {/* Technologies row */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 border border-white/5 text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/10 text-indigo-400">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-1.5 transition-all duration-300">
                      View Details & Case Study
                      <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Case Study Overlay Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="glassmorphism rounded-3xl border border-white/10 w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header Graphic */}
              <div className="relative h-64 w-full bg-slate-950">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all duration-300"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1224] to-transparent z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedProject.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute bottom-6 left-6 z-20">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-indigo-600 backdrop-blur-md border border-indigo-400/20 mb-2 inline-block">
                    {selectedProject.category}
                  </span>
                  <h3 className="font-outfit font-extrabold text-2xl sm:text-3xl text-white">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Scrollable details panel */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-grow text-left">
                {/* Short Overview */}
                <div>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  {/* Problem Solved */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-indigo-400" />
                      Problem Solved
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {selectedProject.problemSolved}
                    </p>
                  </div>

                  {/* Zain's Role */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-purple-400" />
                      My Role
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {selectedProject.role}
                    </p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Technologies Utilized
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="p-6 bg-slate-900/60 border-t border-white/5 flex flex-wrap gap-4 items-center justify-end">
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all duration-300"
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
