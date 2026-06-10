'use client';

import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

/* ── Fullscreen lightbox ──────────────────────────────────────────────── */
interface LightboxProps { images: string[]; initial: number; onClose: () => void; }

export default function Lightbox({ images, initial, onClose }: LightboxProps) {
  const [cur, setCur] = useState(initial);

  useEffect(() => {
    // Push a history entry so the back button closes the lightbox, not the page
    history.pushState({ lightbox: true }, '');

    const onPop = () => onClose();   // back button → close
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     { history.back(); }   // triggers onPop → onClose
      if (e.key === 'ArrowLeft')  setCur(c => Math.max(0, c - 1));
      if (e.key === 'ArrowRight') setCur(c => Math.min(images.length - 1, c + 1));
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, images.length]);

  // X button / backdrop click: pop the history entry we pushed, then close
  const handleClose = () => { history.back(); };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={handleClose}>
      <button onClick={e => { e.stopPropagation(); handleClose(); }}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
        <X className="w-5 h-5" />
      </button>
      {images.length > 1 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          {cur + 1} / {images.length}
        </div>
      )}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); setCur(c => Math.max(0, c - 1)); }}
          disabled={cur === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full disabled:opacity-25 transition-all active:scale-95"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', border: '2px solid rgba(255,255,255,0.35)' }}
        >
          <ChevronLeft className="w-7 h-7 text-white drop-shadow" />
        </button>
      )}
      <img src={images[cur]} alt={`Image ${cur + 1}`}
        className="max-w-[90vw] max-h-[88vh] object-contain rounded-xl shadow-2xl select-none"
        onClick={e => e.stopPropagation()}
        onContextMenu={e => e.preventDefault()}
        draggable={false} />
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); setCur(c => Math.min(images.length - 1, c + 1)); }}
          disabled={cur === images.length - 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full disabled:opacity-25 transition-all active:scale-95"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', border: '2px solid rgba(255,255,255,0.35)' }}
        >
          <ChevronRight className="w-7 h-7 text-white drop-shadow" />
        </button>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-6 flex items-center gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setCur(i); }}
              className={`rounded-full transition-all ${i === cur ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`} />
          ))}
        </div>
      )}
    </div>
  );
}

const SLIDE_INTERVAL = 4000; // ms per slide

/* ── Slideshow gallery with thumbnail strip ───────────────────────────── */
export function GalleryGrid({ images, title, className = 'mt-12' }: { images: string[]; title: string; className?: string }) {
  const [active,   setActive]   = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [paused,   setPaused]   = useState(false);
  const [progress, setProgress] = useState(0);
  const thumbRef    = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef   = useRef(active);
  activeRef.current = active;

  if (images.length === 0) return null;

  // Scroll the active thumbnail into view inside the strip
  const scrollThumbIntoView = (i: number) => {
    const strip = thumbRef.current;
    if (!strip) return;
    const thumb = strip.children[i] as HTMLElement | undefined;
    if (!thumb) return;
    const stripLeft   = strip.scrollLeft;
    const stripRight  = stripLeft + strip.clientWidth;
    const thumbLeft   = thumb.offsetLeft;
    const thumbRight  = thumbLeft + thumb.offsetWidth;
    if (thumbLeft < stripLeft)       strip.scrollLeft = thumbLeft - 8;
    else if (thumbRight > stripRight) strip.scrollLeft = thumbRight - strip.clientWidth + 8;
  };

  const go = (i: number) => { setActive(i); scrollThumbIntoView(i); setProgress(0); };
  const prev = () => go((activeRef.current - 1 + images.length) % images.length);
  const next = () => go((activeRef.current + 1) % images.length);

  // Auto-advance
  useEffect(() => {
    if (images.length < 2) return;
    const startTimers = () => {
      intervalRef.current = setInterval(() => {
        setActive(a => (a + 1) % images.length);
        setProgress(0);
        setTimeout(() => scrollThumbIntoView((activeRef.current + 1) % images.length), 0);
      }, SLIDE_INTERVAL);
      const tick = 50;
      progRef.current = setInterval(() => {
        setProgress(p => Math.min(100, p + (tick / SLIDE_INTERVAL) * 100));
      }, tick);
    };
    const stopTimers = () => {
      if (intervalRef.current)  clearInterval(intervalRef.current);
      if (progRef.current)      clearInterval(progRef.current);
    };
    if (!paused && lightbox === null) { setProgress(0); startTimers(); }
    else stopTimers();
    return stopTimers;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, lightbox, images.length]);

  return (
    <div className={className}>
      <h2 className="text-xl font-bold text-gray-900 font-heading mb-4">{title}</h2>

      {/* ── Main image ── */}
      <div
        className="relative w-full overflow-hidden rounded-xl bg-gray-50 select-none flex items-center justify-center"
        style={{ minHeight: 220, maxHeight: '70vh' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <img
          key={active}
          src={images[active]}
          alt={`${title} ${active + 1}`}
          className="w-full h-auto max-h-[70vh] object-contain select-none"
          onContextMenu={e => e.preventDefault()}
          draggable={false}
        />

        {/* Counter badge */}
        {images.length > 1 && (
          <div className="absolute top-3 left-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {active + 1} / {images.length}
          </div>
        )}

        {/* Expand to fullscreen */}
        <button
          onClick={() => setLightbox(active)}
          className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-lg flex items-center justify-center transition-colors"
          title="View fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Prev arrow */}
        {images.length > 1 && (
          <button onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next arrow */}
        {images.length > 1 && (
          <button onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Auto-slide progress bar */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-b-xl overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {images.length > 1 && (
        <div
          ref={thumbRef}
          className="flex gap-2 mt-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                i === active
                  ? 'ring-2 ring-primary-500 ring-offset-2 opacity-100'
                  : 'opacity-60 hover:opacity-90'
              }`}
              style={{ width: 80, height: 54 }}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover select-none"
                onContextMenu={e => e.preventDefault()} draggable={false} />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      {lightbox !== null && (
        <Lightbox images={images} initial={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
