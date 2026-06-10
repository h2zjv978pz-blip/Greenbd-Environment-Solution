'use client';

import { useRef, useState, useEffect, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Undo, Redo, X, ImageIcon, Upload, Loader2, CheckCircle2, GripVertical, Plus,
} from 'lucide-react';
import ImageUpload from './ImageUpload';
import AutoTranslateButton from './AutoTranslateButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { adminT } from '@/lib/i18n/translations';

const CATEGORIES = [
  'Climate',
  'GIS/RS',
  'Research',
  'Disaster Risk',
  'Sustainability',
  'Community',
  'EIA',
  'Environmental Management',
  'Water Resources',
  'Biodiversity',
  'Coastal Management',
  'Flood Management',
  'Air Quality',
  'River Erosion',
  'Renewable Energy',
  'Urban Planning',
  'Carbon Assessment',
  'Climate Resilience',
];

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
  annotatedImages?: { url: string; caption: string; position?: number }[];
  hidden?: boolean;
}

const EMPTY: ProjectData = {
  title: '', title_bn: '', category: 'Climate', clientName: '', location: '', location_bn: '',
  projectTime: '', description: '', description_bn: '', image: '', galleryImages: [], additionalImages: [],
  annotatedImages: [],
};

interface Props { initial?: Partial<ProjectData>; mode: 'create' | 'edit'; }

/* ── Rich-text toolbar ─────────────────────────────────────────────── */
function RichEditor({ value, onChange, banglaFont = false }: { value: string; onChange: (v: string) => void; banglaFont?: boolean }) {
  const ref        = useRef<HTMLDivElement>(null);
  const lastVal    = useRef('');
  const savedRange = useRef<Range | null>(null);
  const imgFileRef = useRef<HTMLInputElement>(null);

  const [showImg,    setShowImg]    = useState(false);
  const [imgUrl,     setImgUrl]     = useState('');
  const [imgCaption, setImgCaption] = useState('');
  const [imgAlign,   setImgAlign]   = useState<'left'|'center'|'right'>('center');
  const [imgWidth,   setImgWidth]   = useState('100%');
  const [imgUploading, setImgUploading] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (value !== lastVal.current) {
      ref.current.innerHTML = value ?? '';
      lastVal.current = value ?? '';
    }
  }, [value]);

  const emit = () => {
    if (!ref.current) return;
    lastVal.current = ref.current.innerHTML;
    onChange(ref.current.innerHTML);
  };

  const prepare = () => {
    try {
      document.execCommand('styleWithCSS',            false, 'true');
      document.execCommand('defaultParagraphSeparator', false, 'p');
    } catch {}
  };

  const cmd = (command: string, arg?: string) => {
    ref.current?.focus();
    prepare();
    document.execCommand(command, false, arg);
    emit();
  };

  const isActive = (command: string) => {
    try { return document.queryCommandState(command); } catch { return false; }
  };

  const tb = (icon: React.ReactNode, command: string, title: string, arg?: string) => {
    const active = isActive(command);
    return (
      <button type="button" title={title}
        onMouseDown={e => { e.preventDefault(); cmd(command, arg); }}
        className={`w-7 h-7 flex items-center justify-center rounded transition-colors flex-shrink-0
          ${active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}>
        {icon}
      </button>
    );
  };

  // Save cursor position before opening the image panel
  const openImgPanel = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
    setShowImg(v => !v);
  };

  // Restore cursor and insert <figure> with image + optional caption
  const insertImage = () => {
    if (!imgUrl.trim()) return;
    const marginMap = { left: '0 1rem 1rem 0', center: '1rem auto', right: '0 0 1rem 1rem' };
    const floatMap  = { left: 'left', center: 'none', right: 'right' };
    const html = `<figure style="display:block;margin:${marginMap[imgAlign]};float:${floatMap[imgAlign]};width:${imgWidth};max-width:100%;clear:${imgAlign==='center'?'both':'none'}">` +
      `<img src="${imgUrl}" alt="${imgCaption}" style="width:100%;height:auto;border-radius:6px;display:block;" />` +
      (imgCaption ? `<figcaption style="text-align:center;font-size:0.8em;color:#6b7280;margin-top:4px;">${imgCaption}</figcaption>` : '') +
      `</figure>`;

    ref.current?.focus();
    const sel = window.getSelection();
    if (savedRange.current) {
      sel?.removeAllRanges();
      sel?.addRange(savedRange.current);
    }
    document.execCommand('insertHTML', false, html);
    emit();
    // Reset panel
    setImgUrl(''); setImgCaption(''); setImgAlign('center'); setImgWidth('100%'); setShowImg(false);
  };

  const uploadImgFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImgUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setImgUrl(data.url);
    } finally { setImgUploading(false); }
  };

  const SEP = <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0" />;

  return (
    <div className={`border rounded-lg overflow-hidden transition-all focus-within:ring-2 ${banglaFont ? 'border-blue-200 focus-within:border-blue-400 focus-within:ring-blue-50' : 'border-gray-200 focus-within:border-blue-400 focus-within:ring-blue-50'}`}>
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200 flex-wrap">
        {tb(<Bold          className="w-3.5 h-3.5" />, 'bold',              'Bold')}
        {tb(<Italic        className="w-3.5 h-3.5" />, 'italic',            'Italic')}
        {tb(<Underline     className="w-3.5 h-3.5" />, 'underline',         'Underline')}
        {tb(<Strikethrough className="w-3.5 h-3.5" />, 'strikeThrough',     'Strikethrough')}
        {SEP}
        {tb(<AlignLeft     className="w-3.5 h-3.5" />, 'justifyLeft',   'Align Left')}
        {tb(<AlignCenter   className="w-3.5 h-3.5" />, 'justifyCenter', 'Align Center')}
        {tb(<AlignRight    className="w-3.5 h-3.5" />, 'justifyRight',  'Align Right')}
        {tb(<AlignJustify  className="w-3.5 h-3.5" />, 'justifyFull',   'Justify')}
        {SEP}
        {tb(<List          className="w-3.5 h-3.5" />, 'insertUnorderedList', 'Bullet List')}
        {tb(<ListOrdered   className="w-3.5 h-3.5" />, 'insertOrderedList',   'Numbered List')}
        {SEP}
        {tb(<Undo          className="w-3.5 h-3.5" />, 'undo', 'Undo')}
        {tb(<Redo          className="w-3.5 h-3.5" />, 'redo', 'Redo')}
        {SEP}
        <select onMouseDown={e => e.stopPropagation()} onChange={e => cmd('fontSize', e.target.value)}
          className="text-xs bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-600 focus:outline-none">
          <option value="">Size</option>
          {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{['8pt','10pt','12pt','14pt','18pt','24pt','36pt'][n-1]}</option>)}
        </select>
        {SEP}
        {/* Insert Image */}
        <button type="button" title="Insert inline image" onMouseDown={e => { e.preventDefault(); openImgPanel(); }}
          className={`w-7 h-7 flex items-center justify-center rounded transition-colors flex-shrink-0 ${showImg ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}>
          <ImageIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Inline image insert panel ── */}
      {showImg && (
        <div className="bg-blue-50 border-b border-blue-100 px-3 py-3 space-y-2">
          <p className="text-xs font-semibold text-blue-600 mb-1">Insert Image at cursor</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => imgFileRef.current?.click()} disabled={imgUploading}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 flex-shrink-0">
              <Upload className="w-3 h-3" />
              {imgUploading ? 'Uploading…' : 'Upload'}
            </button>
            <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="or paste image URL…"
              className="flex-1 border border-blue-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400 bg-white" />
          </div>
          {imgUrl && <img src={imgUrl} alt="preview" className="h-16 rounded border border-blue-100 object-contain bg-white" />}
          <input value={imgCaption} onChange={e => setImgCaption(e.target.value)} placeholder="Caption (optional)"
            className="w-full border border-blue-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400 bg-white" />
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex gap-1">
              {(['left','center','right'] as const).map(a => (
                <button key={a} type="button" onClick={() => setImgAlign(a)}
                  className={`text-[10px] px-2 py-1 rounded border font-semibold transition-colors ${imgAlign===a ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                  {a.charAt(0).toUpperCase()+a.slice(1)}
                </button>
              ))}
            </div>
            <select value={imgWidth} onChange={e => setImgWidth(e.target.value)}
              className="text-xs border border-blue-200 rounded px-2 py-1 bg-white focus:outline-none">
              <option value="100%">Full width</option>
              <option value="75%">75%</option>
              <option value="50%">Half width</option>
              <option value="33%">One third</option>
              <option value="25%">Quarter</option>
            </select>
            <button type="button" onClick={insertImage} disabled={!imgUrl.trim()}
              className="ml-auto text-xs font-semibold px-4 py-1.5 rounded text-white disabled:opacity-40"
              style={{ backgroundColor: '#2c7be5' }}>
              Insert
            </button>
            <button type="button" onClick={() => setShowImg(false)}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5">Cancel</button>
          </div>
          <input ref={imgFileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadImgFile(f); e.target.value = ''; }} />
        </div>
      )}

      {/* ── Editable area ── */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onFocus={prepare}
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
  const [dropZoneDragging, setDropZoneDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done,      setDone]      = useState(0);
  const [total,     setTotal]     = useState(0);
  const [urlInputs, setUrlInputs] = useState<string[]>([]);
  const [reorderSrc,  setReorderSrc]  = useState<number | null>(null);
  const [reorderOver, setReorderOver] = useState<number | null>(null);

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

  // Reorder drag handlers — only fires when dragging starts from the grip handle
  const onReorderStart = (e: React.DragEvent, i: number) => {
    setReorderSrc(i);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(i));
  };
  const onReorderOver = (e: React.DragEvent, i: number) => {
    if (reorderSrc === null) return; // not a reorder drag
    e.preventDefault(); e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (i !== reorderSrc) setReorderOver(i);
  };
  const onReorderDrop = (e: React.DragEvent, toIdx: number) => {
    if (reorderSrc === null) return;
    e.preventDefault(); e.stopPropagation();
    if (reorderSrc !== toIdx) {
      const arr = [...images];
      const [el] = arr.splice(reorderSrc, 1);
      arr.splice(toIdx, 0, el);
      onChange(arr);
    }
    setReorderSrc(null); setReorderOver(null);
  };
  const onReorderEnd = () => { setReorderSrc(null); setReorderOver(null); };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold" style={{ color: '#2c7be5' }}>{label}</h3>
        <span className="text-[11px] text-white px-2 py-0.5 rounded font-medium" style={{ backgroundColor: '#2c7be5' }}>{hint}</span>
      </div>

      {/* Drop zone — file upload only */}
      <div
        onDragOver={e => { if (reorderSrc !== null) return; e.preventDefault(); setDropZoneDragging(true); }}
        onDragLeave={() => setDropZoneDragging(false)}
        onDrop={(e: DragEvent<HTMLDivElement>) => { if (reorderSrc !== null) return; e.preventDefault(); setDropZoneDragging(false); uploadFiles(Array.from(e.dataTransfer.files)); }}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all mb-4 select-none ${dropZoneDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'} ${uploading ? 'pointer-events-none opacity-70' : ''}`}>
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

      {/* Image grid with reorder */}
      {images.length > 0 && (
        <>
          {images.length > 1 && (
            <p className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
              <GripVertical className="w-3 h-3" /> Drag the grip handle to reorder
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {images.map((img, i) => {
              const isDragging = reorderSrc === i;
              const isOver     = reorderOver === i && reorderSrc !== null && reorderSrc !== i;
              return (
                <div
                  key={i}
                  onDragOver={e => onReorderOver(e, i)}
                  onDrop={e => onReorderDrop(e, i)}
                  onDragEnd={onReorderEnd}
                  className={`relative group rounded-xl overflow-hidden border bg-gray-50 transition-all ${
                    isDragging ? 'opacity-40 scale-95 border-blue-300' :
                    isOver     ? 'border-blue-400 shadow-lg scale-[1.02]' :
                    'border-gray-200'
                  }`}
                >
                  {/* Grip handle — initiates reorder drag */}
                  {img && (
                    <div
                      draggable
                      onDragStart={e => onReorderStart(e, i)}
                      className="absolute top-1.5 left-1.5 z-10 w-6 h-6 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-3 h-3" />
                    </div>
                  )}

                  {/* Order badge */}
                  <div className="absolute top-1.5 right-8 z-10 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    #{i + 1}
                  </div>

                  {img ? <img src={img} alt={`Image ${i+1}`} className="w-full aspect-video object-cover" />
                       : <div className="w-full aspect-video flex items-center justify-center bg-gray-100"><ImageIcon className="w-6 h-6 text-gray-300" /></div>}

                  {img && (
                    <div className="absolute bottom-1.5 left-1.5 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
                      {img.startsWith('/api/uploads/') ? uploadedText : 'URL'}
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
              );
            })}
          </div>
        </>
      )}
      {images.length > 0 && <p className="text-xs text-gray-400 mb-2">{images.length} image{images.length !== 1 ? 's' : ''} added</p>}
    </div>
  );
}

/* ── Annotated images editor ─────────────────────────────────────────── */
type AnnotatedItem = { url: string; caption: string; position?: number };

function AnnotatedImagesEditor({
  items, onChange,
}: {
  items: AnnotatedItem[];
  onChange: (v: AnnotatedItem[]) => void;
}) {
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [uploading, setUploading] = useState<number | null>(null);
  const [dragSrc,   setDragSrc]   = useState<number | null>(null);
  const [dragOver,  setDragOver]  = useState<number | null>(null);

  const add    = () => onChange([...items, { url: '', caption: '', position: undefined }]);
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const upd    = (i: number, patch: Partial<AnnotatedItem>) =>
    onChange(items.map((it, j) => j === i ? { ...it, ...patch } : it));

  const uploadFile = async (i: number, file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(i);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res  = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) upd(i, { url: data.url });
    } finally { setUploading(null); }
  };

  const onDrop = (toIdx: number) => {
    if (dragSrc === null || dragSrc === toIdx) { setDragSrc(null); setDragOver(null); return; }
    const arr = [...items];
    const [el] = arr.splice(dragSrc, 1);
    arr.splice(toIdx, 0, el);
    onChange(arr); setDragSrc(null); setDragOver(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold" style={{ color: '#2c7be5' }}>Overview Paragraph Images</h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white px-2 py-0.5 rounded font-medium" style={{ backgroundColor: '#2c7be5' }}>Image + Caption + Position</span>
          <button type="button" onClick={add}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
            style={{ backgroundColor: '#00d97e' }}>
            <Plus className="w-3.5 h-3.5" /> Add Image
          </button>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 mb-3">
        Upload images that will appear inline within the Project Overview text. Set "Insert after paragraph" to control placement — the image appears right after that paragraph on the public page.
      </p>

      {items.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
          No overview images yet — click "Add Image" to insert images between paragraphs
        </p>
      )}

      <div className="space-y-3">
        {items.map((item, i) => {
          const isDragging = dragSrc === i;
          const isOver     = dragOver === i && dragSrc !== null && dragSrc !== i;
          return (
            <div key={i}
              onDragOver={e => { e.preventDefault(); if (i !== dragSrc) setDragOver(i); }}
              onDrop={e => { e.preventDefault(); onDrop(i); }}
              onDragEnd={() => { setDragSrc(null); setDragOver(null); }}
              className={`flex gap-3 p-3 rounded-xl border bg-white transition-all ${
                isDragging ? 'opacity-40 scale-95 border-blue-300' :
                isOver     ? 'border-blue-400 shadow-md' : 'border-gray-100'
              }`}
            >
              {/* Grip */}
              <div draggable onDragStart={e => { setDragSrc(i); e.dataTransfer.effectAllowed = 'move'; }}
                className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 pt-2">
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Image preview + upload */}
              <div className="flex-shrink-0">
                {item.url
                  ? <img src={item.url} alt={item.caption} className="w-20 h-14 object-cover rounded-lg border border-gray-200" />
                  : <div className="w-20 h-14 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50"><ImageIcon className="w-5 h-5 text-gray-300" /></div>
                }
                <button type="button" onClick={() => fileRefs.current[i]?.click()}
                  disabled={uploading === i}
                  className="mt-1 w-20 text-center text-[10px] font-semibold text-blue-600 hover:underline">
                  {uploading === i ? 'Uploading…' : 'Upload'}
                </button>
                <input ref={el => { fileRefs.current[i] = el; }} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(i, f); e.target.value = ''; }} />
              </div>

              {/* URL + Caption + Position */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <input value={item.url} onChange={e => upd(i, { url: e.target.value })} placeholder="Image URL…"
                  className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-400" />
                <input value={item.caption} onChange={e => upd(i, { caption: e.target.value })} placeholder="Caption / annotation text…"
                  className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-400 font-medium" />
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-gray-400 font-medium flex-shrink-0">Insert after paragraph:</label>
                  <select
                    value={item.position ?? ''}
                    onChange={e => upd(i, { position: e.target.value ? Number(e.target.value) : undefined })}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-400 bg-white">
                    <option value="">End of overview (default)</option>
                    {Array.from({ length: 20 }, (_, idx) => idx + 1).map(n => (
                      <option key={n} value={n}>Paragraph {n}</option>
                    ))}
                    <option value="-1">End of page (bottom)</option>
                  </select>
                </div>
              </div>

              {/* Remove */}
              <button type="button" onClick={() => remove(i)}
                className="flex-shrink-0 p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors self-start">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
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
      router.refresh();
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
      {/* Sticky save bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm -mx-6 px-6 py-3 mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 truncate">
          {mode === 'create' ? pf.createTitle : pf.editTitle}
        </h1>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.push('/admin/projects')}
            className="text-gray-600 text-sm font-semibold px-5 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            {pf.cancel}
          </button>
          <button type="submit" form="project-form" disabled={saving}
            className="flex items-center gap-2 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-60"
            style={{ backgroundColor: saving ? '#6b9bd2' : '#2c7be5' }}>
            {saving && <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {saving ? pf.saving : mode === 'create' ? pf.submit : pf.update}
          </button>
        </div>
      </div>

      <form id="project-form" onSubmit={handleSubmit}>
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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-5">
          <div className="max-w-3xl">
            <GalleryEditor label={pf.additionalImages} hint="Size: 2000 × 1250"
              images={form.additionalImages} onChange={imgs => set('additionalImages', imgs)}
              dropText={pf.dropImages} dropHint={pf.dropHint} uploadedText={pf.uploaded} />
            <p className="text-xs text-gray-400 mt-2">{pf.additionalImagesHint}</p>
          </div>
        </div>

        {/* Annotated Images card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-8">
          <div className="max-w-3xl">
            <AnnotatedImagesEditor
              items={form.annotatedImages ?? []}
              onChange={imgs => set('annotatedImages', imgs)}
            />
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
