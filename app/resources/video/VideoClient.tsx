'use client';

import { useState } from 'react';
import { Play, Clock, Tag, X, Search, Star } from 'lucide-react';

interface Video {
  id: number; title: string; category: string; description: string;
  youtubeUrl: string; thumbnail: string; duration: string;
  date: string; featured: boolean; published: boolean;
}

function getYouTubeId(url: string): string {
  const m = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
  return m ? m[1] : '';
}

function YtThumb({ url, title }: { url: string; title: string }) {
  const id = getYouTubeId(url);
  if (!id) return <div className="w-full h-full bg-gray-800 flex items-center justify-center"><Play className="w-8 h-8 text-gray-600" /></div>;
  return (
    <img
      src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
      alt={title}
      className="w-full h-full object-cover"
      onError={e => { (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`; }}
    />
  );
}

const CAT_COLORS: Record<string, string> = {
  Climate:  'bg-blue-100 text-blue-700',
  EIA:      'bg-green-100 text-green-700',
  GIS:      'bg-purple-100 text-purple-700',
  Research: 'bg-amber-100 text-amber-700',
  Training: 'bg-rose-100 text-rose-700',
  General:  'bg-gray-100 text-gray-600',
};

export default function VideoClient({ videos }: { videos: Video[] }) {
  const [active,   setActive]   = useState<Video | null>(null);
  const [playing,  setPlaying]  = useState(false);   // true = show iframe; false = show poster
  const [cat,      setCat]      = useState('All');
  const [search,   setSearch]   = useState('');

  const openModal = (v: Video) => { setActive(v); setPlaying(false); };
  const closeModal = () => { setActive(null); setPlaying(false); };

  const cats = ['All', ...Array.from(new Set(videos.map(v => v.category)))];

  const filtered = videos.filter(v =>
    (cat === 'All' || v.category === cat) &&
    (!search || v.title.toLowerCase().includes(search.toLowerCase()) ||
     v.description.toLowerCase().includes(search.toLowerCase()))
  );

  const featured = videos.find(v => v.featured && v.published);
  const featId   = featured ? getYouTubeId(featured.youtubeUrl) : '';

  return (
    <>
      {/* ── Featured hero ──────────────────────────────────────────── */}
      {featured && (
        <section className="bg-gray-900 relative overflow-hidden mb-12">
          <div className="absolute inset-0">
            {featId && (
              <img src={`https://i.ytimg.com/vi/${featId}/maxresdefault.jpg`} alt=""
                className="w-full h-full object-cover opacity-40"
                onError={e => { (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${featId}/hqdefault.jpg`; }} />
            )}
          </div>
          <div className="relative z-10 container mx-auto px-4 lg:px-8 py-20 flex flex-col items-center text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-green-400 mb-3 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" /> Featured Video
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-3xl">{featured.title}</h2>
            <p className="text-gray-300 max-w-xl mb-8 text-sm leading-relaxed">{featured.description}</p>
            <button onClick={() => openModal(featured)}
              className="flex items-center gap-3 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-2xl">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-5 h-5 fill-white" />
              </div>
              Watch Now
            </button>
          </div>
        </section>
      )}

      {/* ── Filter bar ───────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  cat === c ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                }`}>
                {c}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search videos…"
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary-400 w-52" />
          </div>
        </div>
      </div>

      {/* ── Video grid ───────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 lg:px-8 pb-16">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No videos found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(v => (
              <button key={v.id} onClick={() => openModal(v)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left">
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  <YtThumb url={v.youtubeUrl} title={v.title} />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                      <Play className="w-6 h-6 text-primary-600 fill-primary-600 ml-0.5" />
                    </div>
                  </div>
                  {v.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {v.duration}
                    </span>
                  )}
                  {v.featured && (
                    <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${CAT_COLORS[v.category] ?? CAT_COLORS.General}`}>
                      <Tag className="w-2.5 h-2.5" /> {v.category}
                    </span>
                    <span className="text-xs text-gray-400">{v.date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">{v.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{v.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Video modal ──────────────────────────────────────────────── */}
      {active && (() => {
        const vid = getYouTubeId(active.youtubeUrl);
        return (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="bg-gray-900 rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl" onClick={e => e.stopPropagation()}>

              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
                <div>
                  <h4 className="text-white font-semibold text-sm truncate max-w-md">{active.title}</h4>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${CAT_COLORS[active.category] ?? CAT_COLORS.General}`}>
                    {active.category}
                  </span>
                </div>
                <button onClick={closeModal} className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors flex-shrink-0">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Video area — poster until user clicks Play */}
              <div className="aspect-video bg-black relative">
                {playing && vid ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  /* Poster with big play button */
                  <div className="w-full h-full relative cursor-pointer group" onClick={() => vid && setPlaying(true)}>
                    {vid ? (
                      <>
                        <img
                          src={`https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`}
                          alt={active.title}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`; }}
                        />
                        {/* YouTube-style play overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                          <div className="w-20 h-14 bg-red-600 group-hover:bg-red-500 rounded-xl flex items-center justify-center shadow-2xl transition-all group-hover:scale-110">
                            <Play className="w-7 h-7 fill-white text-white ml-1" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 flex-col gap-3">
                        <Play className="w-12 h-12 opacity-30" />
                        <p className="text-sm">No video URL set</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {active.description && (
                <div className="px-5 py-3 border-t border-gray-700">
                  <p className="text-gray-400 text-sm leading-relaxed">{active.description}</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </>
  );
}
