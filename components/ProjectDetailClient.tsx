'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, User, Tag } from 'lucide-react';
import { GalleryGrid } from '@/components/Lightbox';
import type { Project } from '@/lib/getData';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import t from '@/lib/i18n/translations';

export default function ProjectDetailClient({ project }: { project: Project }) {
  const { lang } = useLanguage();
  const tr = t[lang].projectDetail;
  const banglaFont = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const title       = (lang === 'bn' && project.title_bn)       ? project.title_bn       : project.title;
  const location    = (lang === 'bn' && project.location_bn)    ? project.location_bn    : project.location;
  const description = (lang === 'bn' && project.description_bn) ? project.description_bn : project.description;

  const gallery    = (project.galleryImages    ?? []).filter(Boolean);
  const additional = (project.additionalImages ?? []).filter(Boolean);

  return (
    <div className="min-h-screen bg-white" style={banglaFont}>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[380px] bg-gray-900 overflow-hidden">
        {project.image && (
          <img src={project.image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-70" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/85 via-gray-900/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/#projects"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/25 backdrop-blur text-white text-sm font-medium px-4 py-2 rounded-full transition-colors border border-white/20">
            <ArrowLeft className="w-4 h-4" /> {tr.backToProjects}
          </Link>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:px-16 z-10">
          <span className="inline-block bg-primary-600 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            {project.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-heading text-white leading-tight max-w-3xl">
            {title}
          </h1>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-14">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Left — description + galleries */}
          <div className="lg:col-span-2">
            {description && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-heading mb-4">{tr.projectOverview}</h2>
                <div
                  className="prose prose-gray max-w-none text-gray-600 leading-relaxed text-base"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            )}
            <GalleryGrid images={gallery}    title={tr.gallery} />
            <GalleryGrid images={additional} title={tr.fieldImages} />
          </div>

          {/* Right — sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-8">
              <h3 className="font-bold text-gray-900 font-heading text-lg mb-5 pb-4 border-b border-gray-200">
                {tr.projectDetails}
              </h3>

              <ul className="space-y-4">
                {project.clientName && (
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-primary-600" />
                    </span>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{tr.client}</p>
                      <p className="text-gray-800 text-sm font-semibold mt-0.5">{project.clientName}</p>
                    </div>
                  </li>
                )}
                {project.location && (
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-primary-600" />
                    </span>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{tr.location}</p>
                      <p className="text-gray-800 text-sm font-semibold mt-0.5">{location}</p>
                    </div>
                  </li>
                )}
                {project.projectTime && (
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-primary-600" />
                    </span>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{tr.year}</p>
                      <p className="text-gray-800 text-sm font-semibold mt-0.5">{project.projectTime}</p>
                    </div>
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Tag className="w-4 h-4 text-primary-600" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{tr.category}</p>
                    <span className="inline-block mt-1 text-xs font-semibold bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                </li>
              </ul>

              <div className="mt-6 pt-5 border-t border-gray-200">
                <Link href="/#contact"
                  className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors">
                  {tr.inquire}
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
