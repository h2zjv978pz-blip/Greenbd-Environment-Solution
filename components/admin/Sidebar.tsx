'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Presentation, FolderOpen, Wrench,
  Info, Users, Building2, BookOpen, Phone, BarChart3,
  LogOut, Leaf, ChevronRight,
} from 'lucide-react';

const nav = [
  { href: '/admin',            label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/hero',       label: 'Hero Slides',  icon: Presentation },
  { href: '/admin/projects',   label: 'Projects',     icon: FolderOpen },
  { href: '/admin/services',   label: 'Services',     icon: Wrench },
  { href: '/admin/about',      label: 'About',        icon: Info },
  { href: '/admin/stats',      label: 'Statistics',   icon: BarChart3 },
  { href: '/admin/team',       label: 'Team',         icon: Users },
  { href: '/admin/clients',    label: 'Clients',      icon: Building2 },
  { href: '/admin/research',   label: 'Research',     icon: BookOpen },
  { href: '/admin/contact',    label: 'Contact Info', icon: Phone },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-950 flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold font-heading text-sm leading-tight">Green BD Admin</p>
          <p className="text-gray-500 text-[10px]">Content Management</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">
          Content Sections
        </p>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all group ${
                active
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </nav>

      {/* View site + Logout */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-2">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Leaf className="w-4 h-4" /> View Live Site
        </a>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-950 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </aside>
  );
}
