'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import ImageUpload from '@/components/admin/ImageUpload';
import AutoTranslateButton from '@/components/admin/AutoTranslateButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { adminT } from '@/lib/i18n/translations';

interface Member { id: number; name: string; role: string; expertise: string; image: string; name_bn?: string; role_bn?: string; expertise_bn?: string; }
const EMPTY: Omit<Member, 'id'> = { name: '', role: '', expertise: '', image: '', name_bn: '', role_bn: '', expertise_bn: '' };

export default function TeamAdmin() {
  const { lang } = useLanguage();
  const tr = adminT(lang);
  const bf = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const [items,    setItems]    = useState<Member[]>([]);
  const [modal,    setModal]    = useState<'add' | 'edit' | null>(null);
  const [current,  setCurrent]  = useState<Partial<Member>>(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const d = await fetch('/api/content/team').then(r => r.json());
    setItems(d.members || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    if (modal === 'add') await fetch('/api/content/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    else await fetch(`/api/content/team/${current.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
    setSaving(false); setModal(null); load();
  };

  const field = (key: keyof Member, label: string, ph = '', isBn = false) => (
    <div>
      <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isBn ? 'text-blue-500' : 'text-gray-500'}`} style={isBn ? bf : {}}>{label}</label>
      <input value={String(current[key] ?? '')} onChange={e => setCurrent({ ...current, [key]: e.target.value })} placeholder={ph}
        className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 ${isBn ? 'border-blue-200 focus:border-blue-400 focus:ring-blue-50' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-50'}`} style={isBn ? bf : {}} />
    </div>
  );

  return (
    <div style={bf}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.team.pageTitle}</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h6 className="font-semibold text-gray-700 text-sm">{tr.team.tableTitle}</h6>
          <button onClick={() => { setCurrent(EMPTY); setModal('add'); }}
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: '#2c7be5' }}>
            <Plus className="w-3.5 h-3.5" /> {tr.team.createBtn}
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['#', tr.team.nameField, tr.team.roleField, tr.team.expertiseField, tr.team.profilePhoto, tr.common.actions].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((m, i) => (
              <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-sm text-gray-400 w-10">{i + 1}</td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-800" style={bf}>
                  {(lang === 'bn' && m.name_bn) ? m.name_bn : m.name}
                  {lang === 'bn' && m.name_bn && <span className="block text-xs text-gray-400 font-normal mt-0.5">{m.name}</span>}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600" style={bf}>{(lang === 'bn' && m.role_bn) ? m.role_bn : m.role}</td>
                <td className="px-6 py-3 text-sm text-gray-500" style={bf}>{(lang === 'bn' && m.expertise_bn) ? m.expertise_bn : m.expertise}</td>
                <td className="px-6 py-3">
                  {m.image
                    ? <img src={m.image} alt={m.name} className="w-12 h-12 object-cover object-top rounded-lg border border-gray-100" />
                    : <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-300" /></div>}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setCurrent(m); setModal('edit'); }}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ borderColor: '#2c7be5', color: '#2c7be5' }}>
                      <Pencil className="w-3 h-3" /> {tr.common.edit}
                    </button>
                    <button onClick={() => setDeleteId(m.id)}
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
        <Modal title={modal === 'add' ? tr.team.addTitle : tr.team.editTitle} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {field('name',      tr.team.nameField,      'Dr. Jane Doe')}
            {field('role',      tr.team.roleField,      'Senior Climate Scientist')}
            {field('expertise', tr.team.expertiseField, 'Climate Modeling, IPCC Research')}
            <ImageUpload value={String(current.image ?? '')} onChange={url => setCurrent({ ...current, image: url })} label={tr.team.profilePhoto} />

            {/* Bangla fields */}
            <div className="border-t-2 border-dashed border-blue-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">{tr.common.banglaSection}</p>
                <AutoTranslateButton fields={[
                  { text: current.name      ?? '', onResult: v => setCurrent(c => ({ ...c, name_bn:      v })) },
                  { text: current.role      ?? '', onResult: v => setCurrent(c => ({ ...c, role_bn:      v })) },
                  { text: current.expertise ?? '', onResult: v => setCurrent(c => ({ ...c, expertise_bn: v })) },
                ]} />
              </div>
              {field('name_bn',      tr.team.nameBnField,      '', true)}
              {field('role_bn',      tr.team.roleBnField,      '', true)}
              {field('expertise_bn', tr.team.expertiseBnField, '', true)}
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">{tr.common.cancel}</button>
              <button onClick={save} disabled={saving} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60" style={{ backgroundColor: '#2c7be5' }}>
                {saving ? tr.common.saving : tr.team.saveBtn}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title={tr.team.deleteTitle} onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">{tr.team.deleteMsg}</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">{tr.common.cancel}</button>
            <button onClick={async () => { await fetch(`/api/content/team/${deleteId}`, { method: 'DELETE' }); setDeleteId(null); load(); }}
              className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg" style={{ backgroundColor: '#e63757' }}>{tr.team.deleteBtn}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
