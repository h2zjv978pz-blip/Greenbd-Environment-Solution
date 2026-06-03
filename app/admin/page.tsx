'use client';

import { useEffect, useState } from 'react';
import { FolderOpen, Wrench, Users, BookOpen, Building2, Presentation, BarChart3, Phone, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import MobileViewSettings from '@/components/admin/MobileViewSettings';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { adminT } from '@/lib/i18n/translations';


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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.dashboard.title}</h1>

      {/* ── Mobile View Settings — top priority ──────────────────────── */}
      <div className="mb-6">
        <MobileViewSettings />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '18' }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 font-heading leading-none">{value}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Content sections — mobile tap-to-edit cards ──────────────── */}
      <div>
        <h6 className="font-semibold text-gray-600 text-xs uppercase tracking-wider mb-3 px-1">{tr.dashboard.contentSections}</h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {tr.dashboard.sections.map(({ label, desc }, i) => {
            const Icon = SECTION_ICONS[i];
            const href = SECTION_HREFS[i];
            return (
              <Link key={href} href={href}
                className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-4 py-4 shadow-sm hover:shadow-md hover:border-blue-200 active:scale-[0.98] transition-all min-h-[72px]">
                <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors truncate">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
