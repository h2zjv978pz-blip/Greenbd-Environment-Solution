'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';

interface ContactData {
  address: string; phone: string; email: string; mapLabel: string;
  ctaTitle: string; ctaDesc: string; formTitle: string; formDesc: string; subjects: string[];
}
const DEF: ContactData = { address:'', phone:'', email:'', mapLabel:'', ctaTitle:'', ctaDesc:'', formTitle:'', formDesc:'', subjects:[] };

export default function ContactAdmin() {
  const [data, setData] = useState<ContactData>(DEF);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/content/contact').then((r) => r.json()).then((d) => setData({ ...DEF, ...d }));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/content/contact', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const tf = (key: keyof ContactData, label: string, ph = '', rows?: number) => (
    <div>
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">{label}</label>
      {rows ? (
        <textarea value={String(data[key])} onChange={(e) => setData({...data, [key]: e.target.value})} rows={rows} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none" />
      ) : (
        <input value={String(data[key])} onChange={(e) => setData({...data, [key]: e.target.value})} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
      )}
    </div>
  );

  const updateSubject = (i: number, v: string) => {
    const s = [...data.subjects]; s[i] = v; setData({...data, subjects: s});
  };

  return (
    <div>
      <PageHeader title="Contact Info" desc="Update address, phone, email and contact form content"
        action={
          <button onClick={save} disabled={saving} className={`flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${saved ? 'bg-green-600' : 'bg-primary-600 hover:bg-primary-700'}`}>
            <Save className="w-4 h-4" /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        }
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact details */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">Contact Details</h3>
            {tf('address', 'Office Address', 'House 12, Road 5, Dhanmondi…')}
            {tf('phone', 'Phone Number', '+880-2-XXXXXXX')}
            {tf('email', 'Email Address', 'info@greenbd-env.com')}
            {tf('mapLabel', 'Map Label', 'Dhanmondi, Dhaka')}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">Form Section</h3>
            {tf('formTitle', 'Form Heading')}
            {tf('formDesc', 'Form Description', '', 2)}
          </div>
        </div>

        {/* CTA + Subjects */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">Call-to-Action Banner</h3>
            {tf('ctaTitle', 'CTA Heading')}
            {tf('ctaDesc', 'CTA Description', '', 3)}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-sm">Form Subject Options</h3>
              <button onClick={() => setData({...data, subjects: [...data.subjects, '']})} className="flex items-center gap-1 text-xs text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg">
                <Plus className="w-3 h-3" /> Add Option
              </button>
            </div>
            <div className="space-y-2">
              {data.subjects.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={s} onChange={(e) => updateSubject(i, e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
                  <button onClick={() => setData({...data, subjects: data.subjects.filter((_,j) => j !== i)})} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50">
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
