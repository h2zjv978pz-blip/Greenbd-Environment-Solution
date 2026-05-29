'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import PageHeader from '@/components/admin/PageHeader';

const ICONS = ['Leaf','Map','Cloud','Shield','BarChart3','BookOpen','Users','Globe','Recycle','Star','Zap','Heart'];
const COLORS = [
  'bg-green-50 text-green-600','bg-blue-50 text-blue-600','bg-sky-50 text-sky-600',
  'bg-red-50 text-red-600','bg-purple-50 text-purple-600','bg-yellow-50 text-yellow-600',
  'bg-orange-50 text-orange-600','bg-teal-50 text-teal-600','bg-lime-50 text-lime-600',
];

interface Service { id: number; icon: string; title: string; desc: string; color: string; }
const EMPTY: Omit<Service, 'id'> = { icon: 'Leaf', title: '', desc: '', color: COLORS[0] };

export default function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [current, setCurrent] = useState<Partial<Service>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/content/services');
    const data = await res.json();
    setItems(data.services || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    if (modal === 'add') {
      await fetch('/api/content/services', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(current) });
    } else {
      await fetch(`/api/content/services/${current.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(current) });
    }
    setSaving(false); setModal(null); load();
  };

  const del = async (id: number) => {
    await fetch(`/api/content/services/${id}`, { method: 'DELETE' });
    setDeleteId(null); load();
  };

  return (
    <div>
      <PageHeader title="Services" desc={`${items.length} services listed`}
        action={
          <button onClick={() => { setCurrent(EMPTY); setModal('add'); }} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> Add Service
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-sm font-bold ${s.color}`}>
              {s.icon.slice(0,2)}
            </div>
            <p className="font-semibold text-gray-900 text-sm mb-1">{s.title}</p>
            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{s.desc}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setCurrent(s); setModal('edit'); }} className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg">
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button onClick={() => setDeleteId(s.id)} className="flex items-center gap-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Service' : 'Edit Service'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Title</label>
              <input value={current.title ?? ''} onChange={(e) => setCurrent({...current, title: e.target.value})} placeholder="Service title" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Description</label>
              <textarea value={current.desc ?? ''} onChange={(e) => setCurrent({...current, desc: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Icon Name</label>
              <select value={current.icon ?? ''} onChange={(e) => setCurrent({...current, icon: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400">
                {ICONS.map((ic) => <option key={ic}>{ic}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Color Theme</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setCurrent({...current, color: c})}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${c} ${current.color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Service'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Service?" onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">This service will be permanently removed from the website.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl">Cancel</button>
            <button onClick={() => del(deleteId)} className="flex-1 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
