'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/admin/Modal';

interface Client      { id: number; name: string; abbr: string; color: string; }
interface Testimonial { id: number; name: string; role: string; text: string; rating: number; }

const CLIENT_COLORS = ['bg-blue-600','bg-blue-800','bg-red-600','bg-green-700','bg-orange-600','bg-blue-700','bg-green-600','bg-red-700','bg-purple-600','bg-teal-600'];
const EMPTY_C: Omit<Client,'id'>      = { name: '', abbr: '', color: 'bg-blue-600' };
const EMPTY_T: Omit<Testimonial,'id'> = { name: '', role: '', text: '', rating: 5 };

export default function ClientsAdmin() {
  const [clients,      setClients]      = useState<Client[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [tab,          setTab]          = useState<'clients'|'testimonials'>('clients');
  const [modal,        setModal]        = useState<'add-c'|'edit-c'|'add-t'|'edit-t'|null>(null);
  const [currentC,     setCurrentC]     = useState<Partial<Client>>(EMPTY_C);
  const [currentT,     setCurrentT]     = useState<Partial<Testimonial>>(EMPTY_T);
  const [saving,       setSaving]       = useState(false);
  const [deleteId,     setDeleteId]     = useState<{id:number;type:'c'|'t'}|null>(null);

  const load = useCallback(async () => {
    const d = await fetch('/api/content/clients').then(r => r.json());
    setClients(d.clients || []); setTestimonials(d.testimonials || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const saveClient = async () => {
    setSaving(true);
    if (modal === 'add-c') await fetch('/api/content/clients', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(currentC) });
    else await fetch(`/api/content/clients/${currentC.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(currentC) });
    setSaving(false); setModal(null); load();
  };
  const saveTestimonial = async () => {
    setSaving(true);
    if (modal === 'add-t') await fetch('/api/content/testimonials', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(currentT) });
    else await fetch(`/api/content/testimonials/${currentT.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(currentT) });
    setSaving(false); setModal(null); load();
  };

  const inp = (val: string, onChange: (v: string) => void, label: string, ph = '') => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input value={val} onChange={e => onChange(e.target.value)} placeholder={ph}
        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Clients & Reviews</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(['clients','testimonials'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'}`}
            style={tab === t ? { backgroundColor: '#2c7be5' } : {}}>
            {t === 'clients' ? `Clients (${clients.length})` : `Testimonials (${testimonials.length})`}
          </button>
        ))}
      </div>

      {/* Clients table */}
      {tab === 'clients' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h6 className="font-semibold text-gray-700 text-sm">Clients</h6>
            <button onClick={() => { setCurrentC(EMPTY_C); setModal('add-c'); }}
              className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: '#2c7be5' }}>
              <Plus className="w-3.5 h-3.5" /> Add Client
            </button>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-gray-100">
              {['#','Logo','Name','Abbreviation','Actions'].map(h => <th key={h} className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody>
              {clients.map((c, i) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm text-gray-400">{i+1}</td>
                  <td className="px-6 py-3"><div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center text-white font-bold text-xs`}>{c.abbr}</div></td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-800">{c.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{c.abbr}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setCurrentC(c); setModal('edit-c'); }} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ borderColor: '#2c7be5', color: '#2c7be5' }}><Pencil className="w-3 h-3" /> Edit</button>
                      <button onClick={() => setDeleteId({id:c.id,type:'c'})} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-white font-medium" style={{ backgroundColor: '#e63757' }}><Trash2 className="w-3 h-3" /> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Testimonials table */}
      {tab === 'testimonials' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h6 className="font-semibold text-gray-700 text-sm">Testimonials</h6>
            <button onClick={() => { setCurrentT(EMPTY_T); setModal('add-t'); }}
              className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: '#2c7be5' }}>
              <Plus className="w-3.5 h-3.5" /> Add Review
            </button>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-gray-100">
              {['#','Name','Role','Review','Rating','Actions'].map(h => <th key={h} className="text-left px-6 py-3 text-xs uppercase text-gray-400 font-semibold tracking-wider whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>
              {testimonials.map((t, i) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm text-gray-400">{i+1}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-800">{t.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-500 max-w-[160px]">{t.role}</td>
                  <td className="px-6 py-3 text-sm text-gray-500 max-w-[280px]"><p className="line-clamp-2 italic">"{t.text}"</p></td>
                  <td className="px-6 py-3 text-sm text-amber-500">{'★'.repeat(t.rating)}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setCurrentT(t); setModal('edit-t'); }} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ borderColor: '#2c7be5', color: '#2c7be5' }}><Pencil className="w-3 h-3" /> Edit</button>
                      <button onClick={() => setDeleteId({id:t.id,type:'t'})} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-white font-medium" style={{ backgroundColor: '#e63757' }}><Trash2 className="w-3 h-3" /> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Client Modal */}
      {(modal === 'add-c' || modal === 'edit-c') && (
        <Modal title={modal === 'add-c' ? 'Add Client' : 'Edit Client'} onClose={() => setModal(null)} size="sm">
          <div className="space-y-4">
            {inp(currentC.name ?? '', v => setCurrentC({...currentC, name: v}), 'Organization Name')}
            {inp(currentC.abbr ?? '', v => setCurrentC({...currentC, abbr: v}), 'Abbreviation (max 5 chars)')}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Logo Color</label>
              <div className="flex flex-wrap gap-2">{CLIENT_COLORS.map(c => <button key={c} onClick={() => setCurrentC({...currentC, color: c})} className={`w-8 h-8 rounded-lg ${c} border-2 ${currentC.color === c ? 'border-gray-800 scale-110' : 'border-transparent'} transition-all`} />)}</div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">Cancel</button>
              <button onClick={saveClient} disabled={saving} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60" style={{ backgroundColor: '#2c7be5' }}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Testimonial Modal */}
      {(modal === 'add-t' || modal === 'edit-t') && (
        <Modal title={modal === 'add-t' ? 'Add Testimonial' : 'Edit Testimonial'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {inp(currentT.name ?? '', v => setCurrentT({...currentT, name: v}), 'Name')}
            {inp(currentT.role ?? '', v => setCurrentT({...currentT, role: v}), 'Role / Organization')}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Review Text</label>
              <textarea value={currentT.text ?? ''} onChange={e => setCurrentT({...currentT, text: e.target.value})} rows={4}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Rating (1–5)</label>
              <input type="number" min={1} max={5} value={currentT.rating ?? 5} onChange={e => setCurrentT({...currentT, rating: Number(e.target.value)})}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">Cancel</button>
              <button onClick={saveTestimonial} disabled={saving} className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60" style={{ backgroundColor: '#2c7be5' }}>{saving ? 'Saving…' : 'Save Review'}</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete?" onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">This item will be permanently deleted.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">Cancel</button>
            <button onClick={async () => { const s = deleteId.type === 'c' ? 'clients' : 'testimonials'; await fetch(`/api/content/${s}/${deleteId.id}`, {method:'DELETE'}); setDeleteId(null); load(); }}
              className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg" style={{ backgroundColor: '#e63757' }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
