'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Images, ZoomIn } from 'lucide-react';

interface Album {
  id: number; title: string; category: string;
  coverImage: string; description: string; images: string[];
}

export default function GalleryClient({ albums }: { albums: Album[] }) {
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const allImages = activeAlbum ? activeAlbum.images : albums.flatMap(a => a.images);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prev = () => setLightboxIdx(i => (i != null ? Math.max(0, i - 1) : 0));
  const next = () => setLightboxIdx(i => (i != null ? Math.min(allImages.length - 1, i + 1) : 0));

  if (albums.length === 0) return (
    <div className="text-center py-24 text-gray-400">
      <Images className="w-12 h-12 mx-auto mb-4 opacity-30" />
      <p className="text-lg font-medium">No albums added yet.</p>
    </div>
  );

  return (
    <>
      {/* Album selector */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button onClick={() => setActiveAlbum(null)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!activeAlbum ? 'bg-primary-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'}`}>
          All Photos ({albums.reduce((s, a) => s + a.images.length, 0)})
        </button>
        {albums.map(album => (
          <button key={album.id}
            onClick={() => setActiveAlbum(prev => prev?.id === album.id ? null : album)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeAlbum?.id === album.id ? 'bg-primary-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'}`}>
            {album.title} ({album.images.length})
          </button>
        ))}
      </div>

      {/* Album covers */}
      {!activeAlbum && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {albums.map(album => (
            <div key={album.id} onClick={() => setActiveAlbum(album)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="relative h-44 overflow-hidden">
                <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-sm">{album.title}</p>
                  <p className="text-white/70 text-xs mt-0.5">{album.images.length} photos</p>
                </div>
                <div className="absolute top-2 right-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full">{album.category}</div>
              </div>
              <p className="text-gray-500 text-xs p-4 line-clamp-2">{album.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Photo masonry grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {allImages.map((src, i) => (
          <div key={i} onClick={() => openLightbox(i)}
            className="group break-inside-avoid cursor-pointer relative overflow-hidden rounded-xl">
            <img src={src} alt={`Photo ${i + 1}`} className="w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
            <X className="w-8 h-8" />
          </button>
          <button onClick={e => { e.stopPropagation(); prev(); }} disabled={lightboxIdx === 0}
            className="absolute left-4 text-white/70 hover:text-white disabled:opacity-20 z-10">
            <ChevronLeft className="w-10 h-10" />
          </button>
          <img src={allImages[lightboxIdx]} alt={`Photo ${lightboxIdx + 1}`}
            className="max-w-[88vw] max-h-[88vh] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); next(); }} disabled={lightboxIdx === allImages.length - 1}
            className="absolute right-4 text-white/70 hover:text-white disabled:opacity-20 z-10">
            <ChevronRight className="w-10 h-10" />
          </button>
          <p className="absolute bottom-4 text-white/50 text-sm">{lightboxIdx + 1} / {allImages.length}</p>
        </div>
      )}
    </>
  );
}
