'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import ImageUpload from '@/components/admin/ImageUpload';

interface Slide { id: number; image: string; title: string; subtitle: string; desc: string; }
const EMPTY: Omit<Slide, 'id'> = { image: '', title: '', subtitle: '', desc: '' };

export default function HeroAdmin() {
  const [slides,   setSlides]   = useState<Slide[]>([]);
  const [modal,    setModal]    = useState<'edit' | null>(null);
  const [current,  setCurrent]  = useState<Partial<Slide>>(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const d = await fetch('/api/content/hero').then(r => r.json());
    setSlides(d.slides || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    const updated = slides.map(s => s.id === current.id ? { ...s, ...current } : s);
    await fetch('/api/content/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slides: updated }) });
    setSaving(false); setModal(null); load();
  };

  const addNew = async () => {
    const newSlide = { id: Date.now(), ...EMPTY };
    await fetch('/api/content/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slides: [...slides, newSlide] }) });
    setCurrent(newSlide); setModal('edit'); load();
  };

  const del = async (id: number) => {
    await fetch('/api/content/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slides: slides.filter(s => s.id !== id) }) });
    setDeleteId(null); load();
  };

  const tf = (key: keyof Slide, label: string, rows?: number) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {rows
        ? <textarea value={String(current[key] ?? '')} onChange={e => setCurrent({ ...current, [key]: e.target.value })} rows={rows}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 resize-none" />
        : <input value={String(current[key] ?? '')} onChange={e => setCurrent({ ...current, [key]: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hero Slides</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h6 className="font-semibold text-gray-700 text-sm">Slides</h6>
          <button onClick={addNew} className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: '#2c7be5' }}>
            <Plus className="w-3.5 h-3.5" /> Create Slide
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Slide No.', 'Title', 'Subtitle', 'Description', 'Image', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slides.map((s, i) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-sm text-gray-500 font-semibold">#{i + 1}</td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-800 max-w-[150px]">{s.title || <span className="text-gray-300 italic">—</span>}</td>
                <td className="px-6 py-3 text-sm text-gray-600 max-w-[150px]">{s.subtitle || <span className="text-gray-300 italic">—</span>}</td>
                <td className="px-6 py-3 text-sm text-gray-500 max-w-[250px]">
                  <p className="line-clamp-2">{s.desc || <span className="text-gray-300 italic">—</span>}</p>
                </td>
                <td className="px-6 py-3">
                  {s.image
                    ? <img src={s.image} alt={s.title} className="w-20 h-12 object-cover rounded-lg border border-gray-100" />
                    : <div className="w-20 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">No image</div>}
                </td>
                <td className="px-6 py-3">
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

      {modal === 'edit' && current && (
        <Modal title="Edit Slide" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <ImageUpload value={String(current.image ?? '')} onChange={url => setCurrent({ ...current, image: url })} label="Background Image" />
            {tf('title', 'Headline Line 1')}
            {tf('subtitle', 'Headline Line 2 (green accent)')}
            {tf('desc', 'Description', 3)}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60" style={{ backgroundColor: '#2c7be5' }}>
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
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">Cancel</button>
            <button onClick={() => del(deleteId)} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg" style={{ backgroundColor: '#e63757' }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
