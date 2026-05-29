import { readData } from '@/lib/data';
import { FolderOpen, Wrench, Users, BookOpen, Building2, Presentation, BarChart3, Phone, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function count(file: string, key: string): number {
  try { return (readData<Record<string, unknown[]>>(file)[key] ?? []).length; }
  catch { return 0; }
}

export default function AdminDashboard() {
  const stats = [
    { label: 'Projects',     value: count('projects','projects'),     icon: FolderOpen,   color: '#2c7be5' },
    { label: 'Services',     value: count('services','services'),     icon: Wrench,       color: '#00d97e' },
    { label: 'Team Members', value: count('team','members'),          icon: Users,        color: '#e63757' },
    { label: 'Publications', value: count('research','publications'), icon: BookOpen,     color: '#f6c343' },
  ];

  const sections = [
    { href: '/admin/hero',     label: 'Hero Slides',   desc: 'Manage homepage hero banners',           icon: Presentation },
    { href: '/admin/projects', label: 'Projects',      desc: 'Add and edit portfolio projects',        icon: FolderOpen   },
    { href: '/admin/services', label: 'Services',      desc: 'Manage service offerings',               icon: Wrench       },
    { href: '/admin/about',    label: 'About Section', desc: 'Edit company bio and highlights',        icon: Info         },
    { href: '/admin/stats',    label: 'Statistics',    desc: 'Update impact counter numbers',          icon: BarChart3    },
    { href: '/admin/team',     label: 'Team Members',  desc: 'Manage leadership profiles',             icon: Users        },
    { href: '/admin/clients',  label: 'Clients',       desc: 'Client logos and testimonials',          icon: Building2    },
    { href: '/admin/research', label: 'Research',      desc: 'Publications and papers',                icon: BookOpen     },
    { href: '/admin/contact',  label: 'Contact Info',  desc: 'Address, phone, email and CTA text',     icon: Phone        },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

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

      {/* Sections table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h6 className="font-semibold text-gray-700 text-sm">Content Sections</h6>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider">#</th>
              <th className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider">Section</th>
              <th className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider">Description</th>
              <th className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {sections.map(({ href, label, desc, icon: Icon }, i) => (
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
                    Manage <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
