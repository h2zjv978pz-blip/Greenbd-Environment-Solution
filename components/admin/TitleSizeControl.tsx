'use client';

import { useState, useEffect, useRef } from 'react';
import { Type, Check, Save } from 'lucide-react';

// Maps label → Tailwind size key stored in mobileSettings.typography.headingSize
const SIZES = [
  { key: 'xs',   label: 'XS',   px: '12px', preview: 12 },
  { key: 'sm',   label: 'SM',   px: '14px', preview: 14 },
  { key: 'base', label: 'MD',   px: '16px', preview: 16 },
  { key: 'xl',   label: 'LG',   px: '20px', preview: 20 },
  { key: '2xl',  label: 'XL',   px: '24px', preview: 24 },
  { key: '3xl',  label: '2XL',  px: '30px', preview: 30 },
] as const;

const TEXT_FIELDS = [
  { id: 'headingSize',   label: 'Hero Title',      sample: 'Environmental Solutions' },
  { id: 'bodySize',      label: 'Body Text',        sample: 'GIS research & eco-innovation' },
] as const;

const BODY_SIZES = [
  { key: 'xs',   label: 'XS', px: '11px' },
  { key: 'sm',   label: 'SM', px: '13px' },
  { key: 'base', label: 'MD', px: '14px' },
  { key: 'lg',   label: 'LG', px: '16px' },
] as const;

interface Typography {
  headingSize: string;
  bodySize:    string;
  textAlign:   string;
  lineHeight:  string;
  buttonSize:  string;
  sectionSpacing: string;
}

export default function TitleSizeControl() {
  const [typo,   setTypo]   = useState<Typography | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    fetch('/api/mobile-settings').then(r => r.json())
      .then(d => setTypo(d.typography ?? { headingSize:'xl', bodySize:'base', textAlign:'center', lineHeight:'normal', buttonSize:'lg', sectionSpacing:'normal' }))
      .catch(() => {});
  }, []);

  const save = async (updated: Typography) => {
    setSaving(true);
    const current = await fetch('/api/mobile-settings').then(r => r.json()).catch(() => ({}));
    await fetch('/api/mobile-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...current, typography: updated }),
    });
    setSaving(false); setSaved(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(false), 1800);
  };

  const pick = (field: 'headingSize' | 'bodySize', val: string) => {
    if (!typo) return;
    const updated = { ...typo, [field]: val };
    setTypo(updated);
    save(updated);
  };

  if (!typo) return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse h-28" />
  );

  const headingPx: Record<string,number> = { xs:12, sm:14, base:16, xl:20, '2xl':24, '3xl':30 };
  const bodyPx:    Record<string,number> = { xs:11, sm:13, base:14, lg:16 };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-violet-50 rounded-xl flex items-center justify-center">
            <Type className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Mobile Title Size</p>
            <p className="text-xs text-gray-400">Hero heading & body text on mobile</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${saved ? 'bg-emerald-100 text-emerald-700' : 'text-gray-400'}`}>
          {saving ? <div className="w-3 h-3 border-2 border-gray-300 border-t-violet-500 rounded-full animate-spin" /> : saved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Auto-saves'}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Hero Title Size */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Hero Title</label>
            <span className="text-xs text-violet-600 font-semibold">{headingPx[typo.headingSize] ?? 20}px</span>
          </div>
          {/* Live preview */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl px-4 py-3 mb-2.5 overflow-hidden">
            <p className="text-white font-bold leading-tight truncate transition-all duration-200"
              style={{ fontSize: (headingPx[typo.headingSize] ?? 20) }}>
              Environmental Solutions
            </p>
            <p className="text-green-400 font-bold leading-tight truncate"
              style={{ fontSize: (headingPx[typo.headingSize] ?? 20) }}>
              for a Sustainable Bangladesh
            </p>
          </div>
          {/* Size buttons */}
          <div className="flex gap-1.5">
            {SIZES.map(s => (
              <button key={s.key} onClick={() => pick('headingSize', s.key)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  typo.headingSize === s.key
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body Text Size */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Body Text</label>
            <span className="text-xs text-violet-600 font-semibold">{bodyPx[typo.bodySize] ?? 14}px</span>
          </div>
          {/* Preview */}
          <div className="bg-gray-50 rounded-xl px-4 py-2.5 mb-2.5 border border-gray-100">
            <p className="text-gray-600 leading-relaxed transition-all duration-200 line-clamp-2"
              style={{ fontSize: (bodyPx[typo.bodySize] ?? 14) }}>
              Driving climate resilience, GIS research, and eco-innovation for communities across Bangladesh.
            </p>
          </div>
          {/* Size buttons */}
          <div className="flex gap-1.5">
            {BODY_SIZES.map(s => (
              <button key={s.key} onClick={() => pick('bodySize', s.key)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  typo.bodySize === s.key
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
