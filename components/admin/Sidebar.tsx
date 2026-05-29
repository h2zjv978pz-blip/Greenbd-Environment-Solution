'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Presentation, FolderOpen, Wrench,
  Info, Users, Building2, BookOpen, Phone, BarChart3, Settings, LogOut, Leaf,
} from 'lucide-react';

const nav = [
  { href: '/admin',            label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/hero',       label: 'Hero Slides',  icon: Presentation    },
  { href: '/admin/projects',   label: 'Projects',     icon: FolderOpen      },
  { href: '/admin/services',   label: 'Services',     icon: Wrench          },
  { href: '/admin/about',      label: 'About',        icon: Info            },
  { href: '/admin/stats',      label: 'Statistics',   icon: BarChart3       },
  { href: '/admin/team',       label: 'Team Members', icon: Users           },
  { href: '/admin/clients',    label: 'Clients',      icon: Building2       },
  { href: '/admin/research',   label: 'Research',     icon: BookOpen        },
  { href: '/admin/contact',    label: 'Contact Info', icon: Phone           },
  { href: '/admin/settings',   label: 'Site Settings',icon: Settings        },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-[240px] flex flex-col z-40 select-none"
      style={{ background: 'linear-gradient(195deg, #152e4d 0%, #1e3d7b 40%, #5741a8 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Leaf className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight font-heading">Green BD</p>
          <p className="text-white/50 text-[10px] tracking-wide">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
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
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <Leaf className="w-4 h-4 flex-shrink-0" /> View Live Site
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" /> Log Out
        </button>
      </div>
    </aside>
  );
}
