'use client';

import { useState } from 'react';
import { Menu, X, Leaf } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fbfd' }}>

      {/* ── Mobile top bar ────────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-white border-b border-gray-100 shadow-sm">
        <button onClick={() => setOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#14532d,#166534)' }}>
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm">Green BD Admin</span>
        </div>
        <div className="w-10" />
      </header>

      {/* ── Mobile backdrop ───────────────────────────────────────────── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar (drawer on mobile, fixed on desktop) ──────────────── */}
      <div className={`fixed top-0 left-0 h-screen z-50 transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Close button inside drawer on mobile */}
        <div className="lg:hidden absolute top-4 right-3 z-10">
          <button onClick={() => setOpen(false)}
            className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-lg flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className="lg:ml-[240px] min-h-screen pt-14 lg:pt-0 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
