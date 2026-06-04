export const metadata = { title: 'Environmental Laws of Bangladesh', description: 'Comprehensive guide to Bangladesh environmental legislation, regulations and legal framework for environmental compliance.', alternates: { canonical: '/resources/laws' } };

import { readData } from '@/lib/data';
import { Scale, BookOpen, FileText, ExternalLink, CheckCircle2 } from 'lucide-react';

interface Law {
  id: number; title: string; year: number; category: string;
  status: string; description: string; pdfUrl: string; tags: string[];
}

const CATEGORY_ICONS: Record<string, string> = {
  'Environmental Protection': '🛡️',
  'Water Resources':          '💧',
  'Forest & Biodiversity':    '🌿',
  'Air Quality':              '💨',
  'Climate Policy':           '🌍',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Environmental Protection': 'border-l-green-500 bg-green-50',
  'Water Resources':          'border-l-blue-500 bg-blue-50',
  'Forest & Biodiversity':    'border-l-emerald-500 bg-emerald-50',
  'Air Quality':              'border-l-sky-500 bg-sky-50',
  'Climate Policy':           'border-l-amber-500 bg-amber-50',
};

export const dynamic = 'force-dynamic';

export default function LawsPage() {
  const { laws = [] } = readData<{ laws: Law[] }>('laws');

  const categories = [...new Set(laws.map(l => l.category))];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="section-subtitle mb-2">Legal Framework</p>
        <h1 className="text-4xl font-bold font-heading text-gray-900 mb-4">Environmental Laws of Bangladesh</h1>
        <p className="text-gray-500 max-w-2xl">
          A comprehensive reference to Bangladesh&apos;s environmental legislation — from the foundational
          Environment Conservation Act to sector-specific regulations governing water, forest, air, and climate.
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map(cat => (
          <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
            <span>{CATEGORY_ICONS[cat] ?? '📋'}</span>{cat}
          </span>
        ))}
      </div>

      {/* Laws list */}
      {laws.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Scale className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No laws added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {laws.map(law => (
            <div key={law.id}
              className={`bg-white rounded-2xl border-l-4 shadow-sm p-6 hover:shadow-md transition-shadow ${CATEGORY_COLORS[law.category] ?? 'border-l-gray-300 bg-gray-50'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="text-2xl">{CATEGORY_ICONS[law.category] ?? '📋'}</span>
                    <h2 className="font-heading font-bold text-gray-900 text-lg leading-snug">{law.title}</h2>
                  </div>
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="flex items-center gap-1 text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-medium shadow-sm">
                      <BookOpen className="w-3 h-3" /> {law.year}
                    </span>
                    <span className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-medium shadow-sm">
                      {law.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> {law.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{law.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {law.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-white/70 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                {law.pdfUrl && (
                  <a href={law.pdfUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-primary-600 border border-primary-200 bg-primary-50 hover:bg-primary-600 hover:text-white px-3 py-2 rounded-lg transition-colors">
                    <FileText className="w-3.5 h-3.5" /> PDF <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <p className="text-amber-800 text-sm leading-relaxed">
          <strong>Disclaimer:</strong> This page is for informational purposes only. Always refer to official
          Government of Bangladesh publications and the Bangladesh Gazette for legally binding versions of
          legislation. Laws may be amended; verify current status with the Ministry of Environment, Forest and
          Climate Change or the Department of Environment (DoE).
        </p>
      </div>
    </div>
  );
}
