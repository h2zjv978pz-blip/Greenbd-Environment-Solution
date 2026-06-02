'use client';

import { useEffect, useState } from 'react';
import { FolderOpen, Wrench, Users, BookOpen, Building2, Presentation, BarChart3, Phone, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ClockWidget from '@/components/admin/ClockWidget';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { adminT } from '@/lib/i18n/translations';

const BangladeshClimateMap = dynamic(
  () => import('@/components/BangladeshClimateMap'),
  { ssr: false, loading: () => (
    <div className="h-[320px] bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading map…</p>
    </div>
  )}
);

const SECTION_HREFS = [
  '/admin/hero', '/admin/projects', '/admin/services', '/admin/about',
  '/admin/stats', '/admin/team', '/admin/clients', '/admin/research', '/admin/contact',
];
const SECTION_ICONS = [Presentation, FolderOpen, Wrench, Info, BarChart3, Users, Building2, BookOpen, Phone];

export default function AdminDashboard() {
  const { lang } = useLanguage();
  const tr = adminT(lang);
  const banglaFont = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const [counts, setCounts] = useState({ projects: 0, services: 0, team: 0, research: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/content/projects').then(r => r.json()),
      fetch('/api/content/services').then(r => r.json()),
      fetch('/api/content/team').then(r => r.json()),
      fetch('/api/content/research').then(r => r.json()),
    ]).then(([p, s, t, r]) => {
      setCounts({
        projects: (p.projects ?? []).length,
        services: (s.services ?? []).length,
        team:     (t.members  ?? []).length,
        research: (r.publications ?? []).length,
      });
    }).catch(() => {});
  }, []);

  const stats = [
    { label: tr.dashboard.projects,     value: counts.projects,  icon: FolderOpen, color: '#2c7be5' },
    { label: tr.dashboard.services,     value: counts.services,  icon: Wrench,     color: '#00d97e' },
    { label: tr.dashboard.teamMembers,  value: counts.team,      icon: Users,      color: '#e63757' },
    { label: tr.dashboard.publications, value: counts.research,  icon: BookOpen,   color: '#f6c343' },
  ];

  return (
    <div style={banglaFont}>
      {/* Clock widget */}
      <ClockWidget />

      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.dashboard.title}</h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '18' }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 font-heading leading-none">{value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Climate Map widget */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h6 className="font-semibold text-gray-800 text-sm">
              {lang === 'bn' ? '🗺️ বাংলাদেশ জলবায়ু পরিবর্তন মানচিত্র' : '🗺️ Bangladesh Climate Change Scenario Map'}
            </h6>
            <p className="text-xs text-gray-400 mt-0.5">
              {lang === 'bn' ? 'স্থানে ক্লিক করুন বিস্তারিত দেখতে' : 'Click a location to view climate projections'}
            </p>
          </div>
          <a href="/#climate-map" target="_blank"
            className="text-xs text-blue-600 hover:underline font-medium">
            {lang === 'bn' ? 'পাবলিক ভিউ →' : 'Public view →'}
          </a>
        </div>
        <BangladeshClimateMap compact />
      </div>

      {/* Sections table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h6 className="font-semibold text-gray-700 text-sm">{tr.dashboard.contentSections}</h6>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {[tr.dashboard.colNo, tr.dashboard.colSection, tr.dashboard.colDesc, tr.dashboard.colAction].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tr.dashboard.sections.map(({ label, desc }, i) => {
              const Icon = SECTION_ICONS[i];
              const href = SECTION_HREFS[i];
              return (
                <tr key={href} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5 text-sm text-gray-400">{i + 1}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-800">{label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-400">{desc}</td>
                  <td className="px-6 py-3.5">
                    <Link href={href}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 border border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                      {tr.common.manage} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
