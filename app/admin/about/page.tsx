'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';

interface AboutData {
  heading: string; para1: string; para2: string; image: string;
  yearsExperience: number; projectsCompleted: number; highlights: string[];
}

const DEFAULT: AboutData = { heading: '', para1: '', para2: '', image: '', yearsExperience: 15, projectsCompleted: 200, highlights: [] };

export default function AboutAdmin() {
  const [data, setData] = useState<AboutData>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/content/about').then((r) => r.json()).then((d) => setData({ ...DEFAULT, ...d }));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/content/about', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const tf = (key: keyof AboutData, label: string, rows?: number) => (
    <div>
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">{label}</label>
      {rows ? (
        <textarea value={String(data[key])} onChange={(e) => setData({...data, [key]: e.target.value})} rows={rows} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none" />
      ) : (
        <input value={String(data[key])} onChange={(e) => setData({...data, [key]: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
      )}
    </div>
  );

  const updateHighlight = (i: number, val: string) => {
    const h = [...data.highlights]; h[i] = val; setData({...data, highlights: h});
  };

  return (
    <div>
      <PageHeader title="About Section" desc="Edit company description, image, and key highlights"
        action={
          <button onClick={save} disabled={saving} className={`flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${saved ? 'bg-green-600' : 'bg-primary-600 hover:bg-primary-700'}`}>
            <Save className="w-4 h-4" /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        }
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">Section Content</h3>
            {tf('heading', 'Section Heading')}
            {tf('para1', 'First Paragraph', 4)}
            {tf('para2', 'Second Paragraph', 4)}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Years Experience</label>
                <input type="number" value={data.yearsExperience} onChange={(e) => setData({...data, yearsExperience: Number(e.target.value)})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Projects Completed</label>
                <input type="number" value={data.projectsCompleted} onChange={(e) => setData({...data, projectsCompleted: Number(e.target.value)})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">About Image</h3>
            {tf('image', 'Image URL')}
            {data.image && <img src={data.image} alt="preview" className="w-full h-48 object-cover rounded-xl border border-gray-100" />}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-sm">Key Highlights</h3>
              <button onClick={() => setData({...data, highlights: [...data.highlights, '']})} className="flex items-center gap-1 text-xs text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {data.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={h} onChange={(e) => updateHighlight(i, e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
                  <button onClick={() => setData({...data, highlights: data.highlights.filter((_, j) => j !== i)})} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
