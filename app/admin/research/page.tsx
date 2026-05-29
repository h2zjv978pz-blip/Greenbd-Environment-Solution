'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Pencil, Trash2, X, FileText, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import PdfUpload from '@/components/admin/PdfUpload';

interface Publication { id: number; title: string; journal: string; year: string; tags: string[]; abstract: string; pdfFile: string; content: string; }
const EMPTY: Omit<Publication, 'id'> = { title: '', journal: '', year: '', tags: [], abstract: '', pdfFile: '', content: '' };

/* ── inline rich-text editor ─────────────────────────────────── */
function RichEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const cmd = (c: string) => { ref.current?.focus(); document.execCommand(c, false); if (ref.current) onChange(ref.current.innerHTML); };
  const toolBtn = (icon: React.ReactNode, c: string, title: string) => (
    <button type="button" title={title} onMouseDown={e => { e.preventDefault(); cmd(c); }}
      className="w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:bg-gray-200 transition-colors">
      {icon}
    </button>
  );
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50">
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        {toolBtn(<Bold className="w-3.5 h-3.5" />, 'bold', 'Bold')}
        {toolBtn(<Italic className="w-3.5 h-3.5" />, 'italic', 'Italic')}
        {toolBtn(<Underline className="w-3.5 h-3.5" />, 'underline', 'Underline')}
        <div className="w-px h-4 bg-gray-300 mx-1" />
        {toolBtn(<List className="w-3.5 h-3.5" />, 'insertUnorderedList', 'Bullet list')}
        {toolBtn(<ListOrdered className="w-3.5 h-3.5" />, 'insertOrderedList', 'Numbered list')}
      </div>
      <div ref={ref} contentEditable suppressContentEditableWarning
        onInput={() => { if (ref.current) onChange(ref.current.innerHTML); }}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[200px] p-3 text-sm text-gray-800 focus:outline-none leading-relaxed"
      />
    </div>
  );
}

export default function ResearchAdmin() {
  const [items,    setItems]    = useState<Publication[]>([]);
  const [modal,    setModal]    = useState<'add' | 'edit' | null>(null);
  const [current,  setCurrent]  = useState<Partial<Publication>>(EMPTY);
  const [tagInput, setTagInput] = useState('');
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const d = await fetch('/api/content/research').then(r => r.json());
    setItems(d.publications || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    if (modal === 'add') await fetch('/api/content/publications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    else await fetch(`/api/content/publications/${current.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    setSaving(false); setModal(null); load();
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !current.tags?.includes(t)) setCurrent({ ...current, tags: [...(current.tags || []), t] });
    setTagInput('');
  };

  const tf = (key: keyof Publication, label: string, ph = '', rows?: number) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {rows
        ? <textarea value={String(current[key] ?? '')} onChange={e => setCurrent({ ...current, [key]: e.target.value })} rows={rows} placeholder={ph}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 resize-none" />
        : <input value={String(current[key] ?? '')} onChange={e => setCurrent({ ...current, [key]: e.target.value })} placeholder={ph}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">List of Research & Publications</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h6 className="font-semibold text-gray-700 text-sm">Research & Publications</h6>
          <button onClick={() => { setCurrent(EMPTY); setTagInput(''); setModal('add'); }}
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: '#2c7be5' }}>
            <Plus className="w-3.5 h-3.5" /> Create Publication
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['#', 'Title', 'Journal', 'Year', 'Tags', 'PDF', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((p, i) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-sm text-gray-400 w-10">{i + 1}</td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-800 max-w-[260px]">
                  <p className="line-clamp-2">{p.title}</p>
                </td>
                <td className="px-6 py-3 text-sm text-gray-500 max-w-[160px]">{p.journal}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{p.year}</td>
                <td className="px-6 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">{t}</span>
                    ))}
                    {p.tags.length > 2 && <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">+{p.tags.length - 2}</span>}
                  </div>
                </td>
                {/* PDF status */}
                <td className="px-6 py-3">
                  {p.pdfFile ? (
                    <a href={p.pdfFile} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition-colors">
                      <div className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      View PDF
                    </a>
                  ) : (
                    <span className="text-xs text-gray-300">No PDF</span>
                  )}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setCurrent(p); setTagInput(''); setModal('edit'); }}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ borderColor: '#2c7be5', color: '#2c7be5' }}>
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => setDeleteId(p.id)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-white font-medium" style={{ backgroundColor: '#e63757' }}>
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <Modal title={modal === 'add' ? 'Create Publication' : 'Edit Publication'} onClose={() => setModal(null)} size="lg">
          <div className="space-y-4">
            {tf('title', 'Paper Title *', 'Full title of the paper')}
            <div className="grid grid-cols-2 gap-4">
              {tf('journal', 'Journal / Conference')}
              {tf('year', 'Year', '2024')}
            </div>
            {tf('abstract', 'Abstract', 'Short description of the research', 3)}

            {/* Content Body — full readable paper text */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Content Body <span className="text-gray-300 font-normal normal-case tracking-normal">(full paper text — readable on the detail page)</span>
              </label>
              <RichEditor value={current.content ?? ''} onChange={v => setCurrent({ ...current, content: v })} />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tags</label>
              <div className="flex gap-2 mb-2">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder="Add tag, press Enter"
                  className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                <button type="button" onClick={addTag}
                  className="text-white text-sm px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: '#2c7be5' }}>Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {current.tags?.map(t => (
                  <span key={t} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {t}
                    <button onClick={() => setCurrent({ ...current, tags: current.tags?.filter(x => x !== t) })}>
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* PDF File — matches reference screenshot */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">PDF File</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Upload the full paper as PDF. Max 20 MB.</p>
                </div>
                {current.pdfFile && (
                  <span className="text-[10px] text-white px-2 py-0.5 rounded font-medium bg-red-500">PDF Attached</span>
                )}
              </div>
              <PdfUpload
                value={current.pdfFile ?? ''}
                onChange={url => setCurrent({ ...current, pdfFile: url })}
              />
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">Cancel</button>
              <button onClick={save} disabled={saving}
                className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60" style={{ backgroundColor: '#2c7be5' }}>
                {saving ? 'Saving…' : 'Save Publication'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Publication?" onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">This publication will be permanently removed.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">Cancel</button>
            <button onClick={async () => { await fetch(`/api/content/publications/${deleteId}`, { method: 'DELETE' }); setDeleteId(null); load(); }}
              className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg" style={{ backgroundColor: '#e63757' }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
