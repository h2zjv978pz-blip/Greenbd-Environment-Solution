'use client';

import { useState, useEffect } from 'react';
import { Save, Leaf, Eye, GripVertical, Menu } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface SiteSettings {
  companyName: string; tagline: string; logo: string; favicon: string;
  footerText: string; copyrightName: string;
  nameFont: string; nameSizePx: string; nameBold: boolean;
  taglineFont: string; taglineSizePx: string;
  logoSizePx: string;
  logoSizeMobilePx: string;
  showNameMobile: boolean;
  showTaglineMobile: boolean;
  navOrder?: string[];
}

const NAV_DEFAULT_ORDER = ['home', 'about', 'services', 'projects', 'research', 'climateMap', 'team', 'clients'];

const NAV_LABELS: Record<string, string> = {
  home: 'Home', about: 'About', services: 'Services', projects: 'Projects',
  research: 'Research', climateMap: 'Climate Map', team: 'Team', clients: 'Clients',
};

const DEF: SiteSettings = {
  companyName: 'Green BD', tagline: 'Environmental Solutions',
  logo: '', favicon: '', footerText: '', copyrightName: 'Green BD Environmental Solutions',
  nameFont: 'Poppins', nameSizePx: '16', nameBold: true,
  taglineFont: 'Inter', taglineSizePx: '10', logoSizePx: '40',
  logoSizeMobilePx: '40', showNameMobile: true, showTaglineMobile: false,
  navOrder: NAV_DEFAULT_ORDER,
};

const FONTS = [
  'Poppins', 'Inter', 'Roboto', 'Open Sans', 'Lato',
  'Montserrat', 'Nunito', 'Raleway', 'Georgia', 'Times New Roman',
  'Arial', 'Verdana', 'Trebuchet MS',
];

const NAME_SIZES  = ['10','11','12','13','14','15','16','17','18','20','22','24','28','32'];
const TAG_SIZES   = ['8','9','10','11','12','13','14','15','16'];
const LOGO_SIZES  = ['28','32','36','40','44','48','52','56','64','72','80','96'];

export default function SettingsAdmin() {
  const [data,   setData]   = useState<SiteSettings>(DEF);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [navDragSrc,  setNavDragSrc]  = useState<number | null>(null);
  const [navDragOver, setNavDragOver] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/content/settings').then(r => r.json()).then(d => setData({ ...DEF, ...d }));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/content/settings', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const s = (key: keyof SiteSettings, val: unknown) => setData(d => ({ ...d, [key]: val }));

  // Normalized nav order — keeps any items missing from saved order at the end
  const navOrder = [
    ...(data.navOrder || []).filter(k => NAV_LABELS[k]),
    ...NAV_DEFAULT_ORDER.filter(k => !(data.navOrder || []).includes(k)),
  ];

  const onNavDragStart = (e: React.DragEvent, idx: number) => {
    setNavDragSrc(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };
  const onNavDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (idx !== navDragSrc) setNavDragOver(idx);
  };
  const onNavDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault();
    const fromIdx = navDragSrc;
    if (fromIdx === null || fromIdx === toIdx) { setNavDragSrc(null); setNavDragOver(null); return; }
    const arr = [...navOrder];
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, moved);
    s('navOrder', arr);
    setNavDragSrc(null);
    setNavDragOver(null);
  };
  const onNavDragEnd = () => { setNavDragSrc(null); setNavDragOver(null); };

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';
  const selectCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-white';

  const logoSz = Number(data.logoSizePx) || 40;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60 transition-colors"
          style={{ backgroundColor: saved ? '#00d97e' : '#2c7be5' }}>
          <Save className="w-4 h-4" />{saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">

        {/* ── LEFT ──────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Brand Identity */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">Brand Identity</h6>

            {/* Live preview */}
            <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
              <div
                className="rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-primary-600"
                style={{ width: logoSz, height: logoSz, minWidth: logoSz }}
              >
                {data.logo
                  ? <img src={data.logo} alt="logo" className="w-full h-full object-cover" />
                  : <Leaf className="text-white" style={{ width: logoSz * 0.5, height: logoSz * 0.5 }} />}
              </div>
              <div>
                <p style={{
                  fontFamily: data.nameFont,
                  fontSize: `${data.nameSizePx}px`,
                  fontWeight: data.nameBold ? 700 : 400,
                  lineHeight: 1.2,
                  color: '#111827',
                }}>
                  {data.companyName || 'Green BD'}
                </p>
                <p style={{
                  fontFamily: data.taglineFont,
                  fontSize: `${data.taglineSizePx}px`,
                  color: '#6b7280',
                  marginTop: 2,
                }}>
                  {data.tagline || 'Environmental Solutions'}
                </p>
              </div>
              <span className="ml-auto text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                <Eye className="w-3.5 h-3.5" /> Preview
              </span>
            </div>

            {/* Company Name */}
            <div>
              <label className={labelCls}>Company Name</label>
              <input value={data.companyName} onChange={e => s('companyName', e.target.value)} className={inputCls} placeholder="Green BD" />
            </div>

            {/* Name typography */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Name Font</label>
                <select value={data.nameFont} onChange={e => s('nameFont', e.target.value)} className={selectCls}>
                  {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Size (px)</label>
                <select value={data.nameSizePx} onChange={e => s('nameSizePx', e.target.value)} className={selectCls}>
                  {NAME_SIZES.map(n => <option key={n} value={n}>{n}px</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="nameBold" checked={data.nameBold}
                onChange={e => s('nameBold', e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500" />
              <label htmlFor="nameBold" className="text-sm text-gray-600 cursor-pointer">Bold name</label>
            </div>

            {/* Tagline */}
            <div className="pt-1 border-t border-gray-100">
              <label className={labelCls}>Tagline / Sub-name</label>
              <input value={data.tagline} onChange={e => s('tagline', e.target.value)} className={inputCls} placeholder="Environmental Solutions" />
            </div>

            {/* Tagline typography */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Tagline Font</label>
                <select value={data.taglineFont} onChange={e => s('taglineFont', e.target.value)} className={selectCls}>
                  {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Size (px)</label>
                <select value={data.taglineSizePx} onChange={e => s('taglineSizePx', e.target.value)} className={selectCls}>
                  {TAG_SIZES.map(n => <option key={n} value={n}>{n}px</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">Footer</h6>
            <div>
              <label className={labelCls}>Footer Description</label>
              <RichTextEditor value={data.footerText} onChange={v => s('footerText', v)} minHeight={100} />
            </div>
            <div>
              <label className={labelCls}>Copyright Name</label>
              <input value={data.copyrightName} onChange={e => s('copyrightName', e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        {/* ── RIGHT ─────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Logo image + size */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">Logo Image</h6>
            <p className="text-xs text-gray-400 -mt-2">
              Recommended: square PNG with transparent background, min 200×200 px.
              Leave empty to use the default green leaf icon.
            </p>

            {/* Logo size */}
            <div>
              <label className={labelCls}>Logo Display Size (px)</label>
              <div className="flex items-center gap-4">
                <input type="range" min="28" max="96" step="4"
                  value={data.logoSizePx}
                  onChange={e => s('logoSizePx', e.target.value)}
                  className="flex-1 accent-blue-500"
                />
                <span className="text-sm font-semibold text-gray-700 w-16 text-center border border-gray-200 rounded-lg py-1">
                  {data.logoSizePx}×{data.logoSizePx}
                </span>
              </div>
              {/* Size presets */}
              <div className="flex flex-wrap gap-2 mt-2">
                {[{label:'S',val:'32'},{label:'M',val:'40'},{label:'L',val:'48'},{label:'XL',val:'64'},{label:'2XL',val:'80'}].map(({label,val}) => (
                  <button key={val} type="button" onClick={() => s('logoSizePx', val)}
                    className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-colors ${data.logoSizePx === val ? 'text-white border-blue-500' : 'text-gray-500 border-gray-200 hover:border-blue-400'}`}
                    style={data.logoSizePx === val ? { backgroundColor: '#2c7be5' } : {}}>
                    {label} ({val}px)
                  </button>
                ))}
              </div>
            </div>

            <ImageUpload value={data.logo} onChange={url => s('logo', url)} label="Logo File" />
            {data.logo && (
              <button type="button" onClick={() => s('logo', '')} className="text-xs text-red-500 hover:text-red-700 transition-colors">
                ✕ Remove logo (use default leaf icon)
              </button>
            )}
          </div>

          {/* ── Mobile Logo Settings ───────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3 flex items-center gap-2">
              📱 Mobile Logo Settings
            </h6>
            <p className="text-xs text-gray-400 -mt-2">Controls how the logo appears on phone screens (under 768 px wide).</p>

            {/* Mobile preview */}
            <div className="flex items-start gap-4">
              {/* Phone frame */}
              <div className="flex-shrink-0 bg-gray-900 rounded-2xl p-2 w-36 shadow-lg border-2 border-gray-700">
                <div className="bg-green-900 rounded-xl p-2 flex items-center gap-2">
                  <div
                    className="bg-primary-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{ width: Number(data.logoSizeMobilePx) || 40, height: Number(data.logoSizeMobilePx) || 40 }}
                  >
                    <img
                      src={data.logo || '/favicon.svg'}
                      alt="logo"
                      className="w-full h-full object-contain"
                      onError={e => { (e.target as HTMLImageElement).src = '/favicon.svg'; }}
                    />
                  </div>
                  <div className="overflow-hidden">
                    {data.showNameMobile && (
                      <p className="text-white font-bold truncate" style={{ fontSize: 9, fontFamily: data.nameFont }}>
                        {data.companyName || 'Green BD'}
                      </p>
                    )}
                    {data.showTaglineMobile && (
                      <p className="text-green-300 truncate" style={{ fontSize: 7, fontFamily: data.taglineFont }}>
                        {data.tagline || 'Environmental Solutions'}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-center text-gray-500 text-[8px] mt-1">Mobile Preview</p>
              </div>

              {/* Controls */}
              <div className="flex-1 space-y-4">
                {/* Mobile logo size */}
                <div>
                  <label className={labelCls}>Logo Size on Mobile</label>
                  <div className="flex items-center gap-3 mb-2">
                    <input type="range" min="24" max="56" step="4"
                      value={data.logoSizeMobilePx}
                      onChange={e => s('logoSizeMobilePx', e.target.value)}
                      className="flex-1 accent-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700 w-14 text-center border border-gray-200 rounded-lg py-1">
                      {data.logoSizeMobilePx}px
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[{label:'XS',val:'28'},{label:'S',val:'36'},{label:'M',val:'40'},{label:'L',val:'48'},{label:'XL',val:'56'}].map(({label,val}) => (
                      <button key={val} type="button" onClick={() => s('logoSizeMobilePx', val)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-colors ${data.logoSizeMobilePx === val ? 'text-white border-blue-500 bg-blue-500' : 'text-gray-500 border-gray-200 hover:border-blue-400'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visibility toggles */}
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Show on Mobile</p>
                  {[
                    { key: 'showNameMobile' as const,    label: 'Company Name',  desc: 'Show "Green BD" text beside logo' },
                    { key: 'showTaglineMobile' as const, label: 'Tagline',       desc: 'Show "Environmental Solutions" text' },
                  ].map(({ key, label, desc }) => (
                    <label key={key} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={data[key] as boolean}
                        onChange={e => s(key, e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded accent-blue-500 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{label}</p>
                        <p className="text-xs text-gray-400">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Favicon */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">Favicon</h6>
            <p className="text-xs text-gray-400 -mt-2">Small icon shown in browser tabs. Recommended: 32×32 or 64×64 px square image.</p>
            <ImageUpload value={data.favicon} onChange={url => s('favicon', url)} label="Favicon File" />
          </div>

        </div>
      </div>

      {/* Navigation Menu Order */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3 mt-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h6 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
            <Menu className="w-4 h-4" /> Navigation Menu Order
          </h6>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-60 transition-colors"
            style={{ backgroundColor: saved ? '#00d97e' : '#2c7be5' }}>
            <Save className="w-3.5 h-3.5" />{saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
        <p className="text-xs text-gray-400 -mt-1 flex items-center gap-1">
          <GripVertical className="w-3 h-3" /> Drag items to set the order they appear in the site's main menu, then click Save Changes.
        </p>

        <div className="space-y-1.5 max-w-md">
          {navOrder.map((key, i) => {
            const isDragging = navDragSrc  === i;
            const isDropZone = navDragOver === i && navDragSrc !== i;
            return (
              <div
                key={key}
                draggable
                onDragStart={e => onNavDragStart(e, i)}
                onDragOver={e => onNavDragOver(e, i)}
                onDragLeave={() => setNavDragOver(null)}
                onDrop={e => onNavDrop(e, i)}
                onDragEnd={onNavDragEnd}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border select-none transition-all duration-100
                  ${isDragging ? 'opacity-30 bg-blue-50/60 scale-[0.99] border-gray-100' : ''}
                  ${isDropZone ? 'border-t-[3px] border-t-blue-500 bg-blue-50/50 border-x-gray-100 border-b-gray-100' : ''}
                  ${!isDragging && !isDropZone ? 'border-gray-100 hover:bg-gray-50' : ''}
                `}
              >
                <span className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors">
                  <GripVertical className="w-4 h-4" />
                </span>
                <span className="text-xs text-gray-400 tabular-nums w-4">{i + 1}</span>
                <span className="text-sm font-medium text-gray-700">{NAV_LABELS[key] || key}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
