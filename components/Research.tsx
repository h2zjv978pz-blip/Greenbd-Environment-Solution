'use client';

import Link from 'next/link';
import { BookOpen, ExternalLink, Calendar, Tag, Download } from 'lucide-react';
import type { Publication } from '@/lib/getData';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import t from '@/lib/i18n/translations';

const tagColors: Record<string, string> = {
  Climate: 'bg-sky-100 text-sky-700', 'GIS/RS': 'bg-blue-100 text-blue-700',
  DRR: 'bg-red-100 text-red-700', 'Remote Sensing': 'bg-indigo-100 text-indigo-700',
  Coastal: 'bg-cyan-100 text-cyan-700', Urban: 'bg-purple-100 text-purple-700',
  Community: 'bg-orange-100 text-orange-700', Mangrove: 'bg-green-100 text-green-700',
  Wetlands: 'bg-teal-100 text-teal-700', Livelihoods: 'bg-yellow-100 text-yellow-700',
  'Heat Island': 'bg-rose-100 text-rose-700', Carbon: 'bg-emerald-100 text-emerald-700',
};

export default function Research({ publications }: { publications: Publication[] }) {
  const { lang } = useLanguage();
  const tr = t[lang].research;
  const banglaFont = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  return (
    <section id="research" className="py-20 bg-white" style={banglaFont}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-subtitle mb-3">{tr.subtitle}</p>
          <h2 className="section-title mb-4">{tr.title}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{tr.desc}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {publications.map((pub) => {
            const title    = (lang === 'bn' && pub.title_bn)    ? pub.title_bn    : pub.title;
            const journal  = (lang === 'bn' && pub.journal_bn)  ? pub.journal_bn  : pub.journal;
            const abstract = (lang === 'bn' && pub.abstract_bn) ? pub.abstract_bn : pub.abstract;
            return (
              <div key={pub.id} className="card p-6 group hover:-translate-y-1 transition-transform duration-300 border border-gray-100 flex flex-col">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 mt-1">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <Link href={`/research/${pub.id}`}>
                      <h3 className="font-heading font-semibold text-gray-900 text-base leading-snug mb-2 group-hover:text-primary-700 transition-colors cursor-pointer hover:underline underline-offset-2">
                        {title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {journal}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {pub.year}</span>
                    </div>

                    <div className="text-gray-500 text-sm leading-relaxed mb-4 flex-1" dangerouslySetInnerHTML={{ __html: abstract }} />

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {pub.tags.map((tag) => (
                        <span key={tag} className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tagColors[tag] || 'bg-gray-100 text-gray-600'}`}>
                          <Tag className="w-2.5 h-2.5 inline mr-0.5" />{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <Link
                        href={`/research/${pub.id}`}
                        className="flex items-center gap-1 text-primary-600 text-xs font-semibold hover:gap-2 transition-all"
                      >
                        {tr.readFull} <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      {pub.pdfFile && (
                        <a
                          href={pub.pdfFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors ml-auto"
                        >
                          <Download className="w-3 h-3" /> {tr.downloadPdf}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <button className="btn-outline">{tr.viewAll}</button>
        </div>
      </div>
    </section>
  );
}
