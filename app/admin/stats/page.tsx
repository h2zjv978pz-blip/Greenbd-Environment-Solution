'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import PageHeader from '@/components/admin/PageHeader';

interface Stat { id: number; value: number; suffix: string; label: string; desc: string; }
const EMPTY: Omit<Stat,'id'> = { value: 0, suffix: '+', label: '', desc: '' };

export default function StatsAdmin() {
  const [items, setItems] = useState<Stat[]>([]);
  const [modal, setModal] = useState<'add'|'edit'|null>(null);
  const [current, setCurrent] = useState<Partial<Stat>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number|null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/content/stats');
    const data = await res.json();
    setItems(data.stats || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    if (modal === 'add') {
      await fetch('/api/content/stats', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(current) });
    } else {
      await fetch(`/api/content/stats/${current.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(current) });
    }
    setSaving(false); setModal(null); load();
  };

  return (
    <div>
      <PageHeader title="Statistics" desc="Numbers shown in the animated counter section"
        action={
          <button onClick={() => { setCurrent(EMPTY); setModal('add'); }} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl">
            <Plus className="w-4 h-4" /> Add Stat
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-4xl font-bold text-primary-600 font-heading">{s.value}{s.suffix}</p>
            <p className="font-semibold text-gray-900 text-sm mt-1">{s.label}</p>
            <p className="text-gray-400 text-xs mt-1">{s.desc}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setCurrent(s); setModal('edit'); }} className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"><Pencil className="w-3 h-3" /> Edit</button>
              <button onClick={() => setDeleteId(s.id)} className="flex items-center gap-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"><Trash2 className="w-3 h-3" /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Statistic' : 'Edit Statistic'} onClose={() => setModal(null)} size="sm">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Value</label>
                <input type="number" value={current.value ?? ''} onChange={(e) => setCurrent({...current, value: Number(e.target.value)})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Suffix</label>
                <input value={current.suffix ?? ''} onChange={(e) => setCurrent({...current, suffix: e.target.value})} placeholder="e.g. + or %" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Label</label>
              <input value={current.label ?? ''} onChange={(e) => setCurrent({...current, label: e.target.value})} placeholder="Years of Experience" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Description</label>
              <input value={current.desc ?? ''} onChange={(e) => setCurrent({...current, desc: e.target.value})} placeholder="Short description" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-primary-600 text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Stat?" onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">This statistic will be removed from the counter section.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl">Cancel</button>
            <button onClick={async () => { await fetch(`/api/content/stats/${deleteId}`, {method:'DELETE'}); setDeleteId(null); load(); }} className="flex-1 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
