'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import AutoTranslateButton from '@/components/admin/AutoTranslateButton';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { adminT } from '@/lib/i18n/translations';

const ICONS  = ['Leaf','Map','Cloud','Shield','BarChart3','BookOpen','Users','Globe','Recycle','Star','Zap','Heart'];
const COLORS = ['bg-green-50 text-green-600','bg-blue-50 text-blue-600','bg-sky-50 text-sky-600','bg-red-50 text-red-600','bg-purple-50 text-purple-600','bg-yellow-50 text-yellow-600','bg-orange-50 text-orange-600','bg-teal-50 text-teal-600','bg-lime-50 text-lime-600'];

interface Service { id: number; icon: string; title: string; desc: string; color: string; title_bn?: string; desc_bn?: string; }
const EMPTY: Omit<Service, 'id'> = { icon: 'Leaf', title: '', desc: '', color: COLORS[0], title_bn: '', desc_bn: '' };

export default function ServicesAdmin() {
  const { lang } = useLanguage();
  const tr = adminT(lang);
  const bf = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const [items,    setItems]    = useState<Service[]>([]);
  const [modal,    setModal]    = useState<'add' | 'edit' | null>(null);
  const [current,  setCurrent]  = useState<Partial<Service>>(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const d = await fetch('/api/content/services').then(r => r.json());
    setItems(d.services || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    if (modal === 'add') await fetch('/api/content/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    else await fetch(`/api/content/services/${current.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    setSaving(false); setModal(null); load();
  };

  const inp = (key: keyof Service, label: string, rows?: number, isBn = false) => (
    <div>
      <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isBn ? 'text-blue-500' : 'text-gray-500'}`} style={isBn ? bf : {}}>{label}</label>
      {rows
        ? <RichTextEditor value={String(current[key] ?? '')} onChange={v => setCurrent({ ...current, [key]: v })} minHeight={rows * 40} />
        : <input value={String(current[key] ?? '')} onChange={e => setCurrent({ ...current, [key]: e.target.value })}
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 ${isBn ? 'border-blue-200 focus:border-blue-400 focus:ring-blue-50' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-50'}`} style={isBn ? bf : {}} />}
    </div>
  );

  return (
    <div style={bf}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.services.pageTitle}</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h6 className="font-semibold text-gray-700 text-sm">{tr.services.tableTitle}</h6>
          <button onClick={() => { setCurrent(EMPTY); setModal('add'); }}
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: '#2c7be5' }}>
            <Plus className="w-3.5 h-3.5" /> {tr.services.createBtn}
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['#', tr.services.iconField, tr.services.titleField, tr.services.descField, tr.common.actions].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((s, i) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3.5 text-sm text-gray-400 w-10">{i + 1}</td>
                <td className="px-6 py-3.5"><span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${s.color}`}>{s.icon.slice(0, 2)}</span></td>
                <td className="px-6 py-3.5 text-sm font-semibold text-gray-800 max-w-[200px]" style={bf}>
                  {(lang === 'bn' && s.title_bn) ? s.title_bn : s.title}
                  {lang === 'bn' && s.title_bn && <span className="block text-xs text-gray-400 font-normal mt-0.5">{s.title}</span>}
                </td>
                <td className="px-6 py-3.5 text-sm text-gray-500 max-w-[360px]" style={bf}>
                  <p className="line-clamp-2">{(lang === 'bn' && s.desc_bn) ? s.desc_bn : s.desc}</p>
                </td>
                <td className="px-6 py-3.5">
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

      {modal && (
        <Modal title={modal === 'add' ? tr.services.addTitle : tr.services.editTitle} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {inp('title', tr.services.titleField)}
            {inp('desc',  tr.services.descField, 3)}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{tr.services.iconField}</label>
              <select value={current.icon ?? ''} onChange={e => setCurrent({ ...current, icon: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                {ICONS.map(ic => <option key={ic}>{ic}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{tr.services.colorField}</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setCurrent({ ...current, color: c })}
                    className={`w-8 h-8 rounded-lg border-2 ${c} ${current.color === c ? 'border-gray-700 scale-110' : 'border-transparent'} transition-all`} />
                ))}
              </div>
            </div>

            {/* Bangla section */}
            <div className="border-t-2 border-dashed border-blue-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">{tr.common.banglaSection}</p>
                <AutoTranslateButton fields={[
                  { text: current.title ?? '', onResult: v => setCurrent(c => ({ ...c, title_bn: v })) },
                  { text: current.desc  ?? '', onResult: v => setCurrent(c => ({ ...c, desc_bn:  v })) },
                ]} />
              </div>
              {inp('title_bn', tr.services.titleBnField, undefined, true)}
              {inp('desc_bn',  tr.services.descBnField, 3, true)}
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">{tr.common.cancel}</button>
              <button onClick={save} disabled={saving} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60" style={{ backgroundColor: '#2c7be5' }}>
                {saving ? tr.common.saving : tr.services.saveBtn}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title={tr.services.deleteTitle} onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">{tr.services.deleteMsg}</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">{tr.common.cancel}</button>
            <button onClick={async () => { await fetch(`/api/content/services/${deleteId}`, { method: 'DELETE' }); setDeleteId(null); load(); }}
              className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg" style={{ backgroundColor: '#e63757' }}>{tr.services.deleteBtn}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
