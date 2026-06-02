'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, ChevronUp, ChevronDown, X } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface Album {
  id: number; title: string; category: string;
  coverImage: string; description: string; images: string[];
}

const CATS = ['Field Work', 'Community', 'Technical', 'Events', 'Projects', 'Research'];
const DEF: Album = { id: 0, title: '', category: 'Field Work', coverImage: '', description: '', images: [] };

export default function GalleryAdmin() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/content/gallery').then(r => r.json()).then(d => setAlbums(d.albums ?? []));
  }, []);

  const saveAll = async () => {
    setSaving(true);
    await fetch('/api/content/gallery', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ albums }) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const add = () => { const a = { ...DEF, id: Date.now() }; setAlbums(al => [...al, a]); setOpenIdx(albums.length); };
  const upd = (i: number, key: keyof Album, val: unknown) => setAlbums(al => al.map((a, j) => j === i ? { ...a, [key]: val } : a));
  const remove = (i: number) => { setAlbums(al => al.filter((_, j) => j !== i)); if (openIdx === i) setOpenIdx(null); };
  const move = (i: number, d: -1 | 1) => {
    const arr = [...albums]; const j = i + d;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]]; setAlbums(arr);
    if (openIdx === i) setOpenIdx(j); else if (openIdx === j) setOpenIdx(i);
  };
  const addImage = (i: number, url: string) => upd(i, 'images', [...albums[i].images, url]);
  const removeImage = (albumIdx: number, imgIdx: number) => upd(albumIdx, 'images', albums[albumIdx].images.filter((_, j) => j !== imgIdx));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Image Gallery</h1>
          <p className="text-sm text-gray-500 mt-0.5">{albums.length} album{albums.length !== 1 ? 's' : ''} · {albums.reduce((s, a) => s + a.images.length, 0)} photos</p>
        </div>
        <div className="flex gap-3">
          <button onClick={add} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg text-white" style={{ backgroundColor: '#00d97e' }}>
            <Plus className="w-4 h-4" /> New Album
          </button>
          <button onClick={saveAll} disabled={saving} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg text-white disabled:opacity-60"
            style={{ backgroundColor: saved ? '#00d97e' : '#2c7be5' }}>
            <Save className="w-4 h-4" /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {albums.length === 0 && <p className="text-gray-400 text-center py-16 bg-white rounded-xl border">No albums yet.</p>}
        {albums.map((album, i) => (
          <div key={album.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Album header row */}
            <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              <div className="flex flex-col gap-0.5">
                <button onClick={e => { e.stopPropagation(); move(i, -1); }} disabled={i === 0} className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20"><ChevronUp className="w-3.5 h-3.5" /></button>
                <button onClick={e => { e.stopPropagation(); move(i, 1); }} disabled={i === albums.length - 1} className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20"><ChevronDown className="w-3.5 h-3.5" /></button>
              </div>
              {album.coverImage && <img src={album.coverImage} alt="" className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{album.title || 'Untitled Album'}</p>
                <p className="text-xs text-gray-400">{album.category} · {album.images.length} photo{album.images.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); remove(i); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
            </div>

            {/* Expanded editor */}
            {openIdx === i && (
              <div className="border-t border-gray-100 p-5 space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Album Title</label>
                    <input value={album.title} onChange={e => upd(i, 'title', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                    <select value={album.category} onChange={e => upd(i, 'category', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                      {CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                    <input value={album.description} onChange={e => upd(i, 'description', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cover Image</label>
                    <ImageUpload value={album.coverImage} onChange={url => upd(i, 'coverImage', url)} label="Cover Photo" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Add Photo</label>
                    <ImageUpload value="" onChange={url => { if (url) addImage(i, url); }} label="Upload Photo" />
                  </div>
                </div>

                {/* Photo grid */}
                {album.images.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Photos ({album.images.length})</label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                      {album.images.map((src, j) => (
                        <div key={j} className="relative group aspect-square">
                          <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
                          <button onClick={() => removeImage(i, j)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
