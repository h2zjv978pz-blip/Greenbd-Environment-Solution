'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import PageHeader from '@/components/admin/PageHeader';

interface Client { id: number; name: string; abbr: string; color: string; }
interface Testimonial { id: number; name: string; role: string; text: string; rating: number; }

const CLIENT_COLORS = ['bg-blue-600','bg-blue-800','bg-red-600','bg-green-700','bg-orange-600','bg-blue-700','bg-green-600','bg-red-700','bg-purple-600','bg-teal-600'];
const EMPTY_CLIENT: Omit<Client,'id'> = { name: '', abbr: '', color: 'bg-blue-600' };
const EMPTY_TESTIMONIAL: Omit<Testimonial,'id'> = { name: '', role: '', text: '', rating: 5 };

export default function ClientsAdmin() {
  const [clients, setClients]       = useState<Client[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [tab, setTab] = useState<'clients'|'testimonials'>('clients');
  const [modal, setModal]           = useState<'add-c'|'edit-c'|'add-t'|'edit-t'|null>(null);
  const [currentC, setCurrentC]     = useState<Partial<Client>>(EMPTY_CLIENT);
  const [currentT, setCurrentT]     = useState<Partial<Testimonial>>(EMPTY_TESTIMONIAL);
  const [saving, setSaving]         = useState(false);
  const [deleteId, setDeleteId]     = useState<{id:number; type:'c'|'t'}|null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/content/clients');
    const d = await res.json();
    setClients(d.clients || []); setTestimonials(d.testimonials || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveClient = async () => {
    setSaving(true);
    if (modal === 'add-c') {
      await fetch('/api/content/clients', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(currentC) });
    } else {
      await fetch(`/api/content/clients/${currentC.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(currentC) });
    }
    setSaving(false); setModal(null); load();
  };

  const saveTestimonial = async () => {
    setSaving(true);
    if (modal === 'add-t') {
      await fetch('/api/content/testimonials', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(currentT) });
    } else {
      await fetch(`/api/content/testimonials/${currentT.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(currentT) });
    }
    setSaving(false); setModal(null); load();
  };

  const del = async ({ id, type }: { id: number; type: 'c'|'t' }) => {
    const section = type === 'c' ? 'clients' : 'testimonials';
    await fetch(`/api/content/${section}/${id}`, { method: 'DELETE' });
    setDeleteId(null); load();
  };

  return (
    <div>
      <PageHeader title="Clients & Reviews" desc="Manage client logos and testimonials" />

      <div className="flex gap-2 mb-6">
        {(['clients','testimonials'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-400'}`}>
            {t === 'clients' ? `Clients (${clients.length})` : `Testimonials (${testimonials.length})`}
          </button>
        ))}
      </div>

      {tab === 'clients' && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setCurrentC(EMPTY_CLIENT); setModal('add-c'); }} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"><Plus className="w-4 h-4" /> Add Client</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {clients.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-2">
                <div className={`w-14 h-14 ${c.color} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>{c.abbr}</div>
                <p className="text-gray-600 text-xs text-center font-medium leading-tight">{c.name}</p>
                <div className="flex gap-1.5">
                  <button onClick={() => { setCurrentC(c); setModal('edit-c'); }} className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg"><Pencil className="w-3 h-3" /></button>
                  <button onClick={() => setDeleteId({id: c.id, type:'c'})} className="text-xs text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'testimonials' && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setCurrentT(EMPTY_TESTIMONIAL); setModal('add-t'); }} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"><Plus className="w-4 h-4" /> Add Review</button>
          </div>
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.name.split(' ').map((n) => n[0]).slice(0,2).join('')}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2 italic">"{t.text}"</p>
                  <div className="flex gap-1 mt-1">{Array.from({length: t.rating}).map((_,i) => <span key={i} className="text-amber-400 text-xs">★</span>)}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => { setCurrentT(t); setModal('edit-t'); }} className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1.5 rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteId({id: t.id, type:'t'})} className="text-xs text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1.5 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Client Modal */}
      {(modal === 'add-c' || modal === 'edit-c') && (
        <Modal title={modal === 'add-c' ? 'Add Client' : 'Edit Client'} onClose={() => setModal(null)} size="sm">
          <div className="space-y-4">
            <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Organization Name</label><input value={currentC.name ?? ''} onChange={(e) => setCurrentC({...currentC, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" /></div>
            <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Abbreviation (max 5 chars)</label><input value={currentC.abbr ?? ''} maxLength={5} onChange={(e) => setCurrentC({...currentC, abbr: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" /></div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">Logo Color</label>
              <div className="flex flex-wrap gap-2">{CLIENT_COLORS.map((c) => (<button key={c} onClick={() => setCurrentC({...currentC, color: c})} className={`w-8 h-8 rounded-lg ${c} border-2 ${currentC.color === c ? 'border-gray-800 scale-110' : 'border-transparent'} transition-all`} />))}</div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl">Cancel</button>
              <button onClick={saveClient} disabled={saving} className="flex-1 bg-primary-600 text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Testimonial Modal */}
      {(modal === 'add-t' || modal === 'edit-t') && (
        <Modal title={modal === 'add-t' ? 'Add Testimonial' : 'Edit Testimonial'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Name</label><input value={currentT.name ?? ''} onChange={(e) => setCurrentT({...currentT, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" /></div>
            <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Role / Organization</label><input value={currentT.role ?? ''} onChange={(e) => setCurrentT({...currentT, role: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" /></div>
            <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Review Text</label><textarea value={currentT.text ?? ''} onChange={(e) => setCurrentT({...currentT, text: e.target.value})} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none" /></div>
            <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Rating (1–5)</label><input type="number" min={1} max={5} value={currentT.rating ?? 5} onChange={(e) => setCurrentT({...currentT, rating: Number(e.target.value)})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" /></div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl">Cancel</button>
              <button onClick={saveTestimonial} disabled={saving} className="flex-1 bg-primary-600 text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-60">{saving ? 'Saving…' : 'Save Review'}</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete?" onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">This item will be permanently deleted.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl">Cancel</button>
            <button onClick={() => del(deleteId)} className="flex-1 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
