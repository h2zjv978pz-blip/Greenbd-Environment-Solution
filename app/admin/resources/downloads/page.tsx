'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, ChevronUp, ChevronDown } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface DlItem {
  id: number; title: string; category: string; fileUrl: string;
  fileType: string; fileSize: string; description: string; date: string; downloadCount: number;
}

const CATS = ['Reports', 'Guides', 'Technical', 'Policy', 'Data', 'Forms'];
const TYPES = ['PDF', 'DOCX', 'XLSX', 'ZIP', 'CSV'];
const DEF: DlItem = { id: 0, title: '', category: 'Reports', fileUrl: '', fileType: 'PDF', fileSize: '', description: '', date: new Date().toISOString().split('T')[0], downloadCount: 0 };

export default function DownloadsAdmin() {
  const [items, setItems] = useState<DlItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/content/downloads').then(r => r.json()).then(d => setItems(d.downloads ?? []));
  }, []);

  const saveAll = async () => {
    setSaving(true);
    await fetch('/api/content/downloads', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ downloads: items }) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const add = () => setItems(ls => [...ls, { ...DEF, id: Date.now() }]);
  const upd = (i: number, key: keyof DlItem, val: unknown) => setItems(ls => ls.map((l, j) => j === i ? { ...l, [key]: val } : l));
  const remove = (i: number) => setItems(ls => ls.filter((_, j) => j !== i));
  const move = (i: number, d: -1 | 1) => {
    const arr = [...items]; const j = i + d;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]]; setItems(arr);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Downloads / Guides</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} file{items.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={add} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg text-white" style={{ backgroundColor: '#00d97e' }}>
            <Plus className="w-4 h-4" /> Add File
          </button>
          <button onClick={saveAll} disabled={saving} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg text-white disabled:opacity-60"
            style={{ backgroundColor: saved ? '#00d97e' : '#2c7be5' }}>
            <Save className="w-4 h-4" /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.length === 0 && <p className="text-gray-400 text-center py-16 bg-white rounded-xl border">No files added yet.</p>}
        {items.map((item, i) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-0.5 pt-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20"><ChevronDown className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                  <input value={item.title} onChange={e => upd(i, 'title', e.target.value)} placeholder="Report / Guide title"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <select value={item.category} onChange={e => upd(i, 'category', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">File Type</label>
                  <select value={item.fileType} onChange={e => upd(i, 'fileType', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">File Size</label>
                  <input value={item.fileSize} onChange={e => upd(i, 'fileSize', e.target.value)} placeholder="e.g. 2.4 MB"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                  <input type="date" value={item.date} onChange={e => upd(i, 'date', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div className="lg:col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Download URL</label>
                  <input value={item.fileUrl} onChange={e => upd(i, 'fileUrl', e.target.value)} placeholder="https://… (leave empty to show Coming Soon)"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div className="lg:col-span-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                  <RichTextEditor value={item.description} onChange={v => upd(i, 'description', v)} minHeight={80} />
                </div>
              </div>
              <button onClick={() => remove(i)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
