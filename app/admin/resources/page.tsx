'use client';

import { useEffect, useState } from 'react';
import { Newspaper, Scale, Download, Images, Play, ArrowRight, ExternalLink, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface ResourceStat { label: string; count: number; icon: React.ComponentType<{className?:string}>; href: string; publicHref: string; color: string; bg: string; border: string }

export default function ResourcesDashboard() {
  const [stats, setStats] = useState([
    { label: 'Blog / News',        count: 0, icon: Newspaper, href: '/admin/resources/blog',      publicHref: '/resources/blog',      color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
    { label: 'Environmental Laws', count: 0, icon: Scale,     href: '/admin/resources/laws',      publicHref: '/resources/laws',      color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-100' },
    { label: 'Downloads / Guides', count: 0, icon: Download,  href: '/admin/resources/downloads', publicHref: '/resources/downloads', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { label: 'Images / Gallery',   count: 0, icon: Images,    href: '/admin/resources/gallery',   publicHref: '/resources/gallery',   color: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-100'  },
    { label: 'Videos',             count: 0, icon: Play,      href: '/admin/resources/video',     publicHref: '/resources/video',     color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100'  },
  ]);

  useEffect(() => {
    const endpoints = [
      { url: '/api/content/posts',     key: 'posts',     idx: 0 },
      { url: '/api/content/laws',      key: 'laws',      idx: 1 },
      { url: '/api/content/downloads', key: 'downloads', idx: 2 },
      { url: '/api/content/albums',    key: 'albums',    idx: 3 },
      { url: '/api/content/videos',    key: 'videos',    idx: 4 },
    ];
    endpoints.forEach(({ url, key, idx }) => {
      fetch(url).then(r => r.json()).then(d => {
        const arr = d[key] ?? [];
        setStats(s => s.map((item, i) => i === idx ? { ...item, count: arr.length } : item));
      }).catch(() => {});
    });
  }, []);

  const total = stats.reduce((s, r) => s + r.count, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          <p className="text-sm text-gray-400 mt-0.5">{total} total items across {stats.length} resource types</p>
        </div>
        <a href="/resources/blog" target="_blank"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <ExternalLink className="w-4 h-4" /> View Public Resources
        </a>
      </div>

      {/* Resource type cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map(({ label, count, icon: Icon, href, bg, color, border }) => (
          <Link key={label} href={href}
            className={`group bg-white border ${border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}>
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{count}</p>
            <p className="text-xs text-gray-500">{label}</p>
            <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${color} opacity-0 group-hover:opacity-100 transition-opacity`}>
              Manage <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick access grid */}
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" /> Quick Access
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, icon: Icon, href, publicHref, bg, color, border, count }) => (
          <div key={label} className={`bg-white border ${border} rounded-2xl p-5 shadow-sm`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400">{count} item{count !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={href}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200">
                Manage
              </Link>
              <a href={publicHref} target="_blank"
                className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors border border-gray-200">
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
