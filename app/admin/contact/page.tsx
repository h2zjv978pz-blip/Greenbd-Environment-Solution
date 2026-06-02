'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import AutoTranslateButton from '@/components/admin/AutoTranslateButton';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { adminT } from '@/lib/i18n/translations';

interface ContactData {
  address: string; phone: string; email: string; mapLabel: string;
  ctaTitle: string; ctaDesc: string; formTitle: string; formDesc: string; subjects: string[];
  mapLabel_bn?: string; ctaTitle_bn?: string; ctaDesc_bn?: string;
  formTitle_bn?: string; formDesc_bn?: string; subjects_bn?: string[];
}
const DEF: ContactData = { address:'', phone:'', email:'', mapLabel:'', ctaTitle:'', ctaDesc:'', formTitle:'', formDesc:'', subjects:[], mapLabel_bn:'', ctaTitle_bn:'', ctaDesc_bn:'', formTitle_bn:'', formDesc_bn:'', subjects_bn:[] };

export default function ContactAdmin() {
  const { lang } = useLanguage();
  const tr = adminT(lang);
  const bf = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const [data,   setData]   = useState<ContactData>(DEF);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    fetch('/api/content/contact').then(r => r.json()).then(d => setData({ ...DEF, ...d }));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/content/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const field = (key: keyof ContactData, label: string, ph = '', rows?: number, isBn = false) => (
    <div>
      <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isBn ? 'text-blue-500' : 'text-gray-500'}`} style={isBn ? bf : {}}>{label}</label>
      {rows
        ? <RichTextEditor value={String(data[key] ?? '')} onChange={v => setData({ ...data, [key]: v })} minHeight={rows * 40} placeholder={ph} />
        : <input value={String(data[key] ?? '')} onChange={e => setData({ ...data, [key]: e.target.value })} placeholder={ph}
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 ${isBn ? 'border-blue-200 focus:border-blue-400 focus:ring-blue-50' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-50'}`} style={isBn ? bf : {}} />}
    </div>
  );

  return (
    <div style={bf}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{tr.contact.pageTitle}</h1>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60"
          style={{ backgroundColor: saved ? '#00d97e' : '#2c7be5' }}>
          <Save className="w-4 h-4" /> {saved ? tr.common.saved : saving ? tr.common.saving : tr.common.save}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* LEFT COLUMN */}
        <div className="space-y-5">
          {/* Contact details — EN only (address/phone/email are universal) */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">{tr.contact.detailsTitle}</h6>
            {field('address',  tr.contact.addressField)}
            {field('phone',    tr.contact.phoneField)}
            {field('email',    tr.contact.emailField)}
            {field('mapLabel', tr.contact.mapLabelField)}
            {field('mapLabel_bn', tr.contact.mapLabelBnField, '', undefined, true)}
          </div>

          {/* Form section */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">{tr.contact.formSectionTitle}</h6>
            {field('formTitle', tr.contact.formHeading)}
            {field('formDesc',  tr.contact.formDesc, '', 2)}
            <div className="border-t-2 border-dashed border-blue-100 pt-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">{tr.common.banglaSection}</p>
                <AutoTranslateButton fields={[
                  { text: data.formTitle, onResult: v => setData(d => ({ ...d, formTitle_bn: v })) },
                  { text: data.formDesc,  onResult: v => setData(d => ({ ...d, formDesc_bn:  v })) },
                ]} />
              </div>
              {field('formTitle_bn', tr.contact.formHeadingBn, '', undefined, true)}
              {field('formDesc_bn',  tr.contact.formDescBn, '', 2, true)}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* CTA section */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">{tr.contact.ctaTitle}</h6>
            {field('ctaTitle', tr.contact.ctaHeading)}
            {field('ctaDesc',  tr.contact.ctaDesc, '', 3)}
            <div className="border-t-2 border-dashed border-blue-100 pt-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">{tr.common.banglaSection}</p>
                <AutoTranslateButton fields={[
                  { text: data.ctaTitle, onResult: v => setData(d => ({ ...d, ctaTitle_bn: v })) },
                  { text: data.ctaDesc,  onResult: v => setData(d => ({ ...d, ctaDesc_bn:  v })) },
                ]} />
              </div>
              {field('ctaTitle_bn', tr.contact.ctaHeadingBn, '', undefined, true)}
              {field('ctaDesc_bn',  tr.contact.ctaDescBn, '', 3, true)}
            </div>
          </div>

          {/* English subjects */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h6 className="font-semibold text-gray-700 text-sm">{tr.contact.subjectsTitle}</h6>
              <button onClick={() => setData({ ...data, subjects: [...data.subjects, ''] })}
                className="flex items-center gap-1 text-xs text-white px-3 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: '#2c7be5' }}>
                <Plus className="w-3 h-3" /> {tr.contact.addSubject}
              </button>
            </div>
            <div className="space-y-2">
              {data.subjects.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={s} onChange={e => { const ss = [...data.subjects]; ss[i] = e.target.value; setData({ ...data, subjects: ss }); }}
                    className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                  <button onClick={() => setData({ ...data, subjects: data.subjects.filter((_, j) => j !== i) })}
                    className="text-red-400 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Bangla subjects */}
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3 mb-4">
              <h6 className="font-semibold text-blue-600 text-sm" style={bf}>{tr.contact.subjectsBnTitle}</h6>
              <button onClick={() => setData({ ...data, subjects_bn: [...(data.subjects_bn ?? []), ''] })}
                className="flex items-center gap-1 text-xs text-white px-3 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: '#2c7be5', ...bf }}>
                <Plus className="w-3 h-3" /> {tr.contact.addSubjectBn}
              </button>
            </div>
            <div className="space-y-2">
              {(data.subjects_bn ?? []).map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={s} onChange={e => { const ss = [...(data.subjects_bn ?? [])]; ss[i] = e.target.value; setData({ ...data, subjects_bn: ss }); }}
                    className="flex-1 border border-blue-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" style={bf} />
                  <button onClick={() => setData({ ...data, subjects_bn: (data.subjects_bn ?? []).filter((_, j) => j !== i) })}
                    className="text-red-400 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
