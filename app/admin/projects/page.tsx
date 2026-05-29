'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import ImageUpload from '@/components/admin/ImageUpload';

const CATEGORIES = ['Climate', 'GIS/RS', 'Research', 'Disaster Risk', 'Sustainability', 'Community'];
interface Project { id: number; title: string; category: string; image: string; location: string; }
const EMPTY: Omit<Project, 'id'> = { title: '', category: 'Climate', image: '', location: '' };

export default function ProjectsAdmin() {
  const [items,    setItems]    = useState<Project[]>([]);
  const [modal,    setModal]    = useState<'add' | 'edit' | null>(null);
  const [current,  setCurrent]  = useState<Partial<Project>>(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const d = await fetch('/api/content/projects').then(r => r.json());
    setItems(d.projects || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    if (modal === 'add') await fetch('/api/content/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    else await fetch(`/api/content/projects/${current.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    setSaving(false); setModal(null); load();
  };
  const del = async (id: number) => {
    await fetch(`/api/content/projects/${id}`, { method: 'DELETE' });
    setDeleteId(null); load();
  };

  const tf = (key: keyof typeof current, label: string, ph = '') => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input value={String(current[key] ?? '')} onChange={e => setCurrent({ ...current, [key]: e.target.value })} placeholder={ph}
        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">List of Projects</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h6 className="font-semibold text-gray-700 text-sm">Projects</h6>
          <button onClick={() => { setCurrent(EMPTY); setModal('add'); }}
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#2c7be5' }}>
            <Plus className="w-3.5 h-3.5" /> Create Project
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['#', 'Title', 'Category', 'Location', 'Image', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((p, i) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm text-gray-400 w-10">{i + 1}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-800 max-w-[220px]">{p.title}</td>
                  <td className="px-6 py-3">
                    <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium whitespace-nowrap">{p.category}</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">{p.location}</td>
                  <td className="px-6 py-3">
                    {p.image
                      ? <img src={p.image} alt={p.title} className="w-16 h-11 object-cover rounded-lg border border-gray-100" />
                      : <div className="w-16 h-11 bg-gray-100 rounded-lg flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-300" /></div>}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setCurrent(p); setModal('edit'); }}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
                        style={{ borderColor: '#2c7be5', color: '#2c7be5' }}>
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => setDeleteId(p.id)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-colors"
                        style={{ backgroundColor: '#e63757' }}>
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">No projects yet — click Create Project to add one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <Modal title={modal === 'add' ? 'Create Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {tf('title', 'Project Title', 'e.g. Coastal Flood Vulnerability Mapping')}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
              <select value={String(current.category ?? '')} onChange={e => setCurrent({ ...current, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {tf('location', 'Location', 'e.g. Dhaka, Bangladesh')}
            <ImageUpload value={String(current.image ?? '')} onChange={url => setCurrent({ ...current, image: url })} label="Project Image" />
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60"
                style={{ backgroundColor: '#2c7be5' }}>{saving ? 'Saving…' : 'Save Project'}</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Project?" onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">This project will be permanently removed.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">Cancel</button>
            <button onClick={() => del(deleteId)} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg" style={{ backgroundColor: '#e63757' }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
