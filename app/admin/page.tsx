import { readData } from '@/lib/data';
import { FolderOpen, Wrench, Users, BookOpen, Building2, Presentation, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function countItems(file: string, key: string): number {
  try {
    const d = readData<Record<string, unknown[]>>(file);
    return d[key]?.length ?? 0;
  } catch { return 0; }
}

const sections = [
  { href: '/admin/hero',     label: 'Hero Slides',  file: 'hero',     key: 'slides',       icon: Presentation, color: 'bg-indigo-500' },
  { href: '/admin/projects', label: 'Projects',     file: 'projects', key: 'projects',     icon: FolderOpen,   color: 'bg-blue-500'   },
  { href: '/admin/services', label: 'Services',     file: 'services', key: 'services',     icon: Wrench,       color: 'bg-green-500'  },
  { href: '/admin/team',     label: 'Team Members', file: 'team',     key: 'members',      icon: Users,        color: 'bg-orange-500' },
  { href: '/admin/clients',  label: 'Clients',      file: 'clients',  key: 'clients',      icon: Building2,    color: 'bg-rose-500'   },
  { href: '/admin/research', label: 'Publications', file: 'research', key: 'publications', icon: BookOpen,     color: 'bg-purple-500' },
  { href: '/admin/stats',    label: 'Statistics',   file: 'stats',    key: 'stats',        icon: BarChart3,    color: 'bg-teal-500'   },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-3xl p-8 mb-8 text-white">
        <p className="text-green-300 text-sm font-semibold mb-1">Welcome back, Admin</p>
        <h1 className="text-3xl font-bold font-heading">Green BD Dashboard</h1>
        <p className="text-white/70 mt-2 text-sm">Manage all content sections of your live website from here.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {sections.slice(0, 4).map(({ label, file, key, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 font-heading">{countItems(file, key)}</p>
            <p className="text-gray-500 text-sm mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Section quick-edit links */}
      <h2 className="text-lg font-bold text-gray-900 font-heading mb-4">Manage Sections</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: '/admin/hero',     label: 'Hero Slides',    desc: 'Edit homepage hero images and text',           icon: Presentation, color: 'text-indigo-500 bg-indigo-50' },
          { href: '/admin/projects', label: 'Projects',       desc: 'Add, edit or remove portfolio projects',       icon: FolderOpen,   color: 'text-blue-500   bg-blue-50'   },
          { href: '/admin/services', label: 'Services',       desc: 'Manage the services your company offers',      icon: Wrench,       color: 'text-green-500  bg-green-50'  },
          { href: '/admin/about',    label: 'About Section',  desc: 'Update company description and highlights',    icon: Users,        color: 'text-orange-500 bg-orange-50' },
          { href: '/admin/stats',    label: 'Statistics',     desc: 'Update the impact numbers counter section',    icon: BarChart3,    color: 'text-teal-500   bg-teal-50'   },
          { href: '/admin/team',     label: 'Team Members',   desc: 'Add or update leadership profiles',            icon: Users,        color: 'text-rose-500   bg-rose-50'   },
          { href: '/admin/clients',  label: 'Clients & Reviews', desc: 'Manage client logos and testimonials',     icon: Building2,    color: 'text-purple-500 bg-purple-50' },
          { href: '/admin/research', label: 'Research',       desc: 'Manage publications and papers',               icon: BookOpen,     color: 'text-yellow-600 bg-yellow-50' },
          { href: '/admin/contact',  label: 'Contact Info',   desc: 'Update address, phone, email and CTA text',   icon: ArrowRight,   color: 'text-gray-500   bg-gray-100'  },
        ].map(({ href, label, desc, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group flex items-start gap-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">{label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all mt-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
