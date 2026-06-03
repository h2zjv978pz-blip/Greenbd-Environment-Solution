'use client';

import { useState, useEffect } from 'react';
import { Settings, X, Check, Thermometer } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ClockSettings {
  bg:           string;
  showSeconds:  boolean;
  showGreeting: boolean;
  showDate:     boolean;
  showTemp:     boolean;
  tempUnit:     'C' | 'F';
  label:        string;
}

const DEFAULT_SETTINGS: ClockSettings = {
  bg: 'green', showSeconds: true, showGreeting: true,
  showDate: true, showTemp: true, tempUnit: 'C', label: 'BST · Dhaka',
};

const BG_PRESETS: Record<string, { label: string; gradient: string; dot: string }> = {
  green:   { label: 'Forest',  gradient: 'linear-gradient(135deg,#052e16 0%,#14532d 45%,#166534 80%,#15803d 100%)', dot: '#15803d' },
  blue:    { label: 'Ocean',   gradient: 'linear-gradient(135deg,#1e3a8a 0%,#1e40af 50%,#2563eb 100%)',             dot: '#2563eb' },
  purple:  { label: 'Violet',  gradient: 'linear-gradient(135deg,#3b0764 0%,#581c87 50%,#7e22ce 100%)',             dot: '#7e22ce' },
  teal:    { label: 'Teal',    gradient: 'linear-gradient(135deg,#042f2e 0%,#115e59 50%,#0f766e 100%)',             dot: '#0f766e' },
  dark:    { label: 'Slate',   gradient: 'linear-gradient(135deg,#020617 0%,#0f172a 50%,#1e293b 100%)',             dot: '#1e293b' },
  crimson: { label: 'Crimson', gradient: 'linear-gradient(135deg,#450a0a 0%,#991b1b 50%,#b91c1c 100%)',             dot: '#b91c1c' },
};

// ── Clock time helpers ────────────────────────────────────────────────────────
interface Parts {
  h: string; m: string; s: string; ampm: string;
  weekday: string; month: string; day: string; year: string;
  hourN: number;
}

function getBST(date: Date, hour12 = true): Parts {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka', hour12,
    hour: 'numeric', minute: '2-digit', second: '2-digit',
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  }).formatToParts(date);
  const g = (t: string) => p.find(x => x.type === t)?.value ?? '';
  return {
    h: g('hour'), m: g('minute'), s: g('second'), ampm: g('dayPeriod'),
    weekday: g('weekday'), month: g('month'), day: g('day'), year: g('year'),
    hourN: parseInt(g('hour') || '0'),
  };
}

function greeting(h: number) {
  if (h >= 5  && h < 12) return { text: 'Good Morning',   emoji: '🌅' };
  if (h >= 12 && h < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  if (h >= 17 && h < 21) return { text: 'Good Evening',   emoji: '🌆' };
  return                         { text: 'Good Night',     emoji: '🌙' };
}

// ── Toggle component ──────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!on)}
      className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 relative ${on ? 'bg-emerald-500' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

// ── Main dashboard clock ──────────────────────────────────────────────────────
export default function ClockWidget() {
  const [parts,    setParts]    = useState<Parts | null>(null);
  const [blink,    setBlink]    = useState(true);
  const [temp,     setTemp]     = useState<number | null>(null);
  const [wCode,    setWCode]    = useState(0);
  const [editing,  setEditing]  = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [settings, setSettings] = useState<ClockSettings>(DEFAULT_SETTINGS);
  const [draft,    setDraft]    = useState<ClockSettings>(DEFAULT_SETTINGS);

  // Load saved settings from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('greenbd_clock_settings');
      if (raw) { const s = JSON.parse(raw); setSettings(s); setDraft(s); }
    } catch { /* use defaults */ }
  }, []);

  // Clock tick
  useEffect(() => {
    const tick = () => { setParts(getBST(new Date())); setBlink(b => !b); };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Live temperature (Open-Meteo, refreshed every 15 min)
  useEffect(() => {
    const fetchTemp = () =>
      fetch('https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current_weather=true&temperature_unit=celsius')
        .then(r => r.json())
        .then(d => { setTemp(d.current_weather?.temperature ?? null); setWCode(d.current_weather?.weathercode ?? 0); })
        .catch(() => {});
    fetchTemp();
    const id = setInterval(fetchTemp, 15 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const saveSettings = () => {
    setSettings(draft);
    localStorage.setItem('greenbd_clock_settings', JSON.stringify(draft));
    setSaved(true); setTimeout(() => { setSaved(false); setEditing(false); }, 800);
  };

  const cancelEdit = () => { setDraft(settings); setEditing(false); };
  const set = <K extends keyof ClockSettings>(k: K, v: ClockSettings[K]) => setDraft(d => ({ ...d, [k]: v }));

  if (!parts) return <div className="rounded-2xl h-[96px] animate-pulse mb-6" style={{ background: BG_PRESETS[settings.bg]?.gradient }} />;

  const { text, emoji } = greeting(parts.hourN);
  const bg = BG_PRESETS[settings.bg]?.gradient ?? BG_PRESETS.green.gradient;

  const dispTemp = temp !== null
    ? settings.tempUnit === 'F'
      ? `${((temp * 9/5) + 32).toFixed(1)}°F`
      : `${temp.toFixed(1)}°C`
    : null;

  const wx = wCode === 0 ? '☀️' : wCode <= 3 ? '⛅' : wCode <= 55 ? '🌦' : wCode <= 67 ? '🌧' : '⛈';

  return (
    <div className="mb-6">
      {/* ── Clock display ─────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden select-none relative" style={{ background: bg }}>
        {/* Gear button */}
        <button onClick={() => { setDraft(settings); setEditing(e => !e); }}
          className="absolute top-3 right-3 w-7 h-7 bg-white/10 hover:bg-white/25 rounded-lg flex items-center justify-center transition-colors z-10">
          {editing ? <X className="w-3.5 h-3.5 text-white" /> : <Settings className="w-3.5 h-3.5 text-white" />}
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-7 py-5 pr-12">
          {/* Left: greeting + date */}
          <div>
            {settings.showGreeting && (
              <p className="text-green-300 text-xs font-bold uppercase tracking-widest mb-1.5">
                {emoji} {text}
              </p>
            )}
            {settings.showDate && (
              <>
                <h2 className="text-white font-bold leading-tight" style={{ fontSize: 22 }}>
                  {parts.weekday}, {parts.month} {parts.day}
                </h2>
                <p className="text-green-400 text-sm mt-0.5 font-medium">{parts.year}</p>
              </>
            )}
            {settings.showTemp && dispTemp && (
              <p className="text-amber-300 text-sm font-bold mt-1 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5" />{wx} {dispTemp}
              </p>
            )}
          </div>

          <div className="hidden sm:block w-px h-14 bg-white/10 flex-shrink-0" />

          {/* Right: time */}
          <div className="text-right flex-shrink-0">
            <div className="flex items-baseline gap-0.5 justify-end">
              <span className="font-mono text-white font-bold tabular-nums" style={{ fontSize: 40, letterSpacing: -2 }}>{parts.h}</span>
              <span className="font-mono text-green-300 font-bold" style={{ fontSize: 36, opacity: blink ? 1 : 0.2, transition: 'opacity 0.15s' }}>:</span>
              <span className="font-mono text-white font-bold tabular-nums" style={{ fontSize: 40, letterSpacing: -2 }}>{parts.m}</span>
              {settings.showSeconds && (
                <>
                  <span className="font-mono text-green-300 font-bold" style={{ fontSize: 36, opacity: blink ? 1 : 0.2, transition: 'opacity 0.15s' }}>:</span>
                  <span className="font-mono text-white/70 font-bold tabular-nums" style={{ fontSize: 28, letterSpacing: -1 }}>{parts.s}</span>
                </>
              )}
              <span className="font-mono text-green-300 font-bold ml-2 text-lg">{parts.ampm}</span>
            </div>
            <p className="text-green-400 text-[11px] font-semibold mt-0.5 tracking-wide">{settings.label}</p>
          </div>
        </div>
      </div>

      {/* ── Settings panel ────────────────────────────────────────── */}
      {editing && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg mt-2 p-5 space-y-4"
          style={{ animation: 'slideDown 0.18s ease-out' }}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-800">Clock Widget Settings</p>
            <div className="flex gap-2">
              <button onClick={cancelEdit} className="px-3 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold">Cancel</button>
              <button onClick={saveSettings}
                className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold flex items-center gap-1 transition-colors">
                {saved ? <><Check className="w-3 h-3" /> Saved!</> : 'Save'}
              </button>
            </div>
          </div>

          {/* Background */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Background</p>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(BG_PRESETS).map(([key, { label, gradient, dot }]) => (
                <button key={key} onClick={() => set('bg', key)}
                  title={label}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${draft.bg === key ? 'border-gray-800 scale-110 shadow-md' : 'border-transparent'}`}
                  style={{ background: gradient }}>
                  {draft.bg === key && <span className="flex items-center justify-center h-full"><Check className="w-3 h-3 text-white drop-shadow" /></span>}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'showGreeting', label: 'Greeting (Good Morning…)' },
              { key: 'showDate',     label: 'Show Date' },
              { key: 'showSeconds',  label: 'Show Seconds' },
              { key: 'showTemp',     label: 'Show Temperature' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                <span className="text-xs font-semibold text-gray-700">{label}</span>
                <Toggle on={!!(draft as unknown as Record<string,unknown>)[key]}
                  onChange={v => set(key as keyof ClockSettings, v as never)} />
              </div>
            ))}
          </div>

          {/* Temperature unit */}
          {draft.showTemp && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Temperature Unit</p>
              <div className="flex gap-2">
                {(['C', 'F'] as const).map(u => (
                  <button key={u} onClick={() => set('tempUnit', u)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${draft.tempUnit === u ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
                    °{u}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Label */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Location Label</p>
            <input value={draft.label} onChange={e => set('label', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
              placeholder="e.g. BST · Dhaka" />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity:0; transform: translateY(-8px); }
          to   { opacity:1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Compact sidebar clock ─────────────────────────────────────────────────────
export function SidebarClock() {
  const [parts, setParts] = useState<Parts | null>(null);
  const [blink, setBlink]  = useState(true);

  useEffect(() => {
    const tick = () => { setParts(getBST(new Date())); setBlink(b => !b); };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!parts) return null;

  return (
    <div className="text-center px-3 py-3 border-t border-white/10">
      <div className="font-mono font-bold text-white tabular-nums tracking-tight" style={{ fontSize: 22 }}>
        {parts.h}
        <span style={{ opacity: blink ? 1 : 0.25, transition: 'opacity 0.15s' }}>:</span>
        {parts.m}
        <span style={{ opacity: blink ? 1 : 0.25, transition: 'opacity 0.15s' }}>:</span>
        <span className="text-white/50 text-base">{parts.s}</span>
        <span className="text-green-300 text-xs ml-1">{parts.ampm}</span>
      </div>
      <p className="text-white/50 text-[10px] mt-0.5 font-medium">
        {parts.month} {parts.day}, {parts.year}
      </p>
      <span className="inline-block mt-1 text-[9px] bg-green-500/20 text-green-400 font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
        BST · UTC+6
      </span>
    </div>
  );
}
