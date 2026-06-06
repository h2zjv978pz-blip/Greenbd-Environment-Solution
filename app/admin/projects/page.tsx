'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, ImageIcon, GripVertical, Save, Check, Eye, EyeOff } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import type { Project } from '@/lib/getData';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { adminT } from '@/lib/i18n/translations';

export default function ProjectsAdmin() {
  const router = useRouter();
  const { lang } = useLanguage();
  const tr = adminT(lang);
  const bf = lang === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif" } : {};

  const [items,    setItems]    = useState<Project[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [dragSrc,  setDragSrc]  = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [isDirty,  setIsDirty]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  const load = useCallback(async () => {
    const d = await fetch('/api/content/projects').then(r => r.json());
    setItems(d.projects || []);
    setIsDirty(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const del = async (id: number) => {
    await fetch(`/api/content/projects/${id}`, { method: 'DELETE' });
    setDeleteId(null); load();
  };

  const toggleHidden = (p: Project) => {
    setItems(prev => prev.map(item => item.id === p.id ? { ...item, hidden: !item.hidden } : item));
    setIsDirty(true);
  };

  const saveOrder = async () => {
    setSaving(true);
    await fetch('/api/content/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projects: items }),
    });
    setSaving(false); setSaved(true); setIsDirty(false);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const onDragStart = (e: React.DragEvent<HTMLTableRowElement>, idx: number) => {
    setDragSrc(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const onDragOver = (e: React.DragEvent<HTMLTableRowElement>, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (idx !== dragSrc) setDragOver(idx);
  };

  const onDrop = (e: React.DragEvent<HTMLTableRowElement>, toIdx: number) => {
    e.preventDefault();
    const fromIdx = dragSrc;
    if (fromIdx === null || fromIdx === toIdx) { setDragSrc(null); setDragOver(null); return; }
    const arr = [...items];
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, moved);
    setItems(arr);
    setIsDirty(true);
    setDragSrc(null);
    setDragOver(null);
  };

  const onDragEnd = () => { setDragSrc(null); setDragOver(null); };

  return (
    <div style={bf}>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tr.projects.pageTitle}</h1>
          {isDirty && <p className="text-xs text-amber-500 mt-0.5 font-medium">• Unsaved changes — click Save</p>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={saveOrder} disabled={saving}
            className={`flex items-center gap-2 px-5 py-2.5 text-white text-sm font-bold rounded-lg transition-all shadow-sm disabled:opacity-60 ${
              saved ? 'bg-green-500' : isDirty ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-300' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}>
            {saving
              ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>
          <button
            onClick={() => router.push('/admin/projects/new')}
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            style={{ backgroundColor: '#2c7be5' }}>
            <Plus className="w-3.5 h-3.5" /> {tr.projects.createBtn}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h6 className="font-semibold text-gray-700 text-sm">{tr.projects.tableTitle}</h6>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <GripVertical className="w-3 h-3" /> Drag to reorder or toggle Hide — click Save Changes to apply
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {/* Drag handle col */}
                <th className="w-10 px-3 py-3" />
                {['#', tr.projects.colTitle, tr.projects.colCategory, tr.projects.colClient,
                  tr.projects.colLocation, tr.projects.colYear, tr.projects.colImage, tr.common.actions
                ].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((p, i) => {
                const isDragging  = dragSrc  === i;
                const isDropZone  = dragOver === i && dragSrc !== i;
                const isHidden    = !!p.hidden;
                return (
                  <tr
                    key={p.id}
                    draggable
                    onDragStart={e => onDragStart(e, i)}
                    onDragOver={e => onDragOver(e, i)}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={e => onDrop(e, i)}
                    onDragEnd={onDragEnd}
                    className={`border-b transition-all duration-100 select-none
                      ${isDragging  ? 'opacity-30 bg-blue-50/60 scale-[0.99]' : ''}
                      ${isDropZone  ? 'border-t-[3px] border-t-blue-500 bg-blue-50/50' : 'border-gray-50'}
                      ${isHidden && !isDragging && !isDropZone ? 'bg-gray-50/80 opacity-60' : ''}
                      ${!isDragging && !isDropZone && !isHidden ? 'hover:bg-gray-50' : ''}
                    `}
                  >
                    {/* Drag handle */}
                    <td className="pl-4 pr-1 py-3 w-10">
                      <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors flex items-center justify-center">
                        <GripVertical className="w-4 h-4" />
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400 w-10 tabular-nums">{i + 1}</td>

                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 max-w-[200px]">
                      <p className="line-clamp-2">{p.title}</p>
                      {isHidden && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 bg-gray-100 rounded px-1.5 py-0.5 mt-0.5">
                          <EyeOff className="w-2.5 h-2.5" /> Hidden
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium whitespace-nowrap">{p.category}</span>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[140px]">
                      <p className="line-clamp-1">{p.clientName || <span className="text-gray-300">—</span>}</p>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{p.location}</td>

                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {p.projectTime || <span className="text-gray-300">—</span>}
                    </td>

                    <td className="px-4 py-3">
                      {p.image
                        ? <img src={p.image} alt={p.title} className="w-16 h-11 object-cover rounded-lg border border-gray-100" />
                        : <div className="w-16 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-gray-300" />
                          </div>}
                    </td>

                    <td className="px-4 py-3">
                      {/* Stop drag events propagating from buttons */}
                      <div className="flex items-center gap-2"
                        onDragStart={e => e.stopPropagation()}
                        draggable={false}>
                        <button onClick={() => router.push(`/admin/projects/${p.id}/edit`)}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
                          style={{ borderColor: '#2c7be5', color: '#2c7be5' }}>
                          <Pencil className="w-3 h-3" /> {tr.common.edit}
                        </button>
                        <button
                          onClick={() => toggleHidden(p)}
                          title={isHidden ? 'Show on site' : 'Hide from site'}
                          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                            isHidden
                              ? 'border-green-400 text-green-600 hover:bg-green-50'
                              : 'border-gray-300 text-gray-500 hover:border-gray-400'
                          }`}>
                          {isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {isHidden ? 'Show' : 'Hide'}
                        </button>
                        <button onClick={() => setDeleteId(p.id)}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-colors"
                          style={{ backgroundColor: '#e63757' }}>
                          <Trash2 className="w-3 h-3" /> {tr.common.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-sm text-gray-400">{tr.projects.noProjects}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <Modal title={tr.projects.deleteTitle} onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">{tr.projects.deleteMsg}</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)}
              className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50">
              {tr.common.cancel}
            </button>
            <button onClick={() => del(deleteId)}
              className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg"
              style={{ backgroundColor: '#e63757' }}>
              {tr.projects.deleteBtn}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
