'use client';

import { useRef, useState, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  Undo, Redo, X, ImageIcon, Upload, Loader2, CheckCircle2,
} from 'lucide-react';
import ImageUpload from './ImageUpload';
import AutoTranslateButton from './AutoTranslateButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { adminT } from '@/lib/i18n/translations';

const CATEGORIES = ['Climate', 'GIS/RS', 'Research', 'Disaster Risk', 'Sustainability', 'Community'];

export interface ProjectData {
  id?: number;
  title: string;       title_bn?: string;
  category: string;
  clientName: string;
  location: string;    location_bn?: string;
  projectTime: string;
  description: string; description_bn?: string;
  image: string;
  galleryImages: string[];
  additionalImages: string[];
}

const EMPTY: ProjectData = {
  title: '', title_bn: '', category: 'Climate', clientName: '', location: '', location_bn: '',
  projectTime: '', description: '', description_bn: '', image: '', galleryImages: [], additionalImages: [],
};

interface Props { initial?: Partial<ProjectData>; mode: 'create' | 'edit'; }

/* ── Rich-text toolbar ─────────────────────────────────────────────── */
function RichEditor({ value, onChange, banglaFont = false }: { value: string; onChange: (v: string) => void; banglaFont?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const cmd = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };
  const toolBtn = (icon: React.ReactNode, command: string, title: string, arg?: string) => (
    <button type="button" title={title} onMouseDown={e => { e.preventDefault(); cmd(command, arg); }}
      className="w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0">{icon}</button>
  );
  return (
    <div className={`border rounded-lg overflow-hidden transition-all focus-within:ring-2 ${banglaFont ? 'border-blue-200 focus-within:border-blue-400 focus-within:ring-blue-50' : 'border-gray-200 focus-within:border-blue-400 focus-within:ring-blue-50'}`}>
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200 flex-wrap">
        {toolBtn(<Bold className="w-3.5 h-3.5" />,          'bold',              'Bold')}
        {toolBtn(<Italic className="w-3.5 h-3.5" />,        'italic',            'Italic')}
        {toolBtn(<Underline className="w-3.5 h-3.5" />,     'underline',         'Underline')}
        {toolBtn(<Strikethrough className="w-3.5 h-3.5" />, 'strikeThrough',     'Strikethrough')}
        <div className="w-px h-5 bg-gray-300 mx-1" />
        {toolBtn(<List className="w-3.5 h-3.5" />,        'insertUnorderedList', 'Bullet List')}
        {toolBtn(<ListOrdered className="w-3.5 h-3.5" />, 'insertOrderedList',   'Numbered List')}
        <div className="w-px h-5 bg-gray-300 mx-1" />
        {toolBtn(<Undo className="w-3.5 h-3.5" />, 'undo', 'Undo')}
        {toolBtn(<Redo className="w-3.5 h-3.5" />, 'redo', 'Redo')}
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <select onMouseDown={e => e.stopPropagation()} onChange={e => cmd('fontSize', e.target.value)}
          className="text-xs bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-600">
          {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{['8pt','10pt','12pt','14pt','18pt','24pt','36pt'][n-1]}</option>)}
        </select>
      </div>
      <div ref={ref} contentEditable suppressContentEditableWarning
        onInput={() => { if (ref.current) onChange(ref.current.innerHTML); }}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[180px] p-3 text-sm text-gray-800 focus:outline-none"
        style={{ lineHeight: 1.7, ...(banglaFont ? { fontFamily: "'Hind Siliguri', sans-serif" } : {}) }}
      />
    </div>
  );
}

/* ── Gallery editor ─────────────────────────────────────────────────── */
function GalleryEditor({ label, hint, images, onChange, dropText, dropHint, uploadedText }: {
  label: string; hint: string; images: string[]; onChange: (imgs: string[]) => void;
  dropText: string; dropHint: string; uploadedText: string;
}) {
  const fileRef   = useRef<HTMLInputElement>(null);
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done,      setDone]      = useState(0);
  const [total,     setTotal]     = useState(0);
  const [urlInputs, setUrlInputs] = useState<string[]>([]);

  const remove = (i: number) => {
    onChange(images.filter((_, j) => j !== i));
    setUrlInputs(u => u.filter((_, j) => j !== i));
  };

  const uploadFiles = async (files: File[]) => {
    const valid = files.filter(f => f.type.startsWith('image/'));
    if (!valid.length) return;
    setUploading(true); setTotal(valid.length); setDone(0);
    const uploaded: string[] = [];
    for (const file of valid) {
      const form = new FormData(); form.append('file', file);
      try { const res = await fetch('/api/upload', { method: 'POST', body: form }); const data = await res.json(); if (data.url) uploaded.push(data.url); } catch {}
      setDone(d => d + 1);
    }
    onChange([...images, ...uploaded]);
    setUploading(false); setTotal(0); setDone(0);
  };

  const applyUrl = (i: number) => {
    const url = urlInputs[i]?.trim();
    if (!url) return;
    const updated = [...images]; updated[i] = url; onChange(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold" style={{ color: '#2c7be5' }}>{label}</h3>
        <span className="text-[11px] text-white px-2 py-0.5 rounded font-medium" style={{ backgroundColor: '#2c7be5' }}>{hint}</span>
      </div>
      <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
        onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(false); uploadFiles(Array.from(e.dataTransfer.files)); }}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all mb-4 select-none ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'} ${uploading ? 'pointer-events-none opacity-70' : ''}`}>
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm font-semibold text-gray-700">Uploading {done} of {total} image{total > 1 ? 's' : ''}…</p>
            <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-200" style={{ width: `${total ? Math.round((done / total) * 100) : 0}%` }} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload className="w-8 h-8" />
            <div>
              <p className="text-sm font-semibold text-gray-600">{dropText}</p>
              <p className="text-xs mt-0.5">{dropHint}</p>
            </div>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="hidden"
        onChange={e => { if (e.target.files) uploadFiles(Array.from(e.target.files)); e.target.value = ''; }} />
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {images.map((img, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              {img ? <img src={img} alt={`Image ${i+1}`} className="w-full aspect-video object-cover" />
                   : <div className="w-full aspect-video flex items-center justify-center bg-gray-100"><ImageIcon className="w-6 h-6 text-gray-300" /></div>}
              {img && (
                <div className="absolute bottom-1.5 left-1.5 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
                  {img.startsWith('/uploads/') ? uploadedText : 'URL'}
                </div>
              )}
              <button type="button" onClick={() => remove(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                <X className="w-3 h-3" />
              </button>
              {!img && (
                <div className="p-2">
                  <div className="flex gap-1">
                    <input value={urlInputs[i] ?? ''} onChange={e => { const u = [...urlInputs]; u[i] = e.target.value; setUrlInputs(u); }}
                      placeholder="Paste image URL" className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400" />
                    <button type="button" onClick={() => applyUrl(i)} className="text-xs text-white px-2 py-1 rounded font-semibold" style={{ backgroundColor: '#2c7be5' }}>OK</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {images.length > 0 && <p className="text-xs text-gray-400 mb-2">{images.length} image{images.length !== 1 ? 's' : ''} added</p>}
    </div>
  );
}

/* ── Main form ───────────────────────────────────────────────────────── */
export default function ProjectForm({ initial, mode }: Props) {
  const router = useRouter();
  const { lang } = useLanguage();
  const tr = adminT(lang);
  const pf = tr.projectForm;
  const bf = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const [form,      setForm]      = useState<ProjectData>({ ...EMPTY, ...initial });
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [bnEditorKey, setBnEditorKey] = useState(0);

  const set = (key: keyof ProjectData, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError(pf.errorRequired); return; }
    setSaving(true); setError('');
    try {
      if (mode === 'create') {
        await fetch('/api/content/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      } else {
        await fetch(`/api/content/projects/${form.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      }
      router.push('/admin/projects');
    } catch {
      setError(pf.errorSave);
      setSaving(false);
    }
  };

  const inputCls   = 'w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all';
  const inputBnCls = 'w-full border border-blue-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all';
  const labelCls   = 'block text-sm text-gray-600 mb-1.5';
  const labelBnCls = 'block text-sm text-blue-500 mb-1.5';

  return (
    <div style={bf}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {mode === 'create' ? pf.createTitle : pf.editTitle}
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Main form card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-5">
          <div className="max-w-3xl space-y-5">
            {error && <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

            {/* Project Name (EN) */}
            <div>
              <label className={labelCls}>{pf.nameField} <span className="text-red-500">*</span></label>
              <input value={form.title} onChange={e => set('title', e.target.value)} required className={inputCls} />
            </div>

            {/* Category */}
            <div>
              <label className={labelCls}>{pf.categoryField} <span className="text-red-500">*</span></label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Client Name */}
            <div>
              <label className={labelCls}>{pf.clientField}</label>
              <input value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="e.g. UNDP Bangladesh" className={inputCls} />
            </div>

            {/* Location (EN) */}
            <div>
              <label className={labelCls}>{pf.locationField}</label>
              <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Dhaka, Bangladesh" className={inputCls} />
            </div>

            {/* Project Time */}
            <div>
              <label className={labelCls}>{pf.timeField}</label>
              <input value={form.projectTime} onChange={e => set('projectTime', e.target.value)} placeholder="e.g. 2023 or Jan 2022 – Dec 2023" className={inputCls} />
            </div>

            {/* Description (EN) */}
            <div>
              <label className={labelCls}>{pf.descField}</label>
              <RichEditor value={form.description} onChange={v => set('description', v)} />
            </div>

            {/* ── Bangla section ───────────────────────────────────── */}
            <div className="border-t-2 border-dashed border-blue-100 pt-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider" style={bf}>
                  {tr.common.banglaSection}
                </p>
                <AutoTranslateButton fields={[
                  { text: form.title,       onResult: v => setForm(f => ({ ...f, title_bn:    v })) },
                  { text: form.location,    onResult: v => setForm(f => ({ ...f, location_bn: v })) },
                  { text: form.description, onResult: v => { setForm(f => ({ ...f, description_bn: v })); setBnEditorKey(k => k + 1); }, stripHtml: true },
                ]} />
              </div>

              {/* Title (BN) */}
              <div className="space-y-5">
                <div>
                  <label className={labelBnCls} style={bf}>{pf.nameBnField}</label>
                  <input value={form.title_bn ?? ''} onChange={e => set('title_bn', e.target.value)} className={inputBnCls} style={bf} />
                </div>

                {/* Location (BN) */}
                <div>
                  <label className={labelBnCls} style={bf}>{pf.locationBnField}</label>
                  <input value={form.location_bn ?? ''} onChange={e => set('location_bn', e.target.value)} className={inputBnCls} style={bf} />
                </div>

                {/* Description (BN) */}
                <div>
                  <label className={labelBnCls} style={bf}>{pf.descBnField}</label>
                  <RichEditor key={bnEditorKey} value={form.description_bn ?? ''} onChange={v => set('description_bn', v)} banglaFont />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Image card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-5">
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold" style={{ color: '#2c7be5' }}>{pf.featureImage}</h3>
              <span className="text-[11px] text-white px-2 py-0.5 rounded font-medium" style={{ backgroundColor: '#2c7be5' }}>Size: 1000 × 1400</span>
            </div>
            <ImageUpload value={form.image} onChange={url => set('image', url)} label={`${pf.featureImage} *`} />
          </div>
        </div>

        {/* Gallery Images card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-5">
          <div className="max-w-3xl">
            <GalleryEditor label={pf.galleryImages} hint="Size: 2000 × 1250"
              images={form.galleryImages} onChange={imgs => set('galleryImages', imgs)}
              dropText={pf.dropImages} dropHint={pf.dropHint} uploadedText={pf.uploaded} />
          </div>
        </div>

        {/* Additional Images card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-8">
          <div className="max-w-3xl">
            <GalleryEditor label={pf.additionalImages} hint="Size: 2000 × 1250"
              images={form.additionalImages} onChange={imgs => set('additionalImages', imgs)}
              dropText={pf.dropImages} dropHint={pf.dropHint} uploadedText={pf.uploaded} />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving}
            className="text-white text-sm font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-60"
            style={{ backgroundColor: '#2c7be5' }}>
            {saving ? pf.saving : mode === 'create' ? pf.submit : pf.update}
          </button>
          <button type="button" onClick={() => router.push('/admin/projects')}
            className="text-gray-600 text-sm font-semibold px-8 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            {pf.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
