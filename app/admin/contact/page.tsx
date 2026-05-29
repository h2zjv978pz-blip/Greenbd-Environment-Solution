'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

interface ContactData {
  address: string; phone: string; email: string; mapLabel: string;
  ctaTitle: string; ctaDesc: string; formTitle: string; formDesc: string; subjects: string[];
}
const DEF: ContactData = { address:'', phone:'', email:'', mapLabel:'', ctaTitle:'', ctaDesc:'', formTitle:'', formDesc:'', subjects:[] };

export default function ContactAdmin() {
  const [data,   setData]   = useState<ContactData>(DEF);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    fetch('/api/content/contact').then(r => r.json()).then(d => setData({ ...DEF, ...d }));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/content/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const tf = (key: keyof ContactData, label: string, ph = '', rows?: number) => (
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
        <h1 className="text-2xl font-bold text-gray-900">Contact Info</h1>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60"
          style={{ backgroundColor: saved ? '#00d97e' : '#2c7be5' }}>
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">Contact Details</h6>
            {tf('address', 'Office Address')}
            {tf('phone',   'Phone Number')}
            {tf('email',   'Email Address')}
            {tf('mapLabel','Map Label')}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">Form Section</h6>
            {tf('formTitle','Form Heading')}
            {tf('formDesc', 'Form Description', '', 2)}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">Call-to-Action Banner</h6>
            {tf('ctaTitle','CTA Heading')}
            {tf('ctaDesc', 'CTA Description', '', 3)}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h6 className="font-semibold text-gray-700 text-sm">Form Subject Options</h6>
              <button onClick={() => setData({ ...data, subjects: [...data.subjects, ''] })}
                className="flex items-center gap-1 text-xs text-white px-3 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: '#2c7be5' }}>
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {data.subjects.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={s} onChange={e => { const ss = [...data.subjects]; ss[i] = e.target.value; setData({ ...data, subjects: ss }); }}
                    className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                  <button onClick={() => setData({ ...data, subjects: data.subjects.filter((_, j) => j !== i) })}
                    className="text-red-400 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition-colors">
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
