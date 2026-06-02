'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface Post {
  id: number; title: string; slug: string; category: string;
  author: string; date: string; excerpt: string; content: string;
  image: string; tags: string[]; published: boolean;
}

const CATS = ['Climate', 'GIS/RS', 'Disaster Risk', 'Sustainability', 'Research', 'Community', 'Policy'];

const DEF: Post = { id: 0, title: '', slug: '', category: 'Climate', author: '', date: new Date().toISOString().split('T')[0], excerpt: '', content: '', image: '', tags: [], published: false };

export default function BlogAdmin() {
  const [posts, setPosts]   = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  useEffect(() => {
    fetch('/api/content/blog').then(r => r.json()).then(d => setPosts(d.posts ?? []));
  }, []);

  const saveAll = async (list: Post[]) => {
    setSaving(true);
    await fetch('/api/content/blog', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ posts: list }) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const addPost = () => {
    const p = { ...DEF, id: Date.now() };
    setPosts(ps => [...ps, p]);
    setEditing(p);
  };

  const updatePost = (p: Post) => setPosts(ps => ps.map(x => x.id === p.id ? p : x));
  const removePost = (id: number) => setPosts(ps => ps.filter(p => p.id !== id));
  const move = (i: number, d: -1 | 1) => {
    const arr = [...posts]; const j = i + d;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]]; setPosts(arr);
  };

  const toSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog / News</h1>
          <p className="text-sm text-gray-500 mt-0.5">{posts.length} article{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addPost} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg text-white" style={{ backgroundColor: '#00d97e' }}>
            <Plus className="w-4 h-4" /> New Post
          </button>
          <button onClick={() => saveAll(posts)} disabled={saving} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg text-white disabled:opacity-60"
            style={{ backgroundColor: saved ? '#00d97e' : '#2c7be5' }}>
            <Save className="w-4 h-4" /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          {posts.length === 0 && <p className="text-gray-400 text-center py-12 bg-white rounded-xl border">No posts yet.</p>}
          {posts.map((p, i) => (
            <div key={p.id}
              onClick={() => setEditing(p)}
              className={`bg-white rounded-xl border p-4 cursor-pointer hover:border-blue-300 transition-all ${editing?.id === p.id ? 'border-blue-400 shadow-sm' : 'border-gray-100'}`}>
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-0.5">
                  <button onClick={e => { e.stopPropagation(); move(i, -1); }} disabled={i === 0} className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <button onClick={e => { e.stopPropagation(); move(i, 1); }} disabled={i === posts.length - 1} className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20"><ChevronDown className="w-3.5 h-3.5" /></button>
                </div>
                {p.image && <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{p.title || 'Untitled'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.category} · {p.date}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.published ? 'Live' : 'Draft'}
                  </span>
                  <button onClick={e => { e.stopPropagation(); removePost(p.id); }}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          {editing ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 sticky top-24">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Edit Post</h3>
                <button
                  onClick={() => { const updated = { ...editing, published: !editing.published }; setEditing(updated); updatePost(updated); }}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${editing.published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {editing.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {editing.published ? 'Published' : 'Draft'}
                </button>
              </div>

              <ImageUpload value={editing.image} onChange={url => { const u = { ...editing, image: url }; setEditing(u); updatePost(u); }} label="Cover Image" />

              {[
                ['Title', 'title', ''],
                ['Author', 'author', ''],
                ['Date', 'date', 'type-date'],
              ].map(([label, key, hint]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
                  <input
                    type={hint === 'type-date' ? 'date' : 'text'}
                    value={String((editing as unknown as Record<string,unknown>)[key] ?? '')}
                    onChange={e => {
                      const val = e.target.value;
                      const upd: Post = { ...editing, [key]: val };
                      if (key === 'title') upd.slug = toSlug(val);
                      setEditing(upd); updatePost(upd);
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                <select value={editing.category} onChange={e => { const u = { ...editing, category: e.target.value }; setEditing(u); updatePost(u); }}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Excerpt</label>
                <RichTextEditor value={editing.excerpt} onChange={v => { const u = { ...editing, excerpt: v }; setEditing(u); updatePost(u); }} minHeight={80} placeholder="Short excerpt…" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Content</label>
                <RichTextEditor value={editing.content} onChange={v => { const u = { ...editing, content: v }; setEditing(u); updatePost(u); }} minHeight={240} placeholder="Full article content…" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tags (comma separated)</label>
                <input value={editing.tags.join(', ')} onChange={e => {
                    const u = { ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) };
                    setEditing(u); updatePost(u);
                  }}
                  placeholder="climate, bangladesh, adaptation"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
              <p className="text-lg font-medium">Select a post to edit</p>
              <p className="text-sm mt-1">Or click &ldquo;New Post&rdquo; to create one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
