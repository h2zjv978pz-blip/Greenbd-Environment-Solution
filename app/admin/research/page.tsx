'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import PageHeader from '@/components/admin/PageHeader';

interface Publication { id: number; title: string; journal: string; year: string; tags: string[]; abstract: string; }
const EMPTY: Omit<Publication,'id'> = { title: '', journal: '', year: '', tags: [], abstract: '' };

export default function ResearchAdmin() {
  const [items, setItems] = useState<Publication[]>([]);
  const [modal, setModal] = useState<'add'|'edit'|null>(null);
  const [current, setCurrent] = useState<Partial<Publication>>(EMPTY);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number|null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/content/research');
    const d = await res.json();
    setItems(d.publications || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    if (modal === 'add') {
      await fetch('/api/content/publications', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(current) });
    } else {
      await fetch(`/api/content/publications/${current.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(current) });
    }
    setSaving(false); setModal(null); load();
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !current.tags?.includes(t)) { setCurrent({...current, tags: [...(current.tags||[]), t]}); }
    setTagInput('');
  };

  const removeTag = (tag: string) => setCurrent({...current, tags: current.tags?.filter((t) => t !== tag) || []});

  const tf = (key: keyof Publication, label: string, ph = '', rows?: number) => (
    <div>
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">{label}</label>
      {rows ? (
        <textarea value={String(current[key] ?? '')} onChange={(e) => setCurrent({...current, [key]: e.target.value})} rows={rows} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none" />
      ) : (
        <input value={String(current[key] ?? '')} onChange={(e) => setCurrent({...current, [key]: e.target.value})} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
      )}
    </div>
  );

  return (
    <div>
      <PageHeader title="Research & Publications" desc={`${items.length} publications`}
        action={<button onClick={() => { setCurrent(EMPTY); setTagInput(''); setModal('add'); }} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"><Plus className="w-4 h-4" /> Add Publication</button>}
      />

      <div className="space-y-4">
        {items.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-gray-900">{p.title}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>{p.journal}</span><span>·</span><span>{p.year}</span>
                </div>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{p.abstract}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.tags.map((t) => <span key={t} className="bg-primary-50 text-primary-700 text-[11px] font-medium px-2 py-0.5 rounded-full">{t}</span>)}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => { setCurrent(p); setTagInput(''); setModal('edit'); }} className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"><Pencil className="w-3 h-3" /> Edit</button>
                <button onClick={() => setDeleteId(p.id)} className="flex items-center gap-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"><Trash2 className="w-3 h-3" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Publication' : 'Edit Publication'} onClose={() => setModal(null)} size="lg">
          <div className="space-y-4">
            {tf('title', 'Paper Title', 'Full title of the research paper')}
            <div className="grid grid-cols-2 gap-4">
              {tf('journal', 'Journal / Conference')}
              {tf('year', 'Year', '2024')}
            </div>
            {tf('abstract', 'Abstract', 'Short abstract describing the research', 4)}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Tags</label>
              <div className="flex gap-2 mb-2">
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} placeholder="Add tag and press Enter" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400" />
                <button type="button" onClick={addTag} className="bg-primary-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-primary-700">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {current.tags?.map((t) => (
                  <span key={t} className="flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {t}<button onClick={() => removeTag(t)} className="ml-0.5 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-primary-600 text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-60">{saving ? 'Saving…' : 'Save Publication'}</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Publication?" onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">This publication will be permanently removed.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl">Cancel</button>
            <button onClick={async () => { await fetch(`/api/content/publications/${deleteId}`, {method:'DELETE'}); setDeleteId(null); load(); }} className="flex-1 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
