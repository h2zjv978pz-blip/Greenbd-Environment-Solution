'use client';

import { BookOpen, ExternalLink, Calendar, Tag } from 'lucide-react';
import type { Publication } from '@/lib/getData';

const tagColors: Record<string, string> = {
  Climate: 'bg-sky-100 text-sky-700', 'GIS/RS': 'bg-blue-100 text-blue-700',
  DRR: 'bg-red-100 text-red-700', 'Remote Sensing': 'bg-indigo-100 text-indigo-700',
  Coastal: 'bg-cyan-100 text-cyan-700', Urban: 'bg-purple-100 text-purple-700',
  Community: 'bg-orange-100 text-orange-700', Mangrove: 'bg-green-100 text-green-700',
  Wetlands: 'bg-teal-100 text-teal-700', Livelihoods: 'bg-yellow-100 text-yellow-700',
  'Heat Island': 'bg-rose-100 text-rose-700', Carbon: 'bg-emerald-100 text-emerald-700',
};

export default function Research({ publications }: { publications: Publication[] }) {
  return (
    <section id="research" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-subtitle mb-3">Knowledge Hub</p>
          <h2 className="section-title mb-4">Research & Publications</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Our peer-reviewed research advances the evidence base for environmental policy and practice in Bangladesh and beyond.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {publications.map((pub) => (
            <div key={pub.id} className="card p-6 group hover:-translate-y-1 transition-transform duration-300 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 mt-1">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-gray-900 text-base leading-snug mb-2 group-hover:text-primary-700 transition-colors">{pub.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {pub.journal}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {pub.year}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{pub.abstract}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {pub.tags.map((tag) => (
                      <span key={tag} className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tagColors[tag] || 'bg-gray-100 text-gray-600'}`}>
                        <Tag className="w-2.5 h-2.5 inline mr-0.5" />{tag}
                      </span>
                    ))}
                  </div>
                  {pub.pdfFile ? (
                    <a href={pub.pdfFile} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary-600 text-xs font-semibold hover:gap-2 transition-all">
                      Read Full Paper <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-300 text-xs font-semibold cursor-default">
                      Read Full Paper <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="btn-outline">View All Publications</button>
        </div>
      </div>
    </section>
  );
}
