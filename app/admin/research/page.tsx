'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, FileText } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import PdfUpload from '@/components/admin/PdfUpload';
import AutoTranslateButton from '@/components/admin/AutoTranslateButton';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { adminT } from '@/lib/i18n/translations';

interface Publication { id: number; title: string; journal: string; year: string; tags: string[]; abstract: string; pdfFile: string; content: string; title_bn?: string; journal_bn?: string; abstract_bn?: string; }
const EMPTY: Omit<Publication, 'id'> = { title: '', journal: '', year: '', tags: [], abstract: '', pdfFile: '', content: '', title_bn: '', journal_bn: '', abstract_bn: '' };



export default function ResearchAdmin() {
  const { lang } = useLanguage();
  const tr = adminT(lang);
  const bf = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

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

  const field = (key: keyof Publication, label: string, ph = '', rows?: number, isBn = false) => (
    <div>
      <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isBn ? 'text-blue-500' : 'text-gray-500'}`} style={isBn ? bf : {}}>{label}</label>
      {rows
        ? <RichTextEditor value={String(current[key] ?? '')} onChange={v => setCurrent({ ...current, [key]: v })} minHeight={rows * 40} placeholder={ph} />
        : <input value={String(current[key] ?? '')} onChange={e => setCurrent({ ...current, [key]: e.target.value })} placeholder={ph}
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 ${isBn ? 'border-blue-200 focus:border-blue-400 focus:ring-blue-50' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-50'}`} style={isBn ? bf : {}} />}
    </div>
  );

  return (
    <div style={bf}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.research.pageTitle}</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h6 className="font-semibold text-gray-700 text-sm">{tr.research.tableTitle}</h6>
          <button onClick={() => { setCurrent(EMPTY); setTagInput(''); setModal('add'); }}
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: '#2c7be5' }}>
            <Plus className="w-3.5 h-3.5" /> {tr.research.createBtn}
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['#', tr.research.colTitle, tr.research.colJournal, tr.research.colYear, tr.research.colTags, tr.research.colPdf, tr.common.actions].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((p, i) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-sm text-gray-400 w-10">{i + 1}</td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-800 max-w-[260px]" style={bf}>
                  <p className="line-clamp-2">{(lang === 'bn' && p.title_bn) ? p.title_bn : p.title}</p>
                  {lang === 'bn' && p.title_bn && <p className="line-clamp-1 text-xs text-gray-400 font-normal mt-0.5">{p.title}</p>}
                </td>
                <td className="px-6 py-3 text-sm text-gray-500 max-w-[160px]" style={bf}>{(lang === 'bn' && p.journal_bn) ? p.journal_bn : p.journal}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{p.year}</td>
                <td className="px-6 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 2).map(t => <span key={t} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">{t}</span>)}
                    {p.tags.length > 2 && <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">+{p.tags.length - 2}</span>}
                  </div>
                </td>
                <td className="px-6 py-3">
                  {p.pdfFile ? (
                    <a href={p.pdfFile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700">
                      <div className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center"><FileText className="w-3.5 h-3.5" /></div>
                      {tr.research.viewPdf}
                    </a>
                  ) : <span className="text-xs text-gray-300">{tr.common.noPdf}</span>}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setCurrent(p); setTagInput(''); setModal('edit'); }}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ borderColor: '#2c7be5', color: '#2c7be5' }}>
                      <Pencil className="w-3 h-3" /> {tr.common.edit}
                    </button>
                    <button onClick={() => setDeleteId(p.id)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-white font-medium" style={{ backgroundColor: '#e63757' }}>
                      <Trash2 className="w-3 h-3" /> {tr.common.delete}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? tr.research.addTitle : tr.research.editTitle} onClose={() => setModal(null)} size="lg">
          <div className="space-y-4">
            {field('title', tr.research.titleField, 'Full title of the paper')}
            <div className="grid grid-cols-2 gap-4">
              {field('journal', tr.research.journalField)}
              {field('year',    tr.research.yearField, '2024')}
            </div>
            {field('abstract', tr.research.abstractField, 'Short description of the research', 3)}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {tr.research.contentField} <span className="text-gray-300 font-normal normal-case tracking-normal">{tr.research.contentDesc}</span>
              </label>
              <RichTextEditor value={current.content ?? ''} onChange={v => setCurrent({ ...current, content: v })} minHeight={200} />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{tr.research.tagsField}</label>
              <div className="flex gap-2 mb-2">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder={tr.research.tagsPlaceholder}
                  className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                <button type="button" onClick={addTag} className="text-white text-sm px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: '#2c7be5' }}>{tr.research.tagsAddBtn}</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {current.tags?.map(t => (
                  <span key={t} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {t}<button onClick={() => setCurrent({ ...current, tags: current.tags?.filter(x => x !== t) })}><X className="w-3 h-3 ml-0.5" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Bangla fields */}
            <div className="border-t-2 border-dashed border-blue-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">{tr.common.banglaSection}</p>
                <AutoTranslateButton fields={[
                  { text: current.title    ?? '', onResult: v => setCurrent(c => ({ ...c, title_bn:    v })) },
                  { text: current.journal  ?? '', onResult: v => setCurrent(c => ({ ...c, journal_bn:  v })) },
                  { text: current.abstract ?? '', onResult: v => setCurrent(c => ({ ...c, abstract_bn: v })) },
                ]} />
              </div>
              {field('title_bn',    tr.research.titleBnField,   '', undefined, true)}
              <div className="grid grid-cols-2 gap-4">
                {field('journal_bn', tr.research.journalBnField, '', undefined, true)}
              </div>
              {field('abstract_bn', tr.research.abstractBnField, '', 3, true)}
            </div>

            {/* PDF */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{tr.research.pdfTitle}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{tr.research.pdfDesc}</p>
                </div>
                {current.pdfFile && <span className="text-[10px] text-white px-2 py-0.5 rounded font-medium bg-red-500">{tr.research.pdfAttached}</span>}
              </div>
              <PdfUpload value={current.pdfFile ?? ''} onChange={url => setCurrent({ ...current, pdfFile: url })} />
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">{tr.common.cancel}</button>
              <button onClick={save} disabled={saving} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60" style={{ backgroundColor: '#2c7be5' }}>
                {saving ? tr.common.saving : tr.research.saveBtn}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title={tr.research.deleteTitle} onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">{tr.research.deleteMsg}</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">{tr.common.cancel}</button>
            <button onClick={async () => { await fetch(`/api/content/publications/${deleteId}`, { method: 'DELETE' }); setDeleteId(null); load(); }}
              className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg" style={{ backgroundColor: '#e63757' }}>{tr.research.deleteBtn}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
