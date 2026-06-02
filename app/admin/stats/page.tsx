'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import AutoTranslateButton from '@/components/admin/AutoTranslateButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { adminT } from '@/lib/i18n/translations';

interface Stat { id: number; value: number; suffix: string; label: string; desc: string; label_bn?: string; desc_bn?: string; }
const EMPTY: Omit<Stat, 'id'> = { value: 0, suffix: '+', label: '', desc: '', label_bn: '', desc_bn: '' };

export default function StatsAdmin() {
  const { lang } = useLanguage();
  const tr = adminT(lang);
  const bf = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const [items,    setItems]    = useState<Stat[]>([]);
  const [modal,    setModal]    = useState<'add' | 'edit' | null>(null);
  const [current,  setCurrent]  = useState<Partial<Stat>>(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const d = await fetch('/api/content/stats').then(r => r.json());
    setItems(d.stats || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    if (modal === 'add') await fetch('/api/content/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    else await fetch(`/api/content/stats/${current.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    setSaving(false); setModal(null); load();
  };

  return (
    <div style={bf}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.stats.pageTitle}</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h6 className="font-semibold text-gray-700 text-sm">{tr.stats.tableTitle}</h6>
          <button onClick={() => { setCurrent(EMPTY); setModal('add'); }}
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: '#2c7be5' }}>
            <Plus className="w-3.5 h-3.5" /> {tr.stats.createBtn}
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['#', tr.stats.valueField, tr.stats.suffixField, tr.stats.labelField, tr.stats.descField, tr.common.actions].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((s, i) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3.5 text-sm text-gray-400 w-10">{i + 1}</td>
                <td className="px-6 py-3.5 text-2xl font-bold text-blue-600 font-heading">{s.value}</td>
                <td className="px-6 py-3.5 text-lg font-bold text-gray-500">{s.suffix}</td>
                <td className="px-6 py-3.5 text-sm font-semibold text-gray-800" style={bf}>{(lang === 'bn' && s.label_bn) ? s.label_bn : s.label}</td>
                <td className="px-6 py-3.5 text-sm text-gray-500" style={bf}>{(lang === 'bn' && s.desc_bn) ? s.desc_bn : s.desc}</td>
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
        <Modal title={modal === 'add' ? tr.stats.addTitle : tr.stats.editTitle} onClose={() => setModal(null)} size="sm">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{tr.stats.valueField}</label>
                <input type="number" value={current.value ?? ''} onChange={e => setCurrent({ ...current, value: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{tr.stats.suffixField}</label>
                <input value={current.suffix ?? ''} onChange={e => setCurrent({ ...current, suffix: e.target.value })} placeholder="e.g. + or %"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{tr.stats.labelField}</label>
              <input value={current.label ?? ''} onChange={e => setCurrent({ ...current, label: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{tr.stats.descField}</label>
              <input value={current.desc ?? ''} onChange={e => setCurrent({ ...current, desc: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
            </div>

            {/* Bangla fields */}
            <div className="border-t-2 border-dashed border-blue-100 pt-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">{tr.common.banglaSection}</p>
                <AutoTranslateButton fields={[
                  { text: current.label ?? '', onResult: v => setCurrent(c => ({ ...c, label_bn: v })) },
                  { text: current.desc  ?? '', onResult: v => setCurrent(c => ({ ...c, desc_bn:  v })) },
                ]} />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1.5" style={bf}>{tr.stats.labelBnField}</label>
                  <input value={current.label_bn ?? ''} onChange={e => setCurrent({ ...current, label_bn: e.target.value })}
                    className="w-full border border-blue-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" style={bf} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1.5" style={bf}>{tr.stats.descBnField}</label>
                  <input value={current.desc_bn ?? ''} onChange={e => setCurrent({ ...current, desc_bn: e.target.value })}
                    className="w-full border border-blue-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" style={bf} />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">{tr.common.cancel}</button>
              <button onClick={save} disabled={saving} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60" style={{ backgroundColor: '#2c7be5' }}>
                {saving ? tr.common.saving : tr.stats.saveBtn}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title={tr.stats.deleteTitle} onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">{tr.stats.deleteMsg}</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">{tr.common.cancel}</button>
            <button onClick={async () => { await fetch(`/api/content/stats/${deleteId}`, { method: 'DELETE' }); setDeleteId(null); load(); }}
              className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg" style={{ backgroundColor: '#e63757' }}>{tr.stats.deleteBtn}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
