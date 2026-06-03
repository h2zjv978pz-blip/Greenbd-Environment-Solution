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
    <section id="projects" className="py-5 md:py-20 bg-gray-50" style={banglaFont}>
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header — compact on mobile */}
        <div className="text-center mb-4 md:mb-12">
          <p className="section-subtitle mb-1 md:mb-3">{tr.subtitle}</p>
          <h2 className="text-2xl md:text-4xl font-bold font-heading text-gray-900 mb-2 md:mb-4">{tr.title}</h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto line-clamp-2 sm:line-clamp-none">{tr.desc}</p>
        </div>

        {/* Filter — horizontal scroll on mobile */}
        <div className="flex overflow-x-auto gap-2 mb-4 md:mb-10 pb-1 md:flex-wrap md:justify-center md:overflow-visible scrollbar-hide">
          {CATEGORY_KEYS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0
                ${active === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600'}`}
            >
              {tr.categories[cat]}
            </button>
          ))}
        </div>

        {/* Grid — 2 cols on mobile, more on larger screens */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
          {filtered.map((project) => {
            const title    = (lang === 'bn' && project.title_bn)    ? project.title_bn    : project.title;
            const location = (lang === 'bn' && project.location_bn) ? project.location_bn : project.location;
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="project-card relative overflow-hidden rounded-xl cursor-pointer group aspect-[3/2] sm:aspect-square block"
              >
                {project.image
                  ? <img src={project.image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500" loading="lazy" />
                  : <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-950" />}
                {/* Always-visible bottom label on mobile */}
                <div className="absolute bottom-0 left-0 right-0 sm:hidden bg-gradient-to-t from-black/70 to-transparent pt-4 pb-1.5 px-2">
                  <p className="text-white text-[10px] font-semibold leading-tight line-clamp-1">{title}</p>
                  <span className="text-green-300 text-[8px] font-medium">{project.category}</span>
                </div>
                {/* Hover overlay on desktop */}
                <div className="project-overlay absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/40 to-transparent hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col justify-end p-4">
                  <span className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-1">{project.category}</span>
                  <p className="text-white text-sm font-semibold leading-tight mb-1">{title}</p>
                  <p className="text-white/60 text-xs">{location}</p>
                  <ExternalLink className="w-4 h-4 text-green-300 mt-2" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-6 md:mt-12">
          <button className="btn-outline text-sm px-6 py-2.5 md:text-base md:px-8 md:py-3">{tr.viewAll}</button>
        </div>
      </div>
    </section>
  );
}
