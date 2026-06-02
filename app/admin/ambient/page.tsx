'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Music2, Save, Check, Play, Square,
  Volume2, RefreshCw, Plus, Trash2, HardDrive,
} from 'lucide-react';
import AudioUpload from '@/components/admin/AudioUpload';

// ── Types ─────────────────────────────────────────────────────────────────────
interface SoundConfig {
  id: string; emoji: string; label: string; desc: string;
  enabled: boolean; audioFile?: string;
}
interface AmbientConfig {
  enabled: boolean; defaultSound: string; defaultVolume: number;
  autoPlay: boolean; sounds: SoundConfig[];
}

// ── Web Audio engine (inline so admin can preview) ────────────────────────────
class AmbientEngine {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ctx: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private master: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private source: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private lfos: any[] = [];

  private getCtx() {
    if (!this.ctx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }
  private white(sec = 4) {
    const c = this.getCtx(), b = c.createBuffer(2, c.sampleRate * sec, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    return b;
  }
  private pink(sec = 4) {
    const c = this.getCtx(), b = c.createBuffer(2, c.sampleRate * sec, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
      for (let i = 0; i < d.length; i++) {
        const w = Math.random()*2-1; b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
        b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856; b4=0.55000*b4+w*0.5329522;
        b5=-0.7616*b5-w*0.0168980; d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11; b6=w*0.115926;
      }
    }
    return b;
  }
  play(id: string, vol: number) {
    this.stop();
    const c = this.getCtx(); this.master.gain.setTargetAtTime(vol, c.currentTime, 0.4);
    const src = c.createBufferSource(); src.loop = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chain: any = src;
    const connect = (n: any) => { chain.connect(n); chain = n; };
    if (id === 'rain')   { src.buffer=this.white(); const hp=c.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=400; const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2000; bp.Q.value=0.6; connect(hp); connect(bp); }
    else if (id==='ocean')  { src.buffer=this.white(6); const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=700; lp.Q.value=1.2; connect(lp); const o=c.createOscillator(); const g=c.createGain(); o.frequency.value=0.09; g.gain.value=320; o.connect(g); g.connect(lp.frequency); o.start(); this.lfos.push(o); }
    else if (id==='forest') { src.buffer=this.pink();  const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1200; bp.Q.value=0.25; connect(bp); }
    else if (id==='wind')   { src.buffer=this.pink(6); const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=700; connect(lp); const o=c.createOscillator(); const g=c.createGain(); o.frequency.value=0.04; g.gain.value=450; o.connect(g); g.connect(lp.frequency); o.start(); this.lfos.push(o); }
    else { src.buffer=this.pink(); const hp=c.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=1000; const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=3500; bp.Q.value=0.4; connect(hp); connect(bp); }
    chain.connect(this.master); src.start();
    this.source = src;
    if (c.state === 'suspended') c.resume();
  }
  stop() {
    this.lfos.forEach(o => { try { o.stop(); } catch { /* */ } }); this.lfos = [];
    if (this.source) { try { this.source.stop(); } catch { /* */ } this.source = null; }
  }
  setVolume(v: number) { if (this.master && this.ctx) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.15); }
  destroy() { this.stop(); if (this.ctx) { this.ctx.close(); this.ctx = null; } }
}

// ── Default fallback ──────────────────────────────────────────────────────────
const DEFAULT: AmbientConfig = {
  enabled: true, defaultSound: 'rain', defaultVolume: 0.45, autoPlay: false,
  sounds: [
    { id:'rain',   emoji:'🌧', label:'Rain',   desc:'Gentle rainfall',  enabled:true, audioFile:'' },
    { id:'ocean',  emoji:'🌊', label:'Ocean',  desc:'Ocean waves',      enabled:true, audioFile:'' },
    { id:'forest', emoji:'🌿', label:'Forest', desc:'Forest ambience',  enabled:true, audioFile:'' },
    { id:'wind',   emoji:'🍃', label:'Wind',   desc:'Gentle breeze',    enabled:true, audioFile:'' },
    { id:'birds',  emoji:'🐦', label:'Birds',  desc:'Morning birdsong', enabled:true, audioFile:'' },
  ],
};

// ── Toggle component ──────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!on)}
      className={`w-10 h-5.5 rounded-full flex items-center transition-colors flex-shrink-0 ${on ? 'bg-emerald-500' : 'bg-gray-200'}`}
      style={{ padding: '2px' }}>
      <span className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AmbientDashboard() {
  const [cfg,       setCfg]       = useState<AmbientConfig>(DEFAULT);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [previewing,setPreviewing]= useState<string | null>(null);
  const [previewVol,setPreviewVol]= useState(0.45);
  const engine = useRef<AmbientEngine | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    fetch('/api/ambient').then(r => r.json()).then((d: AmbientConfig) => setCfg(d)).catch(() => {});
    engine.current = new AmbientEngine();
    return () => { engine.current?.destroy(); };
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/ambient', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg),
    });
    setSaving(false); setSaved(true);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2500);
  };

  const updateSound = useCallback((id: string, patch: Partial<SoundConfig>) => {
    setCfg(c => ({ ...c, sounds: c.sounds.map(s => s.id === id ? { ...s, ...patch } : s) }));
  }, []);

  // Preview — use uploaded file if available, else generated sound
  const togglePreview = async (id: string) => {
    if (previewing === id) {
      engine.current?.stop(); setPreviewing(null); return;
    }
    const sound = cfg.sounds.find(s => s.id === id);
    if (sound?.audioFile) {
      // Play uploaded audio via Web Audio
      engine.current?.stop();
      const ctx = (engine.current as any)?.getCtx();
      if (ctx) {
        const master = (engine.current as any)?.master;
        master?.gain.setTargetAtTime(previewVol, ctx.currentTime, 0.3);
        try {
          const buf  = await fetch(sound.audioFile).then(r => r.arrayBuffer());
          const abuf = await ctx.decodeAudioData(buf);
          const src  = ctx.createBufferSource();
          src.buffer = abuf; src.loop = true;
          src.connect(master); src.start();
          (engine.current as any).source = src;
          if (ctx.state === 'suspended') ctx.resume();
        } catch { engine.current?.play(id, previewVol); }
      }
    } else {
      engine.current?.play(id, previewVol);
    }
    setPreviewing(id);
  };

  const addCustomSound = () => {
    const id = `custom_${Date.now()}`;
    setCfg(c => ({
      ...c,
      sounds: [...c.sounds, { id, emoji: '🎵', label: 'Custom Sound', desc: 'My custom sound', enabled: true, audioFile: '' }],
    }));
  };

  const deleteSound = (id: string) => {
    engine.current?.stop(); if (previewing === id) setPreviewing(null);
    setCfg(c => ({ ...c, sounds: c.sounds.filter(s => s.id !== id) }));
  };

  const onPreviewVol = (v: number) => {
    setPreviewVol(v);
    if (previewing) engine.current?.setVolume(v);
  };

  const reset = () => { setCfg(DEFAULT); engine.current?.stop(); setPreviewing(null); };

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#052e16,#166534)' }}>
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Ambient Music</h1>
            <p className="text-xs text-gray-400 mt-0.5">Configure the floating ambient sound player</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-500 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-all shadow-sm disabled:opacity-60">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">

        {/* ── Left: Global Settings ────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Player switch */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-sm font-bold text-gray-800">Enable Player</p>
                <p className="text-xs text-gray-400 mt-0.5">Show the floating music widget on the website</p>
              </div>
              <Toggle on={cfg.enabled} onChange={v => setCfg(c => ({ ...c, enabled: v }))} />
            </div>
          </div>

          {/* Defaults */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Defaults</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Default Sound</label>
              <select value={cfg.defaultSound} onChange={e => setCfg(c => ({ ...c, defaultSound: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400">
                {cfg.sounds.filter(s => s.enabled).map(s => (
                  <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Default Volume <span className="text-emerald-600 font-bold ml-1">{Math.round(cfg.defaultVolume * 100)}%</span>
              </label>
              <input type="range" min="0" max="1" step="0.01" value={cfg.defaultVolume}
                onChange={e => setCfg(c => ({ ...c, defaultVolume: Number(e.target.value) }))}
                className="w-full" style={{ accentColor: '#166534' }} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Auto-play on Load</p>
                <p className="text-xs text-gray-400">Start playing when visitor opens the site</p>
              </div>
              <Toggle on={cfg.autoPlay} onChange={v => setCfg(c => ({ ...c, autoPlay: v }))} />
            </div>
          </div>

          {/* Preview volume */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Preview Volume</h3>
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input type="range" min="0" max="1" step="0.02" value={previewVol}
                onChange={e => onPreviewVol(Number(e.target.value))}
                className="flex-1" style={{ accentColor: '#166534' }} />
              <span className="text-xs text-gray-500 w-8 text-right tabular-nums">{Math.round(previewVol * 100)}%</span>
            </div>
            {previewing && (
              <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Previewing: {cfg.sounds.find(s => s.id === previewing)?.emoji} {cfg.sounds.find(s => s.id === previewing)?.label}
              </p>
            )}
          </div>
        </div>

        {/* ── Right: Sound Library ─────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sound Library</h2>
            <button onClick={addCustomSound}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Custom Sound
            </button>
          </div>

          {cfg.sounds.map(sound => {
            const isCustom = sound.id.startsWith('custom_');
            return (
              <div key={sound.id}
                className={`bg-white rounded-2xl border shadow-sm transition-all overflow-hidden ${sound.enabled ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
                <div className="flex items-stretch">

                  {/* Emoji + colour strip */}
                  <div className="w-16 flex-shrink-0 flex flex-col items-center justify-center gap-1 py-4"
                    style={{ background: sound.enabled ? 'linear-gradient(135deg,#052e16,#166534)' : '#f3f4f6' }}>
                    <span className="text-3xl leading-none">{sound.emoji}</span>
                    <span className="text-[9px] font-bold tracking-wide uppercase truncate max-w-[56px] text-center"
                      style={{ color: sound.enabled ? 'rgba(255,255,255,0.7)' : '#9ca3af' }}>
                      {isCustom ? 'custom' : sound.id}
                    </span>
                  </div>

                  {/* Fields */}
                  <div className="flex-1 px-4 py-3 space-y-2.5">

                    {/* Row 1: Emoji + Label + Toggle + Delete */}
                    <div className="flex items-center gap-3">
                      <div className="w-16 flex-shrink-0">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Emoji</label>
                        <input value={sound.emoji} onChange={e => updateSound(sound.id, { emoji: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-center text-lg focus:outline-none focus:border-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Label</label>
                        <input value={sound.label} onChange={e => updateSound(sound.id, { label: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:border-emerald-400" />
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-4">
                        <Toggle on={sound.enabled} onChange={v => updateSound(sound.id, { enabled: v })} />
                        <span className="text-[9px] text-gray-400 font-medium">{sound.enabled ? 'On' : 'Off'}</span>
                      </div>
                      {isCustom && (
                        <button onClick={() => deleteSound(sound.id)}
                          className="flex-shrink-0 w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors mt-3">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Row 2: Description + Preview */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Description</label>
                      <div className="flex gap-2">
                        <input value={sound.desc} onChange={e => updateSound(sound.id, { desc: e.target.value })}
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:border-emerald-400" />
                        <button onClick={() => togglePreview(sound.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                            previewing === sound.id ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}>
                          {previewing === sound.id
                            ? <><Square className="w-3 h-3 fill-white" /> Stop</>
                            : <><Play  className="w-3 h-3 fill-white" /> Preview</>}
                        </button>
                      </div>
                    </div>

                    {/* Row 3: Audio file upload */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <HardDrive className="w-3 h-3" /> Audio File
                        <span className="text-gray-300 font-normal normal-case tracking-normal ml-1">
                          {sound.audioFile ? '— uploaded file will be used' : '— leave blank to use generated sound'}
                        </span>
                      </label>
                      <AudioUpload
                        value={sound.audioFile || undefined}
                        onChange={(url) => updateSound(sound.id, { audioFile: url ?? '' })}
                      />
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
