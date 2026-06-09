'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Presentation, FolderOpen, Wrench,
  Info, Users, Building2, BookOpen, Phone, BarChart3, Settings, LogOut, Leaf, Languages,
  Newspaper, Scale, Download, Images, ChevronDown, Map, Play, LayoutGrid, Music2, Navigation,
} from 'lucide-react';
import { SidebarClock } from '@/components/admin/ClockWidget';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { adminT } from '@/lib/i18n/translations';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname      = usePathname();
  const router        = useRouter();
  const { lang, toggleLang } = useLanguage();
  const tr = adminT(lang);
  const [resourcesOpen, setResourcesOpen] = useState(pathname.startsWith('/admin/resources'));

  const navigate = (href: string) => { router.push(href); onClose?.(); };

  const nav = [
    { href: '/admin',          label: tr.sidebar.dashboard,    icon: LayoutDashboard },
    { href: '/admin/hero',     label: tr.sidebar.heroSlides,   icon: Presentation    },
    { href: '/admin/projects', label: tr.sidebar.projects,     icon: FolderOpen      },
    { href: '/admin/services', label: tr.sidebar.services,     icon: Wrench          },
    { href: '/admin/stats',    label: tr.sidebar.statistics,   icon: BarChart3       },
    { href: '/admin/about',    label: tr.sidebar.about,        icon: Info            },
    { href: '/admin/team',     label: tr.sidebar.teamMembers,  icon: Users           },
    { href: '/admin/clients',  label: tr.sidebar.clients,      icon: Building2       },
    { href: '/admin/research',     label: tr.sidebar.research,     icon: BookOpen },
    { href: '/admin/climate-map', label: 'Climate Map',           icon: Map      },
    { href: '/admin/contact',     label: tr.sidebar.contactInfo,  icon: Phone    },
    { href: '/admin/menus',    label: 'Menu Order',            icon: Navigation      },
    { href: '/admin/ambient',  label: 'Ambient Music',         icon: Music2          },
    { href: '/admin/settings', label: tr.sidebar.siteSettings, icon: Settings        },
  ];

  const resourceNav = [
    { href: '/admin/resources',           label: 'Overview',              icon: LayoutGrid },
    { href: '/admin/resources/blog',      label: 'Blog / News',           icon: Newspaper  },
    { href: '/admin/resources/laws',      label: 'Environmental Laws',    icon: Scale      },
    { href: '/admin/resources/downloads', label: 'Downloads / Guides',    icon: Download   },
    { href: '/admin/resources/gallery',   label: 'Images',                icon: Images     },
    { href: '/admin/resources/video',     label: 'Videos',                icon: Play       },
  ];

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const banglaFont = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-[240px] flex flex-col z-40 select-none"
      style={{ background: 'linear-gradient(195deg, #152e4d 0%, #1e3d7b 40%, #5741a8 100%)', ...banglaFont }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Leaf className="text-white w-[18px] h-[18px]" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight font-heading">Green BD</p>
          <p className="text-white/50 text-[10px] tracking-wide">{tr.sidebar.adminPanel}</p>
        </div>
      </div>

      {/* Language toggle */}
      <div className="px-3 pt-3">
        <button
          onClick={toggleLang}
          className="w-full flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-semibold text-white/80 bg-white/10 hover:bg-white/20 transition-all"
        >
          <Languages className="w-4 h-4 flex-shrink-0" />
          <span>{lang === 'en' ? 'বাংলায় দেখুন' : 'Switch to English'}</span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <button
              key={href}
              onClick={() => navigate(href)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 text-left ${
                active
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-[16px] h-[16px] flex-shrink-0" />
              {label}
            </button>
          );
        })}

        {/* Resources group */}
        <button
          onClick={() => { navigate('/admin/resources'); setResourcesOpen(true); }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 text-left ${
            pathname.startsWith('/admin/resources')
              ? 'bg-white/20 text-white'
              : 'text-white/65 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Newspaper className="w-[16px] h-[16px] flex-shrink-0" />
          <span className="flex-1">Resources</span>
          <ChevronDown
            onClick={e => { e.stopPropagation(); setResourcesOpen(o => !o); }}
            className={`w-3.5 h-3.5 transition-transform cursor-pointer ${resourcesOpen ? 'rotate-180' : ''}`} />
        </button>
        {resourcesOpen && (
          <div className="ml-3 border-l border-white/10 pl-3 space-y-0.5 mb-1">
            {resourceNav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <button
                  key={href}
                  onClick={() => navigate(href)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 text-left ${
                    active ? 'bg-white/20 text-white' : 'text-white/55 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-[14px] h-[14px] flex-shrink-0" />
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <Leaf className="w-4 h-4 flex-shrink-0" /> {tr.sidebar.viewLiveSite}
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" /> {tr.sidebar.logOut}
        </button>
      </div>
    </aside>
  );
}
