'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Music2, X, Play, Pause, Volume2, VolumeX } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type SoundId = 'rain' | 'ocean' | 'forest' | 'wind' | 'birds';

interface SoundCfg { id: string; emoji: string; label: string; desc: string; enabled: boolean; audioFile?: string }
interface AmbientCfg {
  enabled: boolean; defaultSound: string; defaultVolume: number;
  autoPlay: boolean; sounds: SoundCfg[];
}

const FALLBACK_SOUNDS: SoundCfg[] = [
  { id: 'rain',   emoji: '🌧', label: 'Rain',   desc: 'Gentle rainfall',  enabled: true },
  { id: 'ocean',  emoji: '🌊', label: 'Ocean',  desc: 'Ocean waves',      enabled: true },
  { id: 'forest', emoji: '🌿', label: 'Forest', desc: 'Forest ambience',  enabled: true },
  { id: 'wind',   emoji: '🍃', label: 'Wind',   desc: 'Gentle breeze',    enabled: true },
  { id: 'birds',  emoji: '🐦', label: 'Birds',  desc: 'Morning birdsong', enabled: true },
];

// ── Web Audio ambient sound engine ────────────────────────────────────────────
class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private source: AudioBufferSourceNode | null = null;
  private lfos: OscillatorNode[] = [];

  private getCtx() {
    if (!this.ctx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private whiteNoise(seconds = 4): AudioBuffer {
    const ctx = this.getCtx();
    const buf = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return buf;
  }

  private pinkNoise(seconds = 4): AudioBuffer {
    const ctx = this.getCtx();
    const buf = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
      for (let i = 0; i < d.length; i++) {
        const w = Math.random() * 2 - 1;
        b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
        b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
        b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
        d[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11; b6=w*0.115926;
      }
    }
    return buf;
  }

  private makeLFO(freq: number, depth: number, target: AudioParam): OscillatorNode {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq;
    g.gain.value = depth;
    osc.connect(g); g.connect(target);
    osc.start();
    return osc;
  }

  play(id: SoundId, vol: number) {
    this.stop();
    const ctx  = this.getCtx();
    const master = this.master!;
    master.gain.setTargetAtTime(vol, ctx.currentTime, 0.4);

    const src = ctx.createBufferSource();
    src.loop = true;

    let chain: AudioNode = src;

    const connect = (node: AudioNode) => { chain.connect(node); chain = node; };

    switch (id) {
      case 'rain': {
        src.buffer = this.whiteNoise();
        const hp = ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=400;
        const bp = ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2000; bp.Q.value=0.6;
        connect(hp); connect(bp);
        break;
      }
      case 'ocean': {
        src.buffer = this.whiteNoise(6);
        const lp = ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=700; lp.Q.value=1.2;
        connect(lp);
        this.lfos.push(this.makeLFO(0.09, 320, lp.frequency));
        break;
      }
      case 'forest': {
        src.buffer = this.pinkNoise();
        const bp = ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1200; bp.Q.value=0.25;
        connect(bp);
        break;
      }
      case 'wind': {
        src.buffer = this.pinkNoise(6);
        const lp = ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=700;
        connect(lp);
        this.lfos.push(this.makeLFO(0.04, 450, lp.frequency));
        break;
      }
      case 'birds': {
        src.buffer = this.pinkNoise();
        const hp = ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=1000;
        const bp = ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=3500; bp.Q.value=0.4;
        connect(hp); connect(bp);
        break;
      }
    }

    chain.connect(master);
    src.start();
    this.source = src;
    if (ctx.state === 'suspended') ctx.resume();
  }

  stop() {
    this.lfos.forEach(o => { try { o.stop(); } catch { /* ignore */ } });
    this.lfos = [];
    if (this.source) { try { this.source.stop(); } catch { /* ignore */ } this.source = null; }
  }

  setVolume(v: number) {
    const ctx = this.getCtx();
    this.master?.gain.setTargetAtTime(v, ctx.currentTime, 0.15);
  }

  destroy() {
    this.stop();
    if (this.ctx) { this.ctx.close(); this.ctx = null; }
  }
}

// ── React component ───────────────────────────────────────────────────────────
export default function AmbientPlayer() {
  const [cfg,     setCfg]     = useState<AmbientCfg | null>(null);
  const [open,    setOpen]    = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sound,   setSound]   = useState<SoundId>('rain');
  const [volume,  setVolume]  = useState(0.45);
  const [muted,   setMuted]   = useState(false);
  const engine = useRef<AmbientEngine | null>(null);

  // Fetch admin settings
  useEffect(() => {
    fetch('/api/ambient')
      .then(r => r.json())
      .then((d: AmbientCfg) => {
        setCfg(d);
        const saved = localStorage.getItem('greenbd_ambient');
        if (saved) {
          try { const p = JSON.parse(saved); setSound(p.sound ?? d.defaultSound as SoundId); setVolume(p.volume ?? d.defaultVolume); return; } catch {}
        }
        setSound(d.defaultSound as SoundId);
        setVolume(d.defaultVolume);
      })
      .catch(() => {
        const saved = localStorage.getItem('greenbd_ambient');
        if (saved) try { const p = JSON.parse(saved); setSound(p.sound ?? 'rain'); setVolume(p.volume ?? 0.45); } catch {}
      });
  }, []);

  const save = useCallback((s: SoundId, v: number) => {
    localStorage.setItem('greenbd_ambient', JSON.stringify({ sound: s, volume: v }));
  }, []);

  // Init engine once
  useEffect(() => {
    engine.current = new AmbientEngine();
    return () => { engine.current?.destroy(); };
  }, []);

  // Respect admin enable/disable
  if (cfg && !cfg.enabled) return null;

  // Start sound — use uploaded audioFile if set, else generated
  const startSound = async (id: SoundId, vol: number) => {
    const soundCfg = activeSounds.find(s => s.id === id);
    if (soundCfg?.audioFile) {
      engine.current?.stop();
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eng = engine.current as any;
        const ctx = eng.getCtx();
        eng.master.gain.setTargetAtTime(vol, ctx.currentTime, 0.4);
        const buf  = await fetch(soundCfg.audioFile).then(r => r.arrayBuffer());
        const abuf = await ctx.decodeAudioData(buf);
        const src  = ctx.createBufferSource();
        src.buffer = abuf; src.loop = true;
        src.connect(eng.master); src.start();
        eng.source = src;
        if (ctx.state === 'suspended') ctx.resume();
      } catch { engine.current?.play(id, vol); }
    } else {
      engine.current?.play(id, vol);
    }
  };

  const togglePlay = () => {
    if (!engine.current) return;
    if (playing) {
      engine.current.stop();
      setPlaying(false);
    } else {
      startSound(sound, muted ? 0 : volume);
      setPlaying(true);
    }
  };

  const switchSound = (id: SoundId) => {
    setSound(id);
    save(id, volume);
    if (playing) startSound(id, muted ? 0 : volume);
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    setMuted(false);
    save(sound, v);
    if (playing) engine.current?.setVolume(v);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (playing) engine.current?.setVolume(next ? 0 : volume);
  };

  const activeSounds = (cfg?.sounds ?? FALLBACK_SOUNDS).filter(s => s.enabled);
  const current = activeSounds.find(s => s.id === sound) ?? activeSounds[0];;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Expanded panel ──────────────────────────────────────────── */}
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ animation: 'slideUp 0.2s ease-out', width: 'min(288px, calc(100vw - 2rem))' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
            style={{ background: 'linear-gradient(135deg,#052e16,#166534)' }}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full bg-white/20 flex items-center justify-center ${playing ? 'animate-pulse' : ''}`}>
                <Music2 className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-white text-xs font-bold leading-tight">Ambient Sounds</p>
                <p className="text-green-300 text-[10px]">{playing ? `▶ ${current.label}` : 'Paused'}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <X className="w-3 h-3 text-white" />
            </button>
          </div>

          {/* Sound buttons */}
          <div className="p-3 grid grid-cols-5 gap-1.5">
            {activeSounds.map(s => (
              <button key={s.id} onClick={() => switchSound(s.id as SoundId)} title={s.desc}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-center transition-all ${
                  sound === s.id
                    ? 'bg-primary-600 border-primary-600 shadow-sm'
                    : 'bg-gray-50 border-gray-200 hover:bg-primary-50 hover:border-primary-200'
                }`}>
                <span className="text-lg leading-none">{s.emoji}</span>
                <span className={`text-[9px] font-bold leading-none ${sound === s.id ? 'text-white' : 'text-gray-500'}`}>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Play controls + volume */}
          <div className="px-4 pb-4 space-y-3">
            {/* Play / Pause */}
            <button onClick={togglePlay}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                playing
                  ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}>
              {playing ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4 fill-white" /> Play</>}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0">
                {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input type="range" min="0" max="1" step="0.02" value={muted ? 0 : volume}
                onChange={e => changeVolume(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#166534' }} />
              <span className="text-[10px] text-gray-400 w-8 text-right tabular-nums font-medium">
                {muted ? '0%' : Math.round(volume * 100) + '%'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Toggle button ────────────────────────────────────────────── */}
      <button onClick={() => setOpen(o => !o)}
        title={open ? 'Close ambient player' : 'Ambient nature sounds'}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
          playing ? 'ring-2 ring-green-400 ring-offset-2' : ''
        }`}
        style={{ background: 'linear-gradient(135deg,#052e16,#166534)' }}>
        {/* Animated rings when playing */}
        {playing && (
          <>
            <span className="absolute w-12 h-12 rounded-full bg-green-500/20 animate-ping" />
            <span className="absolute w-16 h-16 rounded-full bg-green-500/10 animate-ping" style={{ animationDelay: '0.3s' }} />
          </>
        )}
        <Music2 className={`w-5 h-5 text-white relative z-10 ${playing ? 'animate-pulse' : ''}`} />
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}
