'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import PageHeader from '@/components/admin/PageHeader';

interface Slide { id: number; image: string; title: string; subtitle: string; desc: string; }
const EMPTY: Omit<Slide, 'id'> = { image: '', title: '', subtitle: '', desc: '' };

export default function HeroAdmin() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [current, setCurrent] = useState<Partial<Slide>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/content/hero');
    const data = await res.json();
    setSlides(data.slides || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    if (modal === 'add') {
      await fetch('/api/content/slides', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(current) });
    } else {
      // full hero replace
      const updated = slides.map((s) => s.id === current.id ? { ...s, ...current } : s);
      await fetch('/api/content/hero', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ slides: updated }) });
    }
    setSaving(false); setModal(null); load();
  };

  const del = async (id: number) => {
    const updated = slides.filter((s) => s.id !== id);
    await fetch('/api/content/hero', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ slides: updated }) });
    setDeleteId(null); load();
  };

  const addNew = async () => {
    const updated = [...slides, { id: Date.now(), ...EMPTY }];
    await fetch('/api/content/hero', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ slides: updated }) });
    setCurrent({ id: updated[updated.length - 1].id, ...EMPTY });
    setModal('edit');
    load();
  };

  const tf = (key: keyof Slide, label: string, rows?: number) => (
    <div>
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">{label}</label>
      {rows ? (
        <textarea value={String(current[key] ?? '')} onChange={(e) => setCurrent({...current, [key]: e.target.value})} rows={rows} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none" />
      ) : (
        <input value={String(current[key] ?? '')} onChange={(e) => setCurrent({...current, [key]: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
      )}
    </div>
  );

  return (
    <div>
      <PageHeader title="Hero Slides" desc={`${slides.length} slides — displayed as auto-rotating hero`}
        action={
          <button onClick={addNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl">
            <Plus className="w-4 h-4" /> Add Slide
          </button>
        }
      />

      <div className="space-y-4">
        {slides.map((s, i) => (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-stretch">
              {/* Image preview */}
              <div className="w-48 flex-shrink-0 relative bg-gray-100">
                {s.image ? (
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" style={{ minHeight: 140 }} />
                ) : (
                  <div className="w-full h-full min-h-[140px] flex items-center justify-center text-gray-300 text-xs">No image</div>
                )}
                <span className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Slide {i + 1}</span>
              </div>
              {/* Content */}
              <div className="flex-1 p-5">
                <p className="font-bold text-gray-900 text-lg leading-tight">{s.title} <span className="text-primary-600">{s.subtitle}</span></p>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{s.desc}</p>
              </div>
              {/* Actions */}
              <div className="flex flex-col gap-2 p-4 border-l border-gray-100">
                <button onClick={() => { setCurrent(s); setModal('edit'); }} className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setDeleteId(s.id)} className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal === 'edit' && current && (
        <Modal title="Edit Slide" onClose={() => setModal(null)}>
          <div className="space-y-4">
            {tf('image', 'Background Image URL')}
            {current.image && <img src={String(current.image)} alt="preview" className="w-full h-36 object-cover rounded-xl border border-gray-100" />}
            {tf('title', 'Headline (line 1)')}
            {tf('subtitle', 'Headline (line 2 — green accent)')}
            {tf('desc', 'Description', 3)}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-primary-600 text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Slide'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Slide?" onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">This slide will be removed from the hero rotation.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl">Cancel</button>
            <button onClick={() => del(deleteId)} className="flex-1 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
