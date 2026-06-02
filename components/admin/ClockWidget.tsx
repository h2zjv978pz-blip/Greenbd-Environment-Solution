'use client';

import { useState, useEffect } from 'react';

interface Parts {
  h: string; m: string; s: string; ampm: string;
  weekday: string; month: string; day: string; year: string;
  hourN: number;
}

function getBST(date: Date): Parts {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka', hour12: true,
    hour: 'numeric', minute: '2-digit', second: '2-digit',
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  }).formatToParts(date);
  const g = (t: string) => p.find(x => x.type === t)?.value ?? '';
  return {
    h: g('hour'), m: g('minute'), s: g('second'), ampm: g('dayPeriod'),
    weekday: g('weekday'), month: g('month'), day: g('day'), year: g('year'),
    hourN: parseInt(g('hour')),
  };
}

function greeting(h: number) {
  if (h >= 5  && h < 12) return { text: 'Good Morning',   emoji: '🌅' };
  if (h >= 12 && h < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  if (h >= 17 && h < 21) return { text: 'Good Evening',   emoji: '🌆' };
  return                         { text: 'Good Night',     emoji: '🌙' };
}

// ── Full dashboard widget ─────────────────────────────────────────────────────
export default function ClockWidget() {
  const [parts, setParts] = useState<Parts | null>(null);
  const [blink, setBlink]  = useState(true);

  useEffect(() => {
    const tick = () => { setParts(getBST(new Date())); setBlink(b => !b); };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!parts) return (
    <div className="rounded-2xl bg-gradient-to-r from-emerald-950 to-emerald-800 h-[96px] animate-pulse mb-6" />
  );

  const { text, emoji } = greeting(parts.hourN);

  return (
    <div className="rounded-2xl mb-6 overflow-hidden select-none"
      style={{ background: 'linear-gradient(135deg,#052e16 0%,#14532d 45%,#166534 80%,#15803d 100%)' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-7 py-5">

        {/* ── Left: greeting + date ──────────────────────────────── */}
        <div>
          <p className="text-green-300 text-xs font-bold uppercase tracking-widest mb-1.5">
            {emoji} {text}
          </p>
          <h2 className="text-white font-bold leading-tight" style={{ fontSize: 22 }}>
            {parts.weekday}, {parts.month} {parts.day}
          </h2>
          <p className="text-green-400 text-sm mt-0.5 font-medium">{parts.year}</p>
        </div>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div className="hidden sm:block w-px h-14 bg-white/10 flex-shrink-0" />

        {/* ── Right: digital clock ────────────────────────────────── */}
        <div className="text-right flex-shrink-0">
          {/* Time digits */}
          <div className="flex items-baseline gap-0.5 justify-end">
            <span className="font-mono text-white font-bold tabular-nums" style={{ fontSize: 40, letterSpacing: -2 }}>
              {parts.h}
            </span>
            <span className="font-mono text-green-300 font-bold" style={{ fontSize: 36, opacity: blink ? 1 : 0.2, transition: 'opacity 0.15s' }}>:</span>
            <span className="font-mono text-white font-bold tabular-nums" style={{ fontSize: 40, letterSpacing: -2 }}>
              {parts.m}
            </span>
            <span className="font-mono text-green-300 font-bold" style={{ fontSize: 36, opacity: blink ? 1 : 0.2, transition: 'opacity 0.15s' }}>:</span>
            <span className="font-mono text-white/70 font-bold tabular-nums" style={{ fontSize: 28, letterSpacing: -1 }}>
              {parts.s}
            </span>
            <span className="font-mono text-green-300 font-bold ml-2 text-lg">{parts.ampm}</span>
          </div>
          {/* Timezone */}
          <p className="text-green-400 text-[11px] font-semibold mt-0.5 tracking-wide">
            Bangladesh Standard Time · UTC+6
          </p>
        </div>
      </div>
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
      {/* Time */}
      <div className="font-mono font-bold text-white tabular-nums tracking-tight" style={{ fontSize: 22 }}>
        {parts.h}
        <span style={{ opacity: blink ? 1 : 0.25, transition: 'opacity 0.15s' }}>:</span>
        {parts.m}
        <span style={{ opacity: blink ? 1 : 0.25, transition: 'opacity 0.15s' }}>:</span>
        <span className="text-white/50 text-base">{parts.s}</span>
        <span className="text-green-300 text-xs ml-1">{parts.ampm}</span>
      </div>
      {/* Date */}
      <p className="text-white/50 text-[10px] mt-0.5 font-medium">
        {parts.month} {parts.day}, {parts.year}
      </p>
      {/* Badge */}
      <span className="inline-block mt-1 text-[9px] bg-green-500/20 text-green-400 font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
        BST · UTC+6
      </span>
    </div>
  );
}
