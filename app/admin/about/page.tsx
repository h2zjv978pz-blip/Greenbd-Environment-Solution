'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, GripVertical, ChevronUp, ChevronDown, Pencil, Check, X } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import AutoTranslateButton from '@/components/admin/AutoTranslateButton';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { adminT } from '@/lib/i18n/translations';

/* ── Reorderable, editable highlights list ────────────────────────────── */
interface HighlightsListProps {
  items: string[];
  onChange: (items: string[]) => void;
  title: string;
  addLabel: string;
  emptyLabel: string;
  accentColor: string;
  borderClass: string;
  inputClass: string;
  titleClass: string;
  isBangla?: boolean;
  banglaFont?: React.CSSProperties;
}

function HighlightsList({
  items, onChange, title, addLabel, emptyLabel,
  accentColor, borderClass, inputClass, titleClass,
  isBangla, banglaFont = {},
}: HighlightsListProps) {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editVal, setEditVal] = useState('');

  const move = (i: number, dir: -1 | 1) => {
    const arr = [...items];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
    if (editIdx === i) setEditIdx(j);
    else if (editIdx === j) setEditIdx(i);
  };

  const startEdit = (i: number) => { setEditIdx(i); setEditVal(items[i]); };

  const commitEdit = () => {
    if (editIdx === null) return;
    const arr = [...items]; arr[editIdx] = editVal;
    onChange(arr); setEditIdx(null);
  };

  const cancelEdit = () => setEditIdx(null);

  const remove = (i: number) => {
    onChange(items.filter((_, j) => j !== i));
    if (editIdx === i) setEditIdx(null);
  };

  const add = () => {
    const arr = [...items, ''];
    onChange(arr);
    setEditIdx(arr.length - 1);
    setEditVal('');
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-6 ${borderClass}`}>
      <div className={`flex items-center justify-between mb-4 border-b pb-3 ${borderClass}`}>
        <h6 className={`font-semibold text-sm ${titleClass}`} style={isBangla ? banglaFont : {}}>
          {title}
        </h6>
        <button onClick={add}
          className="flex items-center gap-1 text-xs text-white px-3 py-1.5 rounded-lg font-semibold"
          style={{ backgroundColor: accentColor, ...(isBangla ? banglaFont : {}) }}>
          <Plus className="w-3 h-3" /> {addLabel}
        </button>
      </div>

      <div className="space-y-1.5">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4" style={isBangla ? banglaFont : {}}>
            {emptyLabel}
          </p>
        )}

        {items.map((h, i) => (
          <div key={i}
            className="group flex items-center gap-1.5 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all px-1 py-0.5">

            {/* Drag handle (visual only) */}
            <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-400 flex-shrink-0 cursor-grab" />

            {/* Up / Down */}
            <div className="flex flex-col gap-0">
              <button onClick={() => move(i, -1)} disabled={i === 0}
                className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
                title="Move up">
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1}
                className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
                title="Move down">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Text — view or edit */}
            {editIdx === i ? (
              <>
                <input
                  autoFocus
                  value={editVal}
                  onChange={e => setEditVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') cancelEdit(); }}
                  className={`flex-1 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-50 ${inputClass}`}
                  style={isBangla ? banglaFont : {}} />
                <button onClick={commitEdit}
                  className="p-1.5 rounded-lg text-emerald-500 hover:text-white hover:bg-emerald-500 transition-colors" title="Save">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={cancelEdit}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-400 transition-colors" title="Cancel">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-gray-700 px-1 truncate" style={isBangla ? banglaFont : {}}>
                  {h || <span className="text-gray-300 italic">Empty — click ✏ to edit</span>}
                </span>
                <button onClick={() => startEdit(i)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-blue-400 hover:text-white hover:bg-blue-500 transition-all" title="Edit">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* Delete */}
            <button onClick={() => remove(i)}
              className={`p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500 transition-colors flex-shrink-0 ${editIdx === i ? '' : 'opacity-0 group-hover:opacity-100'}`}
              title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <p className="text-[10px] text-gray-300 mt-3 text-center">
          ↕ Use arrows to reorder · ✏ Hover to edit or delete
        </p>
      )}
    </div>
  );
}

interface MDMessage { name:string; name_bn?:string; title:string; title_bn?:string; message:string; message_bn?:string; image:string; }
interface Expert    { id:number; name:string; name_bn?:string; role:string; role_bn?:string; specialty:string; specialty_bn?:string; image:string; }
interface WhyItem   { id:number; icon:string; title:string; title_bn?:string; desc:string; desc_bn?:string; }
interface Cert      { id:number; name:string; logo:string; url?:string; }
interface AboutData {
  heading:string; para1:string; para2:string; image:string;
  yearsExperience:number; projectsCompleted:number; highlights:string[];
  heading_bn?:string; para1_bn?:string; para2_bn?:string; highlights_bn?:string[];
  mdMessage?:MDMessage; experts?:Expert[]; whyChoose?:WhyItem[]; certifications?:Cert[];
}
const DEF_MD:MDMessage = { name:'', title:'', message:'', image:'', name_bn:'', title_bn:'', message_bn:'' };
const DEF:AboutData = {
  heading:'', para1:'', para2:'', image:'',
  yearsExperience:15, projectsCompleted:200, highlights:[], highlights_bn:[],
  heading_bn:'', para1_bn:'', para2_bn:'',
  mdMessage:DEF_MD, experts:[], whyChoose:[], certifications:[],
};

export default function AboutAdmin() {
  const { lang } = useLanguage();
  const tr = adminT(lang);
  const bf = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const [data,   setData]   = useState<AboutData>(DEF);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    fetch('/api/content/about').then(r => r.json()).then(d => setData({ ...DEF, ...d }));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/content/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const tf = (key: keyof AboutData, label: string, ph = '', rows?: number, isBn = false) => (
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
        <h1 className="text-2xl font-bold text-gray-900">{tr.about.pageTitle}</h1>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
          style={{ backgroundColor: saved ? '#00d97e' : '#2c7be5' }}>
          <Save className="w-4 h-4" /> {saved ? tr.common.saved : saving ? tr.common.saving : tr.common.save}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-5">
          {/* English content */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">{tr.about.sectionContent}</h6>
            {tf('heading', tr.about.heading)}
            {tf('para1',   tr.about.para1, '', 4)}
            {tf('para2',   tr.about.para2, '', 4)}
          </div>

          {/* Bangla content */}
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <h6 className="font-semibold text-blue-600 text-sm" style={bf}>{tr.about.banglaSectionTitle}</h6>
              <AutoTranslateButton fields={[
                { text: data.heading, onResult: v => setData(d => ({ ...d, heading_bn: v })) },
                { text: data.para1,   onResult: v => setData(d => ({ ...d, para1_bn:   v })) },
                { text: data.para2,   onResult: v => setData(d => ({ ...d, para2_bn:   v })) },
                ...data.highlights.map((h, i) => ({
                  text: h,
                  onResult: (v: string) => setData(d => {
                    const hs = [...(d.highlights_bn ?? [])];
                    hs[i] = v;
                    return { ...d, highlights_bn: hs };
                  }),
                })),
              ]} />
            </div>
            {tf('heading_bn', tr.about.headingBn, '', undefined, true)}
            {tf('para1_bn',   tr.about.para1Bn, '', 4, true)}
            {tf('para2_bn',   tr.about.para2Bn, '', 4, true)}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">{tr.about.floatingStats}</h6>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{tr.about.yearsExp}</label>
                <input type="number" value={data.yearsExperience} onChange={e => setData({ ...data, yearsExperience: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{tr.about.projectsCompleted}</label>
                <input type="number" value={data.projectsCompleted} onChange={e => setData({ ...data, projectsCompleted: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h6 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">{tr.about.aboutImage}</h6>
            <ImageUpload value={data.image} onChange={url => setData({ ...data, image: url })} label={tr.about.sectionPhoto} />
          </div>

          {/* English highlights */}
          <HighlightsList
            items={data.highlights}
            onChange={highlights => setData(d => ({ ...d, highlights }))}
            title={tr.about.keyHighlights}
            addLabel={tr.about.addHighlight}
            emptyLabel={tr.about.noHighlights}
            accentColor="#2c7be5"
            borderClass="border-gray-100"
            inputClass="border-gray-200 focus:border-blue-400"
            titleClass="text-gray-700"
          />

          {/* Bangla highlights */}
          <HighlightsList
            items={data.highlights_bn ?? []}
            onChange={highlights_bn => setData(d => ({ ...d, highlights_bn }))}
            title={`${tr.about.keyHighlights} (বাংলা)`}
            addLabel={tr.about.addHighlightBn}
            emptyLabel={tr.about.noHighlightsBn}
            accentColor="#2c7be5"
            borderClass="border-blue-100"
            inputClass="border-blue-200 focus:border-blue-400"
            titleClass="text-blue-600"
            isBangla
            banglaFont={bf}
          />
        </div>
      </div>

      {/* ══ MD Message ═══════════════════════════════════════════════════ */}
      <div className="mt-5 bg-white rounded-xl border border-emerald-100 shadow-sm p-6">
        <h6 className="font-semibold text-emerald-700 text-sm border-b border-emerald-100 pb-3 mb-5 flex items-center gap-2">
          <span className="text-lg">💬</span> Message from Managing Director
        </h6>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <ImageUpload
              value={data.mdMessage?.image ?? ''}
              onChange={url => setData(d => ({ ...d, mdMessage: { ...DEF_MD, ...d.mdMessage, image: url } }))}
              label="MD Photo"
            />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name (EN)</label>
                <input value={data.mdMessage?.name ?? ''} onChange={e => setData(d => ({ ...d, mdMessage: { ...DEF_MD, ...d.mdMessage, name: e.target.value } }))}
                  placeholder="Full name" className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1.5" style={bf}>Name (BN)</label>
                <input value={data.mdMessage?.name_bn ?? ''} onChange={e => setData(d => ({ ...d, mdMessage: { ...DEF_MD, ...d.mdMessage, name_bn: e.target.value } }))}
                  className="w-full border border-blue-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" style={bf} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title / Designation (EN)</label>
                <input value={data.mdMessage?.title ?? ''} onChange={e => setData(d => ({ ...d, mdMessage: { ...DEF_MD, ...d.mdMessage, title: e.target.value } }))}
                  placeholder="Managing Director &…" className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1.5" style={bf}>Title (BN)</label>
                <input value={data.mdMessage?.title_bn ?? ''} onChange={e => setData(d => ({ ...d, mdMessage: { ...DEF_MD, ...d.mdMessage, title_bn: e.target.value } }))}
                  className="w-full border border-blue-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" style={bf} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message (EN)</label>
              <RichTextEditor value={data.mdMessage?.message ?? ''} onChange={v => setData(d => ({ ...d, mdMessage: { ...DEF_MD, ...d.mdMessage, message: v } }))} minHeight={120} placeholder="Director's message…" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1.5" style={bf}>Message (BN)</label>
              <RichTextEditor value={data.mdMessage?.message_bn ?? ''} onChange={v => setData(d => ({ ...d, mdMessage: { ...DEF_MD, ...d.mdMessage, message_bn: v } }))} minHeight={120} />
            </div>
          </div>
        </div>
      </div>

      {/* ══ Our Experts ══════════════════════════════════════════════════ */}
      <div className="mt-5 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
          <h6 className="font-semibold text-gray-700 text-sm flex items-center gap-2"><span className="text-lg">👥</span> Our Experts</h6>
          <button onClick={() => setData(d => ({ ...d, experts: [...(d.experts??[]), { id: Date.now(), name:'', role:'', specialty:'', image:'', name_bn:'', role_bn:'', specialty_bn:'' }] }))}
            className="flex items-center gap-1 text-xs text-white px-3 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: '#2c7be5' }}>
            <Plus className="w-3 h-3" /> Add Expert
          </button>
        </div>
        <div className="space-y-4">
          {(data.experts ?? []).map((ex, i) => (
            <div key={ex.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="w-28 flex-shrink-0">
                  <ImageUpload value={ex.image} onChange={url => { const arr=[...(data.experts??[])]; arr[i]={...arr[i],image:url}; setData(d=>({...d,experts:arr})); }} label="Photo" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {([['name','Name (EN)','name_bn','Name (BN)'],['role','Role (EN)','role_bn','Role (BN)'],['specialty','Specialty (EN)','specialty_bn','Specialty (BN)']] as [keyof Expert, string, keyof Expert, string][]).map(([k,l,kb,lb]) => (
                    <React.Fragment key={String(k)}>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{l}</label>
                        <input value={String(ex[k]??'')} onChange={e => { const arr=[...(data.experts??[])]; arr[i]={...arr[i],[k]:e.target.value}; setData(d=>({...d,experts:arr})); }}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1" style={bf}>{lb}</label>
                        <input value={String(ex[kb]??'')} onChange={e => { const arr=[...(data.experts??[])]; arr[i]={...arr[i],[kb]:e.target.value}; setData(d=>({...d,experts:arr})); }}
                          className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" style={bf} />
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button onClick={() => { const a=[...(data.experts??[])]; if(i>0){[a[i],a[i-1]]=[a[i-1],a[i]]; setData(d=>({...d,experts:a}));} }} disabled={i===0}
                    className="p-1.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"><ChevronUp className="w-4 h-4" /></button>
                  <button onClick={() => { const a=[...(data.experts??[])]; if(i<a.length-1){[a[i],a[i+1]]=[a[i+1],a[i]]; setData(d=>({...d,experts:a}));} }} disabled={i===(data.experts??[]).length-1}
                    className="p-1.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"><ChevronDown className="w-4 h-4" /></button>
                  <button onClick={() => setData(d=>({...d,experts:(d.experts??[]).filter((_,j)=>j!==i)}))}
                    className="p-1.5 rounded text-red-400 hover:text-white hover:bg-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
          {(data.experts ?? []).length === 0 && <p className="text-sm text-gray-400 text-center py-6">No experts added yet. Click + Add Expert.</p>}
        </div>
      </div>

      {/* ══ Why Choose GreenBD ═══════════════════════════════════════════ */}
      <div className="mt-5 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
          <h6 className="font-semibold text-gray-700 text-sm flex items-center gap-2"><span className="text-lg">⭐</span> Why Choose GreenBD</h6>
          <button onClick={() => setData(d => ({ ...d, whyChoose: [...(d.whyChoose??[]), { id: Date.now(), icon:'🌿', title:'', desc:'', title_bn:'', desc_bn:'' }] }))}
            className="flex items-center gap-1 text-xs text-white px-3 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: '#2c7be5' }}>
            <Plus className="w-3 h-3" /> Add Reason
          </button>
        </div>
        <div className="space-y-3">
          {(data.whyChoose ?? []).map((item, i) => (
            <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex items-start gap-3">
              <div className="flex flex-col gap-1 flex-shrink-0 pt-1">
                <button onClick={() => { const a=[...(data.whyChoose??[])]; if(i>0){[a[i],a[i-1]]=[a[i-1],a[i]]; setData(d=>({...d,whyChoose:a}));} }} disabled={i===0}
                  className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
                <button onClick={() => { const a=[...(data.whyChoose??[])]; if(i<a.length-1){[a[i],a[i+1]]=[a[i+1],a[i]]; setData(d=>({...d,whyChoose:a}));} }} disabled={i===(data.whyChoose??[]).length-1}
                  className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Icon (emoji)</label>
                  <input value={item.icon} onChange={e=>{ const a=[...(data.whyChoose??[])]; a[i]={...a[i],icon:e.target.value}; setData(d=>({...d,whyChoose:a})); }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-center" />
                </div>
                <div />
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title (EN)</label>
                  <input value={item.title} onChange={e=>{ const a=[...(data.whyChoose??[])]; a[i]={...a[i],title:e.target.value}; setData(d=>({...d,whyChoose:a})); }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1" style={bf}>Title (BN)</label>
                  <input value={item.title_bn??''} onChange={e=>{ const a=[...(data.whyChoose??[])]; a[i]={...a[i],title_bn:e.target.value}; setData(d=>({...d,whyChoose:a})); }}
                    className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" style={bf} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description (EN)</label>
                  <RichTextEditor value={item.desc} onChange={v=>{ const a=[...(data.whyChoose??[])]; a[i]={...a[i],desc:v}; setData(d=>({...d,whyChoose:a})); }} minHeight={80} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1" style={bf}>Description (BN)</label>
                  <RichTextEditor value={item.desc_bn??''} onChange={v=>{ const a=[...(data.whyChoose??[])]; a[i]={...a[i],desc_bn:v}; setData(d=>({...d,whyChoose:a})); }} minHeight={80} />
                </div>
              </div>
              <button onClick={() => setData(d=>({...d,whyChoose:(d.whyChoose??[]).filter((_,j)=>j!==i)}))}
                className="p-1.5 rounded text-red-400 hover:text-white hover:bg-red-500 transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          {(data.whyChoose ?? []).length === 0 && <p className="text-sm text-gray-400 text-center py-6">No reasons added yet. Click + Add Reason.</p>}
        </div>
      </div>

      {/* ══ Certifications & Partnerships ═══════════════════════════════ */}
      <div className="mt-5 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
          <h6 className="font-semibold text-gray-700 text-sm flex items-center gap-2"><span className="text-lg">🏆</span> Certifications & Partnerships</h6>
          <button onClick={() => setData(d => ({ ...d, certifications: [...(d.certifications??[]), { id: Date.now(), name:'', logo:'', url:'' }] }))}
            className="flex items-center gap-1 text-xs text-white px-3 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: '#2c7be5' }}>
            <Plus className="w-3 h-3" /> Add Certification
          </button>
        </div>
        <div className="space-y-3">
          {(data.certifications ?? []).map((cert, i) => (
            <div key={cert.id} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 bg-gray-50">
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button onClick={() => { const a=[...(data.certifications??[])]; if(i>0){[a[i],a[i-1]]=[a[i-1],a[i]]; setData(d=>({...d,certifications:a}));} }} disabled={i===0}
                  className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
                <button onClick={() => { const a=[...(data.certifications??[])]; if(i<a.length-1){[a[i],a[i+1]]=[a[i+1],a[i]]; setData(d=>({...d,certifications:a}));} }} disabled={i===(data.certifications??[]).length-1}
                  className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name / Label</label>
                  <input value={cert.name} onChange={e=>{ const a=[...(data.certifications??[])]; a[i]={...a[i],name:e.target.value}; setData(d=>({...d,certifications:a})); }}
                    placeholder="ISO 14001:2015…" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Logo URL</label>
                  <input value={cert.logo} onChange={e=>{ const a=[...(data.certifications??[])]; a[i]={...a[i],logo:e.target.value}; setData(d=>({...d,certifications:a})); }}
                    placeholder="https://…/logo.png (optional)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Link URL (optional)</label>
                  <input value={cert.url??''} onChange={e=>{ const a=[...(data.certifications??[])]; a[i]={...a[i],url:e.target.value}; setData(d=>({...d,certifications:a})); }}
                    placeholder="https://…" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                </div>
              </div>
              <button onClick={() => setData(d=>({...d,certifications:(d.certifications??[]).filter((_,j)=>j!==i)}))}
                className="p-1.5 rounded text-red-400 hover:text-white hover:bg-red-500 transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          {(data.certifications ?? []).length === 0 && <p className="text-sm text-gray-400 text-center py-6">No certifications added yet. Click + Add Certification.</p>}
        </div>
      </div>

    </div>
  );
}
