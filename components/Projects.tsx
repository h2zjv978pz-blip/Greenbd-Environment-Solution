'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { Project } from '@/lib/getData';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import t from '@/lib/i18n/translations';

const CATEGORY_KEYS = ['All', 'Climate', 'GIS/RS', 'Research', 'Disaster Risk', 'Sustainability', 'Community'] as const;

export default function Projects({ projects }: { projects: Project[] }) {
  const { lang } = useLanguage();
  const tr = t[lang].projects;
  const banglaFont = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-20 bg-gray-50" style={banglaFont}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-subtitle mb-3">{tr.subtitle}</p>
          <h2 className="section-title mb-4">{tr.title}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{tr.desc}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORY_KEYS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${active === cat ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600'}`}
            >
              {tr.categories[cat]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((project) => {
            const title    = (lang === 'bn' && project.title_bn)    ? project.title_bn    : project.title;
            const location = (lang === 'bn' && project.location_bn) ? project.location_bn : project.location;
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="project-card relative overflow-hidden rounded-xl cursor-pointer group aspect-video sm:aspect-square block"
              >
                {project.image
                  ? <img src={project.image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500" loading="lazy" />
                  : <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-950" />}
                <div className="project-overlay absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/40 to-transparent opacity-0 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-1">{project.category}</span>
                  <p className="text-white text-sm font-semibold leading-tight mb-1">{title}</p>
                  <p className="text-white/60 text-xs">{location}</p>
                  <ExternalLink className="w-4 h-4 text-green-300 mt-2" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="btn-outline">{tr.viewAll}</button>
        </div>
      </div>
    </section>
  );
}
