'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import ImageUpload from '@/components/admin/ImageUpload';
import AutoTranslateButton from '@/components/admin/AutoTranslateButton';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { adminT } from '@/lib/i18n/translations';

interface Slide {
  id: number; image: string;
  title: string; subtitle: string; desc: string;
  title_bn?: string; subtitle_bn?: string; desc_bn?: string;
}
const EMPTY: Omit<Slide, 'id'> = { image: '', title: '', subtitle: '', desc: '', title_bn: '', subtitle_bn: '', desc_bn: '' };

export default function HeroAdmin() {
  const { lang } = useLanguage();
  const tr = adminT(lang);
  const bf = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const [slides,   setSlides]   = useState<Slide[]>([]);
  const [modal,    setModal]    = useState<'edit' | null>(null);
  const [current,  setCurrent]  = useState<Partial<Slide>>(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const d = await fetch('/api/content/hero').then(r => r.json());
    setSlides(d.slides || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    const updated = slides.map(s => s.id === current.id ? { ...s, ...current } : s);
    await fetch('/api/content/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slides: updated }) });
    setSaving(false); setModal(null); load();
  };

  const addNew = async () => {
    const newSlide = { id: Date.now(), ...EMPTY };
    await fetch('/api/content/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slides: [...slides, newSlide] }) });
    setCurrent(newSlide); setModal('edit'); load();
  };

  const del = async (id: number) => {
    await fetch('/api/content/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slides: slides.filter(s => s.id !== id) }) });
    setDeleteId(null); load();
  };

  const field = (key: keyof Slide, label: string, rows?: number) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {rows
        ? <RichTextEditor value={String(current[key] ?? '')} onChange={v => setCurrent({ ...current, [key]: v })} minHeight={rows * 40} />
        : <input value={String(current[key] ?? '')} onChange={e => setCurrent({ ...current, [key]: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />}
    </div>
  );

  const bnField = (key: keyof Slide, label: string, rows?: number) => (
    <div>
      <label className="block text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1.5" style={bf}>{label}</label>
      {rows
        ? <RichTextEditor value={String(current[key] ?? '')} onChange={v => setCurrent({ ...current, [key]: v })} minHeight={rows * 40} />
        : <input value={String(current[key] ?? '')} onChange={e => setCurrent({ ...current, [key]: e.target.value })}
            className="w-full border border-blue-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" style={bf} />}
    </div>
  );

  return (
    <div style={bf}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.hero.pageTitle}</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h6 className="font-semibold text-gray-700 text-sm">{tr.hero.tableTitle}</h6>
          <button onClick={addNew} className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: '#2c7be5' }}>
            <Plus className="w-3.5 h-3.5" /> {tr.hero.createBtn}
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {[tr.hero.colSlide, tr.hero.colTitle, tr.hero.colSubtitle, tr.hero.colDesc, tr.hero.colImage, tr.hero.colActions].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slides.map((s, i) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-sm text-gray-500 font-semibold">#{i + 1}</td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-800 max-w-[150px]" style={bf}>
                  {(lang === 'bn' && s.title_bn) ? s.title_bn : (s.title || <span className="text-gray-300 italic">—</span>)}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 max-w-[150px]" style={bf}>
                  {(lang === 'bn' && s.subtitle_bn) ? s.subtitle_bn : (s.subtitle || <span className="text-gray-300 italic">—</span>)}
                </td>
                <td className="px-6 py-3 text-sm text-gray-500 max-w-[250px]"><p className="line-clamp-2">{s.desc || <span className="text-gray-300 italic">—</span>}</p></td>
                <td className="px-6 py-3">
                  {s.image
                    ? <img src={s.image} alt={s.title} className="w-20 h-12 object-cover rounded-lg border border-gray-100" />
                    : <div className="w-20 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">{tr.common.noImage}</div>}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setCurrent(s); setModal('edit'); }}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ borderColor: '#2c7be5', color: '#2c7be5' }}>
                      <Pencil className="w-3 h-3" /> {tr.common.edit}
                    </button>
                    <button onClick={() => setDeleteId(s.id)}
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

      {modal === 'edit' && current && (
        <Modal title={tr.hero.editTitle} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <ImageUpload value={String(current.image ?? '')} onChange={url => setCurrent({ ...current, image: url })} label={tr.hero.bgImage} />
            {field('title',    tr.hero.headline1)}
            {field('subtitle', tr.hero.headline2)}
            {field('desc',     tr.hero.desc, 3)}

            {/* Bangla fields */}
            <div className="border-t-2 border-dashed border-blue-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">{tr.common.banglaSection}</p>
                <AutoTranslateButton fields={[
                  { text: String(current.title    ?? ''), onResult: v => setCurrent(c => ({ ...c, title_bn:    v })) },
                  { text: String(current.subtitle ?? ''), onResult: v => setCurrent(c => ({ ...c, subtitle_bn: v })) },
                  { text: String(current.desc     ?? ''), onResult: v => setCurrent(c => ({ ...c, desc_bn:     v })) },
                ]} />
              </div>
              {bnField('title_bn',    tr.hero.headline1Bn)}
              {bnField('subtitle_bn', tr.hero.headline2Bn)}
              {bnField('desc_bn',     tr.hero.descBn, 3)}
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">{tr.common.cancel}</button>
              <button onClick={save} disabled={saving} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60" style={{ backgroundColor: '#2c7be5' }}>
                {saving ? tr.common.saving : tr.hero.saveBtn}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title={tr.hero.deleteTitle} onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">{tr.hero.deleteMsg}</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">{tr.common.cancel}</button>
            <button onClick={() => del(deleteId)} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg" style={{ backgroundColor: '#e63757' }}>{tr.hero.deleteBtn}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
