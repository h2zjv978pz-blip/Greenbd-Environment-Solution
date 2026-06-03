'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Globe, Leaf, Shield } from 'lucide-react';
import type { HeroSlide } from '@/lib/getData';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import t from '@/lib/i18n/translations';

// ── Hero clock + weather widget ───────────────────────────────────────────────
function HeroClock() {
  const [time,  setTime]  = useState('');
  const [secs,  setSecs]  = useState('');
  const [ampm,  setAmpm]  = useState('');
  const [date,  setDate]  = useState('');
  const [blink, setBlink] = useState(true);
  const [temp,  setTemp]  = useState<number | null>(null);
  const [wCode, setWCode] = useState(0);

  // Live temperature — Open-Meteo (free, no key) for Dhaka
  useEffect(() => {
    const fetchWeather = () =>
      fetch('https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current_weather=true&temperature_unit=celsius')
        .then(r => r.json())
        .then(d => { setTemp(d.current_weather?.temperature ?? null); setWCode(d.current_weather?.weathercode ?? 0); })
        .catch(() => {});
    fetchWeather();
    const id = setInterval(fetchWeather, 15 * 60 * 1000); // refresh every 15 min
    return () => clearInterval(id);
  }, []);

  // Clock tick
  useEffect(() => {
    const tick = () => {
      const p = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka', hour12: true,
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        month: 'short', day: 'numeric', year: 'numeric',
      }).formatToParts(new Date());
      const g = (t: string) => p.find(x => x.type === t)?.value ?? '';
      setTime(`${g('hour')}:${g('minute')}`);
      setSecs(g('second'));
      setAmpm(g('dayPeriod'));
      setDate(`${g('month')} ${g('day')}, ${g('year')}`);
      setBlink(b => !b);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  // Simple weather icon from WMO code
  const wx = wCode === 0 ? '☀️' : wCode <= 3 ? '⛅' : wCode <= 55 ? '🌦' : wCode <= 67 ? '🌧' : '⛈';

  return (
    <div className="absolute top-20 sm:top-24 left-3 sm:left-5 md:left-9 z-20 select-none hidden xs:block sm:block">
      <div className="rounded-xl px-3 py-2 border border-white/10 shadow-lg"
        style={{ background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)' }}>

        {/* Single row: Time · Date · Temperature */}
        <div className="flex items-center gap-2 leading-none">
          {/* Time */}
          <div className="flex items-baseline gap-0.5">
            <span className="font-mono font-bold text-white tabular-nums" style={{ fontSize: 20, letterSpacing: -0.5 }}>{time}</span>
            <span className="font-mono text-white/40 tabular-nums ml-0.5" style={{ fontSize: 12, opacity: blink ? 0.6 : 0.15, transition: 'opacity 0.12s' }}>{secs}</span>
            <span className="text-white/50 font-semibold ml-1" style={{ fontSize: 10 }}>{ampm}</span>
          </div>

          <span className="text-white/20" style={{ fontSize: 12 }}>|</span>

          {/* Date */}
          <span className="text-white/55 font-medium tabular-nums" style={{ fontSize: 10 }}>{date}</span>

          {/* Temperature */}
          {temp !== null && (<>
            <span className="text-white/20" style={{ fontSize: 12 }}>|</span>
            <span className="text-amber-300/90 font-bold" style={{ fontSize: 11 }}>{wx} {temp.toFixed(1)}°C</span>
          </>)}
        </div>

      </div>
    </div>
  );
}

export default function Hero({ slides }: { slides: HeroSlide[] }) {
  const { lang } = useLanguage();
  const tr = t[lang].hero;
  const banglaFont = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const badges = [
    { icon: Leaf,   label: tr.badge1 },
    { icon: Globe,  label: tr.badge2 },
    { icon: Shield, label: tr.badge3 },
  ];

  const [current, setCurrent] = useState(0);
  const [fade,    setFade]    = useState(true);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => { setCurrent((p) => (p + 1) % slides.length); setFade(true); }, 500);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current] ?? slides[0];
  if (!slide) return null;

  const title    = (lang === 'bn' && slide.title_bn)    ? slide.title_bn    : slide.title;
  const subtitle = (lang === 'bn' && slide.subtitle_bn) ? slide.subtitle_bn : slide.subtitle;
  const desc     = (lang === 'bn' && slide.desc_bn)     ? slide.desc_bn     : slide.desc;

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={banglaFont}>
      <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-700" style={{ backgroundImage: `url('${slide.image}')`, opacity: fade ? 1 : 0 }} />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/80 via-primary-900/60 to-primary-800/40" />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border border-white/30 animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full border border-white/20 animate-ping" style={{ animationDuration: '6s' }} />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {badges.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              <Icon className="w-3.5 h-3.5 text-green-300" />{label}
            </span>
          ))}
        </div>

        <h1 className={`font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-4 transition-all duration-500 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {title}<br /><span className="text-green-300">{subtitle}</span>
        </h1>

        <div className={`text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 transition-all duration-500 delay-100 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          dangerouslySetInnerHTML={{ __html: desc }} />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#projects" onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 text-base">{tr.exploreWork}</a>
          <a href="#contact"  onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="border-2 border-white/60 hover:border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-base backdrop-blur">{tr.contactUs}</a>
        </div>

        <div className="flex justify-center gap-2 mt-12">
          {slides.map((_, i) => (
            <button key={i} onClick={() => { setCurrent(i); setFade(true); }} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-green-400' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 animate-bounce">
        <span className="text-xs tracking-widest uppercase">{tr.scroll}</span>
        <ChevronDown className="w-5 h-5" />
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L48 52.5C96 45 192 30 288 22.5C384 15 480 15 576 20C672 25 768 35 864 37.5C960 40 1056 35 1152 27.5C1248 20 1344 10 1392 5L1440 0V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
