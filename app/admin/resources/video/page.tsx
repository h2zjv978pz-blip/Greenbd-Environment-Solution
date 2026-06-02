'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Eye, EyeOff, Star, Play, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface Video {
  id: number; title: string; category: string; description: string;
  youtubeUrl: string; thumbnail: string; duration: string;
  date: string; featured: boolean; published: boolean;
}

const CATS = ['Climate', 'EIA', 'GIS', 'Research', 'Training', 'General'];

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
  return m ? m[1] : '';
}

const DEF: Video = {
  id: 0, title: '', category: 'Climate', description: '',
  youtubeUrl: '', thumbnail: '', duration: '', date: new Date().toISOString().split('T')[0],
  featured: false, published: true,  // default to published so new videos appear immediately
};

export default function AdminVideoPage() {
  const [videos,   setVideos]   = useState<Video[]>([]);
  const [editing,  setEditing]  = useState<Video | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  const load = () =>
    fetch('/api/content/videos').then(r => r.json()).then(d => setVideos(d.videos ?? []));

  useEffect(() => { load(); }, []);

  const save = async (list = videos) => {
    setSaving(true);
    await fetch('/api/content/videos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videos: list }),
    });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const updateEditing = (patch: Partial<Video>) => {
    if (!editing) return;
    const updated = { ...editing, ...patch };
    setEditing(updated);
    // auto-save to list
    const list = editing.id === 0
      ? [...videos.filter(v => v.id !== 0)]
      : videos.map(v => v.id === updated.id ? updated : v);
    setVideos(list.some(v => v.id === updated.id) ? list : [...list, updated]);
  };

  const addNew = () => {
    const n = { ...DEF, id: Date.now() };
    setVideos(v => [...v, n]);
    setEditing(n);
  };

  const remove = (id: number) => {
    const list = videos.filter(v => v.id !== id);
    setVideos(list);
    if (editing?.id === id) setEditing(null);
    save(list);
  };

  const move = (idx: number, dir: -1 | 1) => {
    const arr = [...videos];
    const to = idx + dir;
    if (to < 0 || to >= arr.length) return;
    [arr[idx], arr[to]] = [arr[to], arr[idx]];
    setVideos(arr);
  };

  const ytId = editing ? getYouTubeId(editing.youtubeUrl) : '';

  return (
    <div className="flex gap-6" style={{ height: 'calc(100vh - 64px)' }}>

      {/* ── Left: video list ───────────────────────────────────────── */}
      <div className="w-[320px] flex-shrink-0 flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-800 text-sm">Videos ({videos.length})</h2>
          <button onClick={addNew}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {videos.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-12">No videos yet.</p>
          )}
          {videos.map((v, i) => {
            const vid = getYouTubeId(v.youtubeUrl);
            const thumb = v.thumbnail || (vid ? `https://img.youtube.com/vi/${vid}/default.jpg` : '');
            return (
              <div key={v.id}
                onClick={() => setEditing(v)}
                className={`flex items-center gap-3 px-3 py-3 border-b border-gray-50 cursor-pointer transition-colors ${editing?.id === v.id ? 'bg-primary-50 border-l-2 border-l-primary-500' : 'hover:bg-gray-50'}`}>
                <div className="w-14 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {thumb ? <img src={thumb} alt={v.title} className="w-full h-full object-cover" /> :
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Play className="w-4 h-4" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate leading-tight">{v.title || 'Untitled'}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-gray-400">{v.category}</span>
                    {v.featured && <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
                    {v.published
                      ? <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Eye className="w-2 h-2" /> Live</span>
                      : <span className="text-[9px] bg-orange-100 text-orange-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><EyeOff className="w-2 h-2" /> Draft</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button onClickCapture={e => { e.stopPropagation(); move(i, -1); }} className="p-0.5 text-gray-300 hover:text-gray-600"><ChevronUp className="w-3 h-3" /></button>
                  <button onClickCapture={e => { e.stopPropagation(); move(i, 1); }} className="p-0.5 text-gray-300 hover:text-gray-600"><ChevronDown className="w-3 h-3" /></button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
          <button onClick={() => save()} disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-60">
            {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* ── Right: editor ──────────────────────────────────────────── */}
      {editing ? (
        <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <h3 className="font-bold text-gray-800">{editing.title || 'New Video'}</h3>
            <div className="flex items-center gap-2">
              {editing.youtubeUrl && (
                <a href={editing.youtubeUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 px-3 py-1.5 border border-gray-200 rounded-lg transition-colors">
                  <ExternalLink className="w-3 h-3" /> YouTube
                </a>
              )}
              <button onClick={() => remove(editing.id)}
                className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 border border-red-200 rounded-lg transition-colors">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">

            {/* Row 1: YouTube URL + inline thumbnail */}
            <div className="flex gap-4 items-start">
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">YouTube URL</label>
                <input value={editing.youtubeUrl} onChange={e => updateEditing({ youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=… or youtu.be/…"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50" />
                {ytId && (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Video ID: <span className="font-mono font-semibold">{ytId}</span> detected
                  </p>
                )}
              </div>

              {/* Compact thumbnail — 200px wide, always in view */}
              <div className="flex-shrink-0 w-[200px]">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Preview</label>
                {ytId ? (
                  <a href={`https://www.youtube.com/watch?v=${ytId}`} target="_blank" rel="noopener noreferrer"
                    className="group block relative rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
                    <img src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`} alt=""
                      className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                      onError={e => { (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${ytId}/mqdefault.jpg`; }} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-9 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="rounded-xl bg-gray-100 flex items-center justify-center text-gray-300" style={{ aspectRatio: '16/9' }}>
                    <Play className="w-6 h-6 opacity-40" />
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Title *</label>
              <input value={editing.title} onChange={e => updateEditing({ title: e.target.value })}
                placeholder="Video title…"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50" />
            </div>

            {/* Category + Duration + Date */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                <select value={editing.category} onChange={e => updateEditing({ category: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400">
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Duration</label>
                <input value={editing.duration} onChange={e => updateEditing({ duration: e.target.value })}
                  placeholder="e.g. 5:30"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
                <input type="date" value={editing.date} onChange={e => updateEditing({ date: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400" />
              </div>
            </div>

            {/* Custom thumbnail URL */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Custom Thumbnail URL <span className="text-gray-300 font-normal normal-case tracking-normal">(optional — auto-generated from YouTube if blank)</span>
              </label>
              <input value={editing.thumbnail} onChange={e => updateEditing({ thumbnail: e.target.value })}
                placeholder="https://…"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-400" />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
              <RichTextEditor value={editing.description} onChange={v => updateEditing({ description: v })}
                minHeight={120} placeholder="Video description…" />
            </div>

            {/* Visibility + toggles */}
            {!editing.published && (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-700">
                <EyeOff className="w-4 h-4 flex-shrink-0" />
                <span>This video is a <strong>Draft</strong> — it won&apos;t appear on the public page until you click <strong>Published</strong> below.</span>
              </div>
            )}
            <div className="flex gap-4">
              {[
                { key: 'published' as const, icon: Eye,  label: 'Published',     activeClr: 'bg-green-600' },
                { key: 'featured'  as const, icon: Star, label: 'Featured Video', activeClr: 'bg-amber-500' },
              ].map(({ key, icon: Icon, label, activeClr }) => {
                const on = editing[key] as boolean;
                return (
                  <button key={key} type="button" onClick={() => updateEditing({ [key]: !on })}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${on ? `${activeClr} text-white border-transparent shadow-sm` : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                    <Icon className={`w-4 h-4 ${on && key === 'featured' ? 'fill-white' : ''}`} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Play className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Select a video to edit, or click Add</p>
          </div>
        </div>
      )}
    </div>
  );
}
