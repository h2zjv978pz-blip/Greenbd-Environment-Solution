'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 15, suffix: '+', label: 'Years of Experience', desc: 'Delivering environmental excellence since 2009' },
  { value: 200, suffix: '+', label: 'Projects Completed', desc: 'Across Bangladesh and South Asia' },
  { value: 95, suffix: '', label: 'Client Satisfaction', desc: 'Based on post-project evaluations' },
  { value: 50, suffix: '+', label: 'Expert Team Members', desc: 'Ecologists, GIS analysts & climate scientists' },
];

function useCounter(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, inView, duration]);
  return count;
}

function StatCard({ value, suffix, label, desc, inView }: {
  value: number; suffix: string; label: string; desc: string; inView: boolean;
}) {
  const count = useCounter(value, inView);
  return (
    <div className="text-center group">
      <div className="text-5xl md:text-6xl font-bold font-heading text-white mb-2 tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-green-300 font-semibold text-lg mb-1 group-hover:text-white transition-colors">{label}</div>
      <p className="text-white/60 text-sm">{desc}</p>
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 70%, #15803d 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full border border-white/5 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full border border-white/5 translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <p className="text-green-400 font-semibold text-sm uppercase tracking-widest mb-3">Impact by the Numbers</p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">
            Our Environmental Impact
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
