'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/admin/Modal';

const ICONS  = ['Leaf','Map','Cloud','Shield','BarChart3','BookOpen','Users','Globe','Recycle','Star','Zap','Heart'];
const COLORS = ['bg-green-50 text-green-600','bg-blue-50 text-blue-600','bg-sky-50 text-sky-600','bg-red-50 text-red-600','bg-purple-50 text-purple-600','bg-yellow-50 text-yellow-600','bg-orange-50 text-orange-600','bg-teal-50 text-teal-600','bg-lime-50 text-lime-600'];

interface Service { id: number; icon: string; title: string; desc: string; color: string; }
const EMPTY: Omit<Service, 'id'> = { icon: 'Leaf', title: '', desc: '', color: COLORS[0] };

export default function ServicesAdmin() {
  const [items,    setItems]    = useState<Service[]>([]);
  const [modal,    setModal]    = useState<'add' | 'edit' | null>(null);
  const [current,  setCurrent]  = useState<Partial<Service>>(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const d = await fetch('/api/content/services').then(r => r.json());
    setItems(d.services || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    if (modal === 'add') await fetch('/api/content/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    else await fetch(`/api/content/services/${current.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    setSaving(false); setModal(null); load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">List of Services</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h6 className="font-semibold text-gray-700 text-sm">Services</h6>
          <button onClick={() => { setCurrent(EMPTY); setModal('add'); }}
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: '#2c7be5' }}>
            <Plus className="w-3.5 h-3.5" /> Create Service
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['#', 'Icon', 'Title', 'Description', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((s, i) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3.5 text-sm text-gray-400 w-10">{i + 1}</td>
                <td className="px-6 py-3.5">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${s.color}`}>{s.icon.slice(0, 2)}</span>
                </td>
                <td className="px-6 py-3.5 text-sm font-semibold text-gray-800 max-w-[200px]">{s.title}</td>
                <td className="px-6 py-3.5 text-sm text-gray-500 max-w-[360px]">
                  <p className="line-clamp-2">{s.desc}</p>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setCurrent(s); setModal('edit'); }}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ borderColor: '#2c7be5', color: '#2c7be5' }}>
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => setDeleteId(s.id)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-white font-medium" style={{ backgroundColor: '#e63757' }}>
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Create Service' : 'Edit Service'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
              <input value={current.title ?? ''} onChange={e => setCurrent({ ...current, title: e.target.value })} placeholder="Service title"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea value={current.desc ?? ''} onChange={e => setCurrent({ ...current, desc: e.target.value })} rows={3}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Icon Name</label>
              <select value={current.icon ?? ''} onChange={e => setCurrent({ ...current, icon: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                {ICONS.map(ic => <option key={ic}>{ic}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Color Theme</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setCurrent({ ...current, color: c })}
                    className={`w-8 h-8 rounded-lg border-2 ${c} ${current.color === c ? 'border-gray-700 scale-110' : 'border-transparent'} transition-all`} />
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60" style={{ backgroundColor: '#2c7be5' }}>
                {saving ? 'Saving…' : 'Save Service'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Service?" onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">This service will be permanently removed.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">Cancel</button>
            <button onClick={async () => { await fetch(`/api/content/services/${deleteId}`, { method: 'DELETE' }); setDeleteId(null); load(); }}
              className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg" style={{ backgroundColor: '#e63757' }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
