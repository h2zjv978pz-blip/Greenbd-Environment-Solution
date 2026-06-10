'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Save, Check, Smartphone, Info } from 'lucide-react';

interface ImageSettings {
  mobileEnhance: boolean;
  sharpenLevel: 'off' | 'light' | 'medium' | 'strong';
}

const DEFAULT: ImageSettings = { mobileEnhance: true, sharpenLevel: 'medium' };

const LEVELS: { id: ImageSettings['sharpenLevel']; label: string; desc: string }[] = [
  { id: 'off',    label: 'Off',    desc: 'Save photos exactly as uploaded' },
  { id: 'light',  label: 'Light',  desc: 'Subtle clarity boost, minimal effect' },
  { id: 'medium', label: 'Medium', desc: 'Recommended — noticeably crisper on phone screens' },
  { id: 'strong', label: 'Strong', desc: 'Maximum sharpness, best for low-resolution diagrams/maps' },
];

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!on)}
      className={`w-10 h-5.5 rounded-full flex items-center transition-colors flex-shrink-0 ${on ? 'bg-emerald-500' : 'bg-gray-200'}`}
      style={{ padding: '2px' }}>
      <span className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export default function ImageQualityAdmin() {
  const [cfg, setCfg]     = useState<ImageSettings>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    fetch('/api/content/imageSettings').then(r => r.json()).then((d: ImageSettings) => setCfg({ ...DEFAULT, ...d })).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/content/imageSettings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg),
    });
    setSaving(false); setSaved(true);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#052e16,#166534)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Image Quality</h1>
            <p className="text-xs text-gray-400 mt-0.5">Mobile photo enhancement for newly uploaded images</p>
          </div>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-all shadow-sm disabled:opacity-60">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
           : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="max-w-2xl space-y-4">

        {/* Toggle */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-4.5 h-4.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Mobile Enhancement</p>
                <p className="text-xs text-gray-400 mt-0.5">Sharpen photos on upload so they look clearer on phone screens</p>
              </div>
            </div>
            <Toggle on={cfg.mobileEnhance} onChange={v => setCfg(c => ({ ...c, mobileEnhance: v }))} />
          </div>
        </div>

        {/* Sharpen level */}
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-opacity ${cfg.mobileEnhance ? '' : 'opacity-50 pointer-events-none'}`}>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sharpening Level</h3>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {LEVELS.map(l => (
              <button key={l.id} type="button" onClick={() => setCfg(c => ({ ...c, sharpenLevel: l.id }))}
                className={`text-left rounded-xl border-2 p-3 transition-colors ${
                  cfg.sharpenLevel === l.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-gray-200'
                }`}>
                <p className="text-sm font-bold text-gray-800">{l.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{l.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 leading-relaxed">
            <p>This applies a sharpening filter to <strong>newly uploaded</strong> images only — it does not change photos already on the site.</p>
            <p className="mt-1.5">For best results on mobile, upload source images at <strong>3000 × 1875px</strong> or higher. Sharpening can improve clarity but cannot add detail that isn&apos;t in the original photo.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
