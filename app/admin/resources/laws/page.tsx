'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Save, ChevronUp, ChevronDown, Upload, FileText, X, ExternalLink } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface Law {
  id: number; title: string; year: number; category: string;
  status: string; description: string; pdfUrl: string; tags: string[];
}

const CATS = ['Environmental Protection', 'Water Resources', 'Forest & Biodiversity', 'Air Quality', 'Climate Policy', 'Land Use', 'Marine'];
const STATUSES = ['Active', 'Amended', 'Repealed', 'Proposed'];
const DEF: Law = { id: 0, title: '', year: new Date().getFullYear(), category: 'Environmental Protection', status: 'Active', description: '', pdfUrl: '', tags: [] };

// ── PDF upload cell ───────────────────────────────────────────────────────────
function PdfUploadCell({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');
  const inputRef                  = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') { setError('Only PDF files are allowed'); return; }
    if (file.size > 20 * 1024 * 1024)   { setError('File too large (max 20 MB)');  return; }
    setError(''); setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res  = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Upload failed'); return; }
      onChange(json.url);
    } catch { setError('Upload failed — please try again'); }
    finally { setUploading(false); }
  };

  const pdfName = value ? decodeURIComponent(value.split('/').pop() ?? 'document.pdf') : '';

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">PDF</label>

      {/* Attached PDF */}
      {value && (
        <div className="flex items-center gap-2 mb-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-xs text-green-700 font-medium truncate flex-1 max-w-[140px]" title={pdfName}>{pdfName}</span>
          <a href={value} target="_blank" rel="noopener noreferrer" title="Open PDF">
            <ExternalLink className="w-3.5 h-3.5 text-green-500 hover:text-green-700" />
          </a>
          <button onClick={() => { onChange(''); setError(''); }} title="Remove PDF"
            className="text-red-400 hover:text-red-600 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload / paste URL row */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-colors flex-shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload PDF'}
        </button>

        <input
          value={value}
          onChange={e => { onChange(e.target.value); setError(''); }}
          placeholder="or paste URL…"
          className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-gray-600"
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      <input
        ref={inputRef} type="file" accept="application/pdf" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LawsAdmin() {
  const [laws, setLaws]   = useState<Law[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  useEffect(() => {
    fetch('/api/content/laws').then(r => r.json()).then(d => setLaws(d.laws ?? []));
  }, []);

  const saveAll = async () => {
    setSaving(true);
    await fetch('/api/content/laws', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ laws }) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const add    = () => setLaws(ls => [...ls, { ...DEF, id: Date.now() }]);
  const upd    = (i: number, key: keyof Law, val: unknown) => setLaws(ls => ls.map((l, j) => j === i ? { ...l, [key]: val } : l));
  const remove = (i: number) => setLaws(ls => ls.filter((_, j) => j !== i));
  const move   = (i: number, d: -1 | 1) => {
    const arr = [...laws]; const j = i + d;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]]; setLaws(arr);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Environmental Laws</h1>
          <p className="text-sm text-gray-500 mt-0.5">{laws.length} law{laws.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={add} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg text-white" style={{ backgroundColor: '#00d97e' }}>
            <Plus className="w-4 h-4" /> Add Law
          </button>
          <button onClick={saveAll} disabled={saving} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg text-white disabled:opacity-60"
            style={{ backgroundColor: saved ? '#00d97e' : '#2c7be5' }}>
            <Save className="w-4 h-4" /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {laws.length === 0 && <p className="text-gray-400 text-center py-16 bg-white rounded-xl border">No laws added yet.</p>}
        {laws.map((law, i) => (
          <div key={law.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-0.5 pt-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => move(i, 1)} disabled={i === laws.length - 1} className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20"><ChevronDown className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                  <input value={law.title} onChange={e => upd(i, 'title', e.target.value)} placeholder="Act / Rule / Policy name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Year</label>
                  <input type="number" value={law.year} onChange={e => upd(i, 'year', Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                  <select value={law.status} onChange={e => upd(i, 'status', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <select value={law.category} onChange={e => upd(i, 'category', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <PdfUploadCell value={law.pdfUrl} onChange={url => upd(i, 'pdfUrl', url)} />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tags (comma separated)</label>
                  <input value={law.tags.join(', ')} onChange={e => upd(i, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    placeholder="pollution, clearance, DOE"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div className="lg:col-span-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                  <RichTextEditor value={law.description} onChange={v => upd(i, 'description', v)} minHeight={80} />
                </div>
              </div>
              <button onClick={() => remove(i)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
