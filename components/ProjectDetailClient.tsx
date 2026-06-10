'use client';

import Link from 'next/link';
import { Fragment, useState } from 'react';
import { ArrowLeft, MapPin, Calendar, User, Tag, Maximize2 } from 'lucide-react';
import Lightbox, { GalleryGrid } from '@/components/Lightbox';
import ShareButtons from '@/components/ShareButtons';
import type { Project } from '@/lib/getData';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import t from '@/lib/i18n/translations';

type AnnotatedItem = { url: string; caption: string; position?: number };

/* ── Single annotated image card ────────────────────────────────────── */
function OverviewImage({ url, caption }: AnnotatedItem) {
  const [open, setOpen] = useState(false);
  return (
    <figure className="my-6 rounded-2xl overflow-hidden border border-gray-100 shadow-sm not-prose">
      <div className="relative group cursor-zoom-in" onClick={() => setOpen(true)}>
        <img src={url} alt={caption} className="w-full h-auto block" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <button
          onClick={e => { e.stopPropagation(); setOpen(true); }}
          className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-lg flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
          title="View fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      {caption && (
        <figcaption className="px-4 py-2.5 text-sm text-center text-gray-500 bg-gray-50 border-t border-gray-100 font-medium">
          {caption}
        </figcaption>
      )}
      {open && <Lightbox images={[url]} initial={0} onClose={() => setOpen(false)} />}
    </figure>
  );
}

/* ── Description with images interleaved at paragraph positions ─────── */
function DescriptionWithImages({ html, images }: { html: string; images: AnnotatedItem[] }) {
  const valid = images.filter(it => it.url);

  if (valid.length === 0) {
    return (
      <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed text-base"
        dangerouslySetInnerHTML={{ __html: html }} />
    );
  }

  // Split the HTML after each </p> close tag
  const parts = html.split('</p>').map((s, i, arr) =>
    i < arr.length - 1 ? s + '</p>' : s
  ).filter(s => s.trim());

  // Group images by paragraph position (1-indexed); 0/undefined = after all paragraphs
  const byPos: Record<number, AnnotatedItem[]> = {};
  valid.forEach(img => {
    const pos = (img.position && img.position > 0) ? img.position : parts.length + 1;
    byPos[pos] = [...(byPos[pos] ?? []), img];
  });

  return (
    <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed text-base">
      {parts.map((part, idx) => (
        <Fragment key={idx}>
          <div dangerouslySetInnerHTML={{ __html: part }} />
          {(byPos[idx + 1] ?? []).map((img, j) => <OverviewImage key={j} {...img} />)}
        </Fragment>
      ))}
      {/* Images with no valid position or position beyond paragraph count */}
      {Object.entries(byPos)
        .filter(([pos]) => Number(pos) > parts.length)
        .flatMap(([, imgs]) => imgs)
        .map((img, j) => <OverviewImage key={j} {...img} />)}
    </div>
  );
}

export default function ProjectDetailClient({ project }: { project: Project }) {
  const { lang } = useLanguage();
  const tr = t[lang].projectDetail;
  const banglaFont = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const title       = (lang === 'bn' && project.title_bn)       ? project.title_bn       : project.title;
  const location    = (lang === 'bn' && project.location_bn)    ? project.location_bn    : project.location;
  const description = (lang === 'bn' && project.description_bn) ? project.description_bn : project.description;

  const gallery    = (project.galleryImages    ?? []).filter(Boolean);
  const annotated  = (project.annotatedImages  ?? []).filter(it => it.url);

  return (
    <div className="min-h-screen bg-white" style={banglaFont}>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="relative h-[16vh] min-h-[140px] md:h-[55vh] md:min-h-[380px] bg-gray-900 overflow-hidden">
        {project.image && (
          <img src={project.image} alt={title} loading="eager" decoding="async" fetchPriority="high" className="absolute inset-0 w-full h-full object-cover opacity-70" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/85 via-gray-900/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-2.5 left-2.5 md:top-6 md:left-6 z-10">
          <Link href="/#projects"
            className="inline-flex items-center gap-1.5 md:gap-2 bg-white/10 hover:bg-white/25 backdrop-blur text-white text-[11px] md:text-sm font-medium px-2.5 py-1 md:px-4 md:py-2 rounded-full transition-colors border border-white/20">
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> {tr.backToProjects}
          </Link>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-2.5 md:px-16 md:pb-10 z-10">
          <span className="inline-block bg-primary-600 text-white text-[9px] md:text-xs font-semibold uppercase tracking-widest px-2 py-0.5 md:px-3 md:py-1 rounded-full mb-1 md:mb-3">
            {project.category}
          </span>
          <h1 className="text-base md:text-5xl font-bold font-heading text-white leading-tight max-w-3xl">
            {title}
          </h1>
        </div>
      </div>

      {/* ── Gallery — full-width, right below hero ────────────────── */}
      {gallery.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-6 pb-0">
          <GalleryGrid images={gallery} title={tr.gallery} className="mt-0" />
        </div>
      )}

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-4 lg:py-14">
        <div className="grid lg:grid-cols-3 gap-2 lg:gap-12">

          {/* Left — description with inline annotated images */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            {description && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-heading mb-4">{tr.projectOverview}</h2>
                <DescriptionWithImages html={description} images={annotated} />
              </div>
            )}
          </div>

          {/* Right — sidebar (shown first on mobile, at top of overview) */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-4 lg:p-6 border border-gray-100 lg:sticky lg:top-8">
              <h3 className="font-bold text-gray-900 font-heading text-base lg:text-lg mb-3 pb-3 lg:mb-5 lg:pb-4 border-b border-gray-200">
                {tr.projectDetails}
              </h3>

              <ul className="grid grid-cols-2 gap-x-3 gap-y-3 lg:flex lg:flex-col lg:gap-0 lg:space-y-4">
                {project.clientName && (
                  <li className="flex items-start gap-2 lg:gap-3">
                    <span className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary-600" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] lg:text-xs text-gray-400 font-medium uppercase tracking-wide">{tr.client}</p>
                      <p className="text-gray-800 text-xs lg:text-sm font-semibold mt-0.5 truncate">{project.clientName}</p>
                    </div>
                  </li>
                )}
                {project.location && (
                  <li className="flex items-start gap-2 lg:gap-3">
                    <span className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary-600" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] lg:text-xs text-gray-400 font-medium uppercase tracking-wide">{tr.location}</p>
                      <p className="text-gray-800 text-xs lg:text-sm font-semibold mt-0.5 truncate">{location}</p>
                    </div>
                  </li>
                )}
                {project.projectTime && (
                  <li className="flex items-start gap-2 lg:gap-3">
                    <span className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary-600" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] lg:text-xs text-gray-400 font-medium uppercase tracking-wide">{tr.year}</p>
                      <p className="text-gray-800 text-xs lg:text-sm font-semibold mt-0.5 truncate">{project.projectTime}</p>
                    </div>
                  </li>
                )}
                <li className="flex items-start gap-2 lg:gap-3">
                  <span className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Tag className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary-600" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] lg:text-xs text-gray-400 font-medium uppercase tracking-wide">{tr.category}</p>
                    <span className="inline-block mt-1 text-[10px] lg:text-xs font-semibold bg-primary-100 text-primary-700 px-2.5 py-0.5 lg:px-3 lg:py-1 rounded-full truncate max-w-full">
                      {project.category}
                    </span>
                  </div>
                </li>
              </ul>

              <div className="mt-4 pt-4 lg:mt-5 lg:pt-5 border-t border-gray-200">
                <ShareButtons title={title} label={tr.share} copiedLabel={tr.linkCopied} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
