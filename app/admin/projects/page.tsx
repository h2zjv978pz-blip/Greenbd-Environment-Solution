'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import type { Project } from '@/lib/getData';

export default function ProjectsAdmin() {
  const router = useRouter();
  const [items,    setItems]    = useState<Project[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const d = await fetch('/api/content/projects').then(r => r.json());
    setItems(d.projects || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const del = async (id: number) => {
    await fetch(`/api/content/projects/${id}`, { method: 'DELETE' });
    setDeleteId(null); load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">List of Projects</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h6 className="font-semibold text-gray-700 text-sm">Projects</h6>
          <button
            onClick={() => router.push('/admin/projects/new')}
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#2c7be5' }}
          >
            <Plus className="w-3.5 h-3.5" /> Create Project
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['#', 'Title', 'Category', 'Client', 'Location', 'Year', 'Image', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((p, i) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm text-gray-400 w-10">{i + 1}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-800 max-w-[200px]">
                    <p className="line-clamp-2">{p.title}</p>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium whitespace-nowrap">{p.category}</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500 max-w-[140px]">
                    <p className="line-clamp-1">{p.clientName || <span className="text-gray-300">—</span>}</p>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">{p.location}</td>
                  <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">{p.projectTime || <span className="text-gray-300">—</span>}</td>
                  <td className="px-6 py-3">
                    {p.image
                      ? <img src={p.image} alt={p.title} className="w-16 h-11 object-cover rounded-lg border border-gray-100" />
                      : <div className="w-16 h-11 bg-gray-100 rounded-lg flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-300" /></div>}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/admin/projects/${p.id}/edit`)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
                        style={{ borderColor: '#2c7be5', color: '#2c7be5' }}
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-colors"
                        style={{ backgroundColor: '#e63757' }}
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-400">
                    No projects yet — click Create Project to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteId && (
        <Modal title="Delete Project?" onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">This project will be permanently removed from the website.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={() => del(deleteId)} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg" style={{ backgroundColor: '#e63757' }}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
