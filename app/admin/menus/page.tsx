'use client';

import { useState, useEffect } from 'react';
import { Save, GripVertical, Monitor, Smartphone, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';

const NAV_ITEMS: Record<string, { label: string; emoji: string }> = {
  home:       { label: 'Home',        emoji: '🏠' },
  about:      { label: 'About',       emoji: '📋' },
  services:   { label: 'Services',    emoji: '⚙️' },
  projects:   { label: 'Projects',    emoji: '📁' },
  research:   { label: 'Research',    emoji: '🔬' },
  climateMap: { label: 'Climate Map', emoji: '🗺️' },
  team:       { label: 'Team',        emoji: '👥' },
  clients:    { label: 'Clients',     emoji: '🤝' },
};

const DEFAULT_ORDER = ['home', 'about', 'services', 'projects', 'research', 'climateMap', 'team', 'clients'];

function normalize(order?: string[]) {
  const base = order?.filter(k => NAV_ITEMS[k]) ?? [];
  return [...base, ...DEFAULT_ORDER.filter(k => !base.includes(k))];
}

// ── Reorder list ──────────────────────────────────────────────────────────────
function ReorderList({
  items, onChange, dragSrc, setDragSrc,
}: {
  items: string[];
  onChange: (arr: string[]) => void;
  dragSrc: number | null;
  setDragSrc: (i: number | null) => void;
}) {
  const [dragOver, setDragOver] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    const arr = [...items];
    const [el] = arr.splice(from, 1);
    arr.splice(to, 0, el);
    onChange(arr);
  };

  return (
    <div className="space-y-2">
      {items.map((key, i) => {
        const item = NAV_ITEMS[key];
        const isDragging  = dragSrc === i;
        const isOver      = dragOver === i && dragSrc !== null && dragSrc !== i;
        return (
          <div
            key={key}
            draggable
            onDragStart={e => { setDragSrc(i); e.dataTransfer.effectAllowed = 'move'; }}
            onDragOver={e => { e.preventDefault(); if (i !== dragSrc) setDragOver(i); }}
            onDrop={e => { e.preventDefault(); if (dragSrc !== null && dragSrc !== i) move(dragSrc, i); setDragSrc(null); setDragOver(null); }}
            onDragEnd={() => { setDragSrc(null); setDragOver(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all select-none cursor-grab active:cursor-grabbing ${
              isDragging ? 'opacity-40 scale-95 border-blue-300 bg-blue-50' :
              isOver     ? 'border-blue-400 bg-blue-50 shadow-md scale-[1.01]' :
              'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
            }`}
          >
            <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
            <span className="text-base leading-none">{item.emoji}</span>
            <span className="flex-1 text-sm font-semibold text-gray-700">{item.label}</span>
            <span className="text-xs text-gray-300 font-mono bg-gray-50 px-2 py-0.5 rounded-md">{i + 1}</span>
            <div className="flex flex-col gap-0.5">
              <button onClick={() => i > 0 && move(i, i - 1)} disabled={i === 0}
                className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20 transition-colors">
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => i < items.length - 1 && move(i, i + 1)} disabled={i === items.length - 1}
                className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20 transition-colors">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MenusAdmin() {
  const [desktopOrder, setDesktopOrder]     = useState<string[]>(DEFAULT_ORDER);
  const [mobileOrder,  setMobileOrder]      = useState<string[]>([]);
  const [customMobile, setCustomMobile]     = useState(false);
  const [saving,       setSaving]           = useState(false);
  const [saved,        setSaved]            = useState(false);
  const [desktopDrag,  setDesktopDrag]      = useState<number | null>(null);
  const [mobileDrag,   setMobileDrag]       = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/content/settings').then(r => r.json()).then(d => {
      const desk = normalize(d.navOrder);
      const mob  = d.navOrderMobile?.length ? normalize(d.navOrderMobile) : [];
      setDesktopOrder(desk);
      setMobileOrder(mob.length ? mob : [...desk]);
      setCustomMobile(mob.length > 0);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const existing = await fetch('/api/content/settings').then(r => r.json());
    const payload = {
      ...existing,
      navOrder:       desktopOrder,
      navOrderMobile: customMobile ? mobileOrder : [],
    };
    await fetch('/api/content/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const resetDesktop = () => { setDesktopOrder([...DEFAULT_ORDER]); if (!customMobile) setMobileOrder([...DEFAULT_ORDER]); };
  const resetMobile  = () => setMobileOrder([...desktopOrder]);

  const toggleCustomMobile = (on: boolean) => {
    setCustomMobile(on);
    if (on && mobileOrder.length === 0) setMobileOrder([...desktopOrder]);
  };

  const effectiveMobileOrder = customMobile ? mobileOrder : desktopOrder;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Order</h1>
          <p className="text-sm text-gray-500 mt-0.5">Drag items to reorder, or use the ▲▼ arrows</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60 transition-colors"
          style={{ backgroundColor: saved ? '#00d97e' : '#2c7be5' }}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">

        {/* Desktop Order */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Monitor className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h6 className="font-semibold text-gray-800 text-sm">Desktop Menu</h6>
                <p className="text-xs text-gray-400">Shown in the top navigation bar</p>
              </div>
            </div>
            <button
              onClick={resetDesktop}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 px-2.5 py-1.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <ReorderList
            items={desktopOrder}
            onChange={arr => { setDesktopOrder(arr); if (!customMobile) setMobileOrder(arr); }}
            dragSrc={desktopDrag}
            setDragSrc={setDesktopDrag}
          />

          {/* Fixed items note */}
          <div className="mt-4 pt-4 border-t border-gray-50 space-y-1.5">
            {['Resources ▾ (dropdown)', 'Contact ▾ (dropdown)', 'Search', 'Language Toggle', 'Get In Touch'].map(label => (
              <div key={label} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-dashed border-gray-100 bg-gray-50/60">
                <span className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-xs text-gray-400 italic">{label}</span>
                <span className="text-[10px] text-gray-300 bg-white border border-gray-100 px-2 py-0.5 rounded-md">fixed</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Order */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h6 className="font-semibold text-gray-800 text-sm">Mobile Menu</h6>
                <p className="text-xs text-gray-400">Shown in the hamburger drawer</p>
              </div>
            </div>
            {customMobile && (
              <button
                onClick={resetMobile}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 px-2.5 py-1.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Sync desktop
              </button>
            )}
          </div>

          {/* Custom mobile toggle */}
          <label className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer">
            <div
              onClick={() => toggleCustomMobile(!customMobile)}
              className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${customMobile ? 'bg-purple-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${customMobile ? 'left-5' : 'left-0.5'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Custom mobile order</p>
              <p className="text-xs text-gray-400">{customMobile ? 'Mobile uses its own order' : 'Mobile mirrors desktop order'}</p>
            </div>
          </label>

          <div className={customMobile ? '' : 'opacity-50 pointer-events-none'}>
            <ReorderList
              items={effectiveMobileOrder}
              onChange={setMobileOrder}
              dragSrc={mobileDrag}
              setDragSrc={setMobileDrag}
            />
          </div>
        </div>
      </div>

      {/* Preview strip */}
      <div className="mt-5 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Preview — Desktop Nav Order</p>
        <div className="flex items-center gap-1 flex-wrap">
          {desktopOrder.map((key, i) => (
            <div key={key} className="flex items-center gap-1">
              <span className="text-xs font-semibold px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-gray-600">
                {NAV_ITEMS[key].label}
              </span>
              {i < desktopOrder.length - 1 && <span className="text-gray-200 text-xs">›</span>}
            </div>
          ))}
          {['Resources ▾', 'Contact ▾'].map(label => (
            <div key={label} className="flex items-center gap-1">
              <span className="text-gray-200 text-xs">›</span>
              <span className="text-xs font-semibold px-3 py-1.5 bg-gray-50 border border-dashed border-gray-200 rounded-full text-gray-400 italic">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
