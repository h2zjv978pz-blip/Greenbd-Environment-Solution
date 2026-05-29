'use client';

import { useState, useEffect } from 'react';
import { Save, Leaf, Eye } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface SiteSettings {
  companyName: string;
  tagline: string;
  logo: string;
  favicon: string;
  footerText: string;
  copyrightName: string;
}

const DEF: SiteSettings = {
  companyName: 'Green BD',
  tagline: 'Environmental Solutions',
  logo: '',
  favicon: '',
  footerText: '',
  copyrightName: 'Green BD Environmental Solutions',
};

export default function SettingsAdmin() {
  const [data,   setData]   = useState<SiteSettings>(DEF);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    fetch('/api/content/settings').then(r => r.json()).then(d => setData({ ...DEF, ...d }));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/content/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const tf = (key: keyof SiteSettings, label: string, ph = '', rows?: number) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {rows ? (
        <textarea
          value={String(data[key])} rows={rows} placeholder={ph}
          onChange={e => setData({ ...data, [key]: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 resize-none"
        />
      ) : (
        <input
          value={String(data[key])} placeholder={ph}
          onChange={e => setData({ ...data, [key]: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <button
          onClick={save} disabled={saving}
          className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60 transition-colors"
          style={{ backgroundColor: saved ? '#00d97e' : '#2c7be5' }}
        >
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">

        {/* Left — Identity */}
        <div className="space-y-5">

          {/* Logo & Name card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">
              Brand Identity
            </h6>

            {/* Live preview */}
            <div className="flex items-center gap-2.5 p-4 rounded-xl border border-gray-100 bg-gray-50">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: 'linear-gradient(195deg, #152e4d, #5741a8)' }}
              >
                {data.logo ? (
                  <img src={data.logo} alt="logo" className="w-full h-full object-cover" />
                ) : (
                  <Leaf className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm leading-tight font-heading">
                  {data.companyName || 'Green BD'}
                </p>
                <p className="text-gray-400 text-xs">{data.tagline || 'Environmental Solutions'}</p>
              </div>
              <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Preview
              </span>
            </div>

            {tf('companyName', 'Company Name', 'Green BD')}
            {tf('tagline',     'Tagline / Sub-name', 'Environmental Solutions')}
          </div>

          {/* Footer text */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">Footer</h6>
            {tf('footerText',    'Footer Description', '', 3)}
            {tf('copyrightName', 'Copyright Name', 'Green BD Environmental Solutions')}
          </div>
        </div>

        {/* Right — Logo & Favicon uploads */}
        <div className="space-y-5">

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">
              Logo Image
            </h6>
            <p className="text-xs text-gray-400 -mt-2">
              Upload a custom logo. Recommended: square PNG with transparent background, min 200×200 px.
              If left empty the default green leaf icon is used.
            </p>
            <ImageUpload
              value={data.logo}
              onChange={url => setData({ ...data, logo: url })}
              label="Logo File"
            />
            {data.logo && (
              <button
                type="button"
                onClick={() => setData({ ...data, logo: '' })}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                ✕ Remove logo (use default leaf icon)
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">
              Favicon
            </h6>
            <p className="text-xs text-gray-400 -mt-2">
              Small icon shown in browser tabs. Recommended: 32×32 or 64×64 px square image.
            </p>
            <ImageUpload
              value={data.favicon}
              onChange={url => setData({ ...data, favicon: url })}
              label="Favicon File"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
