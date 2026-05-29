'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Project } from '@/lib/getData';

const CATEGORIES = ['All', 'Climate', 'GIS/RS', 'Research', 'Disaster Risk', 'Sustainability', 'Community'];

export default function Projects({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-subtitle mb-3">Our Portfolio</p>
          <h2 className="section-title mb-4">Latest Projects & Works</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Explore our environmental initiatives across climate resilience, GIS mapping, research, and community empowerment throughout Bangladesh.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${active === cat ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600'}`}>{cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((project) => (
            <div key={project.id} className="project-card relative overflow-hidden rounded-xl cursor-pointer group aspect-square">
              <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500" loading="lazy" />
              <div className="project-overlay absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/40 to-transparent opacity-0 transition-opacity duration-300 flex flex-col justify-end p-3">
                <span className="text-green-300 text-[10px] font-semibold uppercase tracking-wider mb-1">{project.category}</span>
                <p className="text-white text-xs font-semibold leading-tight mb-1">{project.title}</p>
                <p className="text-white/60 text-[10px]">{project.location}</p>
                <ExternalLink className="w-3.5 h-3.5 text-green-300 mt-2" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-outline">View All Projects</button>
        </div>
      </div>
    </section>
  );
}
