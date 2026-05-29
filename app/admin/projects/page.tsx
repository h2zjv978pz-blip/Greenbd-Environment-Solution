'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import PageHeader from '@/components/admin/PageHeader';
import ImageUpload from '@/components/admin/ImageUpload';

const CATEGORIES = ['Climate', 'GIS/RS', 'Research', 'Disaster Risk', 'Sustainability', 'Community'];

interface Project { id: number; title: string; category: string; image: string; location: string; }
const EMPTY: Omit<Project, 'id'> = { title: '', category: 'Climate', image: '', location: '' };

export default function ProjectsAdmin() {
  const [items, setItems] = useState<Project[]>([]);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [current, setCurrent] = useState<Partial<Project>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/content/projects');
    const data = await res.json();
    setItems(data.projects || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setCurrent(EMPTY); setModal('add'); };
  const openEdit = (p: Project) => { setCurrent(p); setModal('edit'); };

  const save = async () => {
    setSaving(true);
    if (modal === 'add') {
      await fetch('/api/content/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    } else {
      await fetch(`/api/content/projects/${current.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    }
    setSaving(false);
    setModal(null);
    load();
  };

  const del = async (id: number) => {
    await fetch(`/api/content/projects/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    load();
  };

  const field = (key: keyof typeof current, label: string, placeholder = '') => (
    <div>
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">{label}</label>
      <input
        value={String(current[key] ?? '')}
        onChange={(e) => setCurrent({ ...current, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
      />
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Projects"
        desc={`${items.length} projects in portfolio`}
        action={
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> Add Project
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              {p.image ? (
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
              )}
              <span className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {p.category}
              </span>
            </div>
            <div className="p-3">
              <p className="text-gray-900 font-semibold text-xs leading-tight mb-0.5 line-clamp-2">{p.title}</p>
              <p className="text-gray-400 text-[10px]">{p.location}</p>
              <div className="flex gap-1.5 mt-3">
                <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 py-1.5 rounded-lg transition-colors">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => setDeleteId(p.id)} className="flex-1 flex items-center justify-center gap-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 py-1.5 rounded-lg transition-colors">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <Modal title={modal === 'add' ? 'Add New Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {field('title', 'Project Title', 'e.g. Coastal Flood Vulnerability Mapping')}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Category</label>
              <select
                value={String(current.category ?? '')}
                onChange={(e) => setCurrent({ ...current, category: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            {field('location', 'Location', 'e.g. Dhaka, Bangladesh')}
            <ImageUpload
              value={String(current.image ?? '')}
              onChange={(url) => setCurrent({ ...current, image: url })}
              label="Project Image"
            />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Project'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal title="Delete Project?" onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-600 text-sm mb-6">This action cannot be undone. The project will be permanently removed.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
            <button onClick={() => del(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
