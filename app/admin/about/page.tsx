'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface AboutData {
  heading: string; para1: string; para2: string; image: string;
  yearsExperience: number; projectsCompleted: number; highlights: string[];
}
const DEF: AboutData = { heading: '', para1: '', para2: '', image: '', yearsExperience: 15, projectsCompleted: 200, highlights: [] };

export default function AboutAdmin() {
  const [data,   setData]   = useState<AboutData>(DEF);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    fetch('/api/content/about').then(r => r.json()).then(d => setData({ ...DEF, ...d }));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/content/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const tf = (key: keyof AboutData, label: string, ph = '', rows?: number) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {rows
        ? <textarea value={String(data[key])} onChange={e => setData({ ...data, [key]: e.target.value })} rows={rows} placeholder={ph}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 resize-none" />
        : <input value={String(data[key])} onChange={e => setData({ ...data, [key]: e.target.value })} placeholder={ph}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">About Section</h1>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
          style={{ backgroundColor: saved ? '#00d97e' : '#2c7be5' }}>
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">Section Content</h6>
            {tf('heading', 'Section Heading')}
            {tf('para1', 'First Paragraph', '', 4)}
            {tf('para2', 'Second Paragraph', '', 4)}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">Floating Stats</h6>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Years Experience</label>
                <input type="number" value={data.yearsExperience} onChange={e => setData({ ...data, yearsExperience: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Projects Completed</label>
                <input type="number" value={data.projectsCompleted} onChange={e => setData({ ...data, projectsCompleted: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">About Image</h6>
            <ImageUpload value={data.image} onChange={url => setData({ ...data, image: url })} label="Section Photo" />
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h6 className="font-semibold text-gray-700 text-sm">Key Highlights</h6>
              <button onClick={() => setData({ ...data, highlights: [...data.highlights, ''] })}
                className="flex items-center gap-1 text-xs text-white px-3 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: '#2c7be5' }}>
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {data.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={h} onChange={e => { const hs = [...data.highlights]; hs[i] = e.target.value; setData({ ...data, highlights: hs }); }}
                    className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                  <button onClick={() => setData({ ...data, highlights: data.highlights.filter((_, j) => j !== i) })}
                    className="text-red-400 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {data.highlights.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No highlights yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
