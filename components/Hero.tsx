'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Globe, Leaf, Shield } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    title: 'Environmental Solutions',
    subtitle: 'for a Sustainable Bangladesh',
    desc: 'Driving climate resilience, GIS research, and eco-innovation for communities and ecosystems across Bangladesh.',
  },
  {
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=80',
    title: 'Climate Resilience &',
    subtitle: 'Disaster Risk Reduction',
    desc: 'Science-based strategies to protect communities, reduce vulnerability, and build adaptive capacity nationwide.',
  },
  {
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    title: 'GIS & Remote Sensing',
    subtitle: 'Precision Environmental Mapping',
    desc: 'Advanced geospatial intelligence and satellite data analysis for informed environmental decision-making.',
  },
];

const badges = [
  { icon: Leaf, label: 'Sustainability' },
  { icon: Globe, label: 'GIS & Remote Sensing' },
  { icon: Shield, label: 'Climate Resilience' },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % slides.length);
        setFade(true);
      }, 500);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: `url('${slide.image}')`,
          opacity: fade ? 1 : 0,
        }}
      />
      {/* Dark + green gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/80 via-primary-900/60 to-primary-800/40" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border border-white/30 animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full border border-white/20 animate-ping" style={{ animationDuration: '6s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
        {/* Badge row */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {badges.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full"
            >
              <Icon className="w-3.5 h-3.5 text-green-300" />
              {label}
            </span>
          ))}
        </div>

        <h1
          className={`font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-4 transition-all duration-500 ${
            fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {slide.title}
          <br />
          <span className="text-green-300">{slide.subtitle}</span>
        </h1>

        <p
          className={`text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 transition-all duration-500 delay-100 ${
            fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {slide.desc}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 text-base"
          >
            Explore Our Work
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="border-2 border-white/60 hover:border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-base backdrop-blur"
          >
            Contact Us
          </a>
        </div>

        {/* Slide dots */}
        <div className="flex justify-center gap-2 mt-12">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setFade(true); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-green-400' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L48 52.5C96 45 192 30 288 22.5C384 15 480 15 576 20C672 25 768 35 864 37.5C960 40 1056 35 1152 27.5C1248 20 1344 10 1392 5L1440 0V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
