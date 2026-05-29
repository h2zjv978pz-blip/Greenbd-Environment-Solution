'use client';

import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface Props {
  images: string[];
  initial: number;
  onClose: () => void;
}

export default function Lightbox({ images, initial, onClose }: Props) {
  const [cur, setCur] = useState(initial);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  setCur(c => Math.max(0, c - 1));
      if (e.key === 'ArrowRight') setCur(c => Math.min(images.length - 1, c + 1));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, images.length]);

  const prev = () => setCur(c => Math.max(0, c - 1));
  const next = () => setCur(c => Math.min(images.length - 1, c + 1));

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          {cur + 1} / {images.length}
        </div>
      )}

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); prev(); }}
          disabled={cur === 0}
          className="absolute left-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <img
        src={images[cur]}
        alt={`Image ${cur + 1}`}
        className="max-w-[90vw] max-h-[88vh] object-contain rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); next(); }}
          disabled={cur === images.length - 1}
          className="absolute right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Dot navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-6 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setCur(i); }}
              className={`rounded-full transition-all ${i === cur ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Clickable gallery grid ─────────────────────────────────────────── */
export function GalleryGrid({ images, title }: { images: string[]; title: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  if (images.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 font-heading mb-5">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="aspect-video rounded-xl overflow-hidden bg-gray-100 relative group block w-full text-left"
          >
            <img
              src={img}
              alt={`${title} ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
            </div>
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <Lightbox
          images={images}
          initial={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
