'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import PageHeader from '@/components/admin/PageHeader';
import ImageUpload from '@/components/admin/ImageUpload';

interface Member { id: number; name: string; role: string; expertise: string; image: string; }
const EMPTY: Omit<Member,'id'> = { name: '', role: '', expertise: '', image: '' };

export default function TeamAdmin() {
  const [items, setItems] = useState<Member[]>([]);
  const [modal, setModal] = useState<'add'|'edit'|null>(null);
  const [current, setCurrent] = useState<Partial<Member>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number|null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/content/team');
    const data = await res.json();
    setItems(data.members || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    if (modal === 'add') {
      await fetch('/api/content/team', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(current) });
    } else {
      await fetch(`/api/content/team/${current.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(current) });
    }
    setSaving(false); setModal(null); load();
  };

  const del = async (id: number) => {
    await fetch(`/api/content/team/${id}`, { method: 'DELETE' });
    setDeleteId(null); load();
  };

  const tf = (key: keyof Member, label: string, ph = '') => (
    <div>
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">{label}</label>
      <input value={String(current[key] ?? '')} onChange={(e) => setCurrent({...current, [key]: e.target.value})} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
    </div>
  );

  return (
    <div>
      <PageHeader title="Team Members" desc={`${items.length} members in leadership section`}
        action={
          <button onClick={() => { setCurrent(EMPTY); setModal('add'); }} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl">
            <Plus className="w-4 h-4" /> Add Member
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
            <div className="relative h-48 bg-gray-100">
              {m.image ? (
                <img src={m.image} alt={m.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-gray-300" /></div>
              )}
            </div>
            <div className="p-4">
              <p className="font-bold text-gray-900">{m.name}</p>
              <p className="text-primary-600 text-sm font-medium mt-0.5">{m.role}</p>
              <p className="text-gray-400 text-xs mt-1">{m.expertise}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setCurrent(m); setModal('edit'); }} className="flex-1 flex items-center justify-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 py-1.5 rounded-lg"><Pencil className="w-3 h-3" /> Edit</button>
                <button onClick={() => setDeleteId(m.id)} className="flex-1 flex items-center justify-center gap-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 py-1.5 rounded-lg"><Trash2 className="w-3 h-3" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Team Member' : 'Edit Team Member'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {tf('name', 'Full Name', 'Dr. Jane Doe')}
            {tf('role', 'Role / Title', 'Senior Climate Scientist')}
            {tf('expertise', 'Expertise Areas', 'Climate Modeling, IPCC Research')}
            <ImageUpload
              value={String(current.image ?? '')}
              onChange={(url) => setCurrent({ ...current, image: url })}
              label="Profile Photo"
            />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-primary-600 text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-60">{saving ? 'Saving…' : 'Save Member'}</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Remove Member?" onClose={() => setDeleteId(null)} size="sm">
          <p className="text-gray-500 text-sm mb-6">This team member will be removed from the website.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl">Cancel</button>
            <button onClick={() => del(deleteId)} className="flex-1 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl">Remove</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
