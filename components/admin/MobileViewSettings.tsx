'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Smartphone, Save, Check, Eye, EyeOff, LayoutList,
  Presentation, Info, Wrench, FolderOpen, BarChart3,
  Map, BookOpen, Users, Building2, Phone, RefreshCw,
  Music2, AlignJustify, ChevronsDown, SlidersHorizontal,
  Type, AlignLeft, AlignCenter, AlignRight, Rows3,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Typography {
  headingSize:    string;
  bodySize:       string;
  textAlign:      string;
  lineHeight:     string;
  buttonSize:     string;
  sectionSpacing: string;
}
interface Layout {
  heroLayout:      string;
  projectColumns:  string;
  servicesColumns: string;
  cardStyle:       string;
}
interface MobileSettings {
  sections:           Record<string, boolean>;
  compactHeader:      boolean;
  showAmbientPlayer:  boolean;
  stickyHeader:       boolean;
  showScrollHint:     boolean;
  typography:         Typography;
  layout:             Layout;
}

const DEF: MobileSettings = {
  sections:          { hero:true, about:true, services:true, projects:true, stats:true, climateMap:true, research:true, team:true, clients:true, contact:true },
  compactHeader:     false,
  showAmbientPlayer: true,
  stickyHeader:      true,
  showScrollHint:    true,
  typography: { headingSize:'xl', bodySize:'base', textAlign:'center', lineHeight:'normal', buttonSize:'lg', sectionSpacing:'normal' },
  layout:     { heroLayout:'full', projectColumns:'2', servicesColumns:'1', cardStyle:'rounded' },
};

// ── Section metadata ──────────────────────────────────────────────────────────
const SECTION_META = [
  { key:'hero',       label:'Hero Slider',          icon:Presentation },
  { key:'about',      label:'About Us',              icon:Info         },
  { key:'mdMessage',  label:'MD Message (About)',    icon:Info         },
  { key:'services',   label:'Services',              icon:Wrench       },
  { key:'projects',   label:'Projects',              icon:FolderOpen   },
  { key:'stats',      label:'Statistics',            icon:BarChart3    },
  { key:'climateMap', label:'Climate Map',           icon:Map          },
  { key:'research',   label:'Research',              icon:BookOpen     },
  { key:'team',       label:'Team',                  icon:Users        },
  { key:'clients',    label:'Clients',               icon:Building2    },
  { key:'contact',    label:'Contact',               icon:Phone        },
];

const GLOBAL_META = [
  { key:'stickyHeader',      label:'Sticky Header',         icon:AlignJustify      },
  { key:'compactHeader',     label:'Compact Header',        icon:SlidersHorizontal },
  { key:'showAmbientPlayer', label:'Ambient Music Player',  icon:Music2            },
  { key:'showScrollHint',    label:'Scroll Hint Arrow',     icon:ChevronsDown      },
];

// ── Dropdown options ──────────────────────────────────────────────────────────
const HEADING_SIZES   = [{ v:'sm',  l:'Small'      },{ v:'base', l:'Normal'     },{ v:'xl',  l:'Large'      },{ v:'2xl', l:'Extra Large'},{ v:'3xl', l:'XXL'        }];
const BODY_SIZES      = [{ v:'xs',  l:'Extra Small'},{ v:'sm',   l:'Small'      },{ v:'base',l:'Normal'     },{ v:'lg',  l:'Large'      }];
const LINE_HEIGHTS    = [{ v:'tight',  l:'Compact' },{ v:'normal',l:'Normal'    },{ v:'relaxed',l:'Relaxed' },{ v:'loose',l:'Spacious'  }];
const BUTTON_SIZES    = [{ v:'sm',  l:'Small'      },{ v:'base', l:'Medium'     },{ v:'lg',  l:'Large'      },{ v:'xl',  l:'Extra Large'}];
const SPACING_OPTS    = [{ v:'compact', l:'Compact'},{ v:'normal',l:'Normal'    },{ v:'spacious',l:'Spacious'}];
const HERO_LAYOUTS    = [{ v:'full', l:'Full Screen'},{ v:'compact',l:'Compact' },{ v:'split',l:'Split'     }];
const PROJECT_COLS    = [{ v:'1', l:'1 Column'    },{ v:'2', l:'2 Columns'    },{ v:'3', l:'3 Columns'   }];
const SERVICE_COLS    = [{ v:'1', l:'1 Column'    },{ v:'2', l:'2 Columns'    }];
const CARD_STYLES     = [{ v:'rounded',l:'Rounded'  },{ v:'pill',l:'Pill'       },{ v:'square',l:'Square'   },{ v:'flat',l:'Flat'      }];

// ── Small helpers ─────────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-emerald-500' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

function Sel({ value, options, onChange, label }: { value: string; options:{v:string;l:string}[]; onChange:(v:string)=>void; label:string }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:border-indigo-400 bg-white">
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

type Tab = 'sections' | 'global' | 'text';

// ── Main component ────────────────────────────────────────────────────────────
export default function MobileViewSettings() {
  const [cfg,    setCfg]    = useState<MobileSettings>(DEF);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [tab,    setTab]    = useState<Tab>('sections');
  const [preview,setPreview]= useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    fetch('/api/mobile-settings').then(r => r.json())
      .then((d: Partial<MobileSettings>) => setCfg({
        ...DEF, ...d,
        sections:   { ...DEF.sections,   ...(d.sections   ?? {}) },
        typography: { ...DEF.typography, ...(d.typography ?? {}) },
        layout:     { ...DEF.layout,     ...(d.layout     ?? {}) },
      }))
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/mobile-settings', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(cfg) });
    setSaving(false); setSaved(true);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2200);
  };

  const toggleSection = (key: string) => setCfg(c => ({ ...c, sections: { ...c.sections, [key]: !c.sections[key] } }));
  const toggleGlobal  = (key: keyof MobileSettings) => setCfg(c => ({ ...c, [key]: !c[key] }));
  const setTypo  = (k: keyof Typography, v: string) => setCfg(c => ({ ...c, typography: { ...c.typography, [k]: v } }));
  const setLayout= (k: keyof Layout,    v: string) => setCfg(c => ({ ...c, layout:     { ...c.layout,     [k]: v } }));

  const hiddenCount = Object.values(cfg.sections).filter(v => !v).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-[18px] h-[18px] text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Mobile View Settings</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {hiddenCount === 0 ? 'All sections visible' : `${hiddenCount} section${hiddenCount>1?'s':''} hidden on mobile`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPreview(p => !p)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${preview ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
            <Smartphone className="w-3.5 h-3.5" /> {preview ? 'Hide' : 'Preview'}
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-60">
            {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             : saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-100 bg-gray-50/50">
        {([
          ['sections', 'Sections',    LayoutList],
          ['global',   'Options',     SlidersHorizontal],
          ['text',     'Text & Layout', Type],
        ] as [Tab, string, React.ComponentType<{className?:string}>][]).map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex items-center justify-center gap-1.5 flex-1 py-2.5 text-xs font-bold border-b-2 transition-all
              ${tab===k ? 'border-indigo-500 text-indigo-700 bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            <Icon className="w-3.5 h-3.5" /><span className="hidden xs:inline">{l}</span><span className="xs:hidden">{l.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <div className={preview ? 'flex flex-col sm:flex-row' : ''}>

        {/* ── Settings panel ─────────────────────────────────────── */}
        <div className={`${preview ? 'sm:w-1/2' : 'w-full'} p-4`}>

          {/* SECTIONS TAB */}
          {tab === 'sections' && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Section visibility on mobile</p>
                <div className="flex gap-3">
                  <button onClick={() => setCfg(c=>({...c,sections:Object.fromEntries(SECTION_META.map(s=>[s.key,true]))}))}
                    className="text-[10px] text-emerald-600 font-bold hover:underline">All on</button>
                  <button onClick={() => setCfg(c=>({...c,sections:Object.fromEntries(SECTION_META.map(s=>[s.key,false]))}))}
                    className="text-[10px] text-red-400 font-bold hover:underline">All off</button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {SECTION_META.map(({ key, label, icon: Icon }) => {
                  const on = cfg.sections[key] !== false;
                  return (
                    <div key={key} onClick={() => toggleSection(key)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all select-none
                        ${on ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${on ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-sm font-semibold flex-1 ${on ? 'text-gray-800' : 'text-gray-400'}`}>{label}</span>
                      <div className="flex items-center gap-1.5">
                        {on ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
                        <Toggle on={on} onChange={() => toggleSection(key)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* GLOBAL OPTIONS TAB */}
          {tab === 'global' && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Mobile behaviour toggles</p>
              {GLOBAL_META.map(({ key, label, icon: Icon }) => {
                const on = !!(cfg as unknown as Record<string,unknown>)[key];
                return (
                  <div key={key} onClick={() => toggleGlobal(key as keyof MobileSettings)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl border cursor-pointer transition-all select-none
                      ${on ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${on ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-sm font-semibold flex-1 ${on ? 'text-gray-800' : 'text-gray-400'}`}>{label}</span>
                    <Toggle on={on} onChange={() => toggleGlobal(key as keyof MobileSettings)} />
                  </div>
                );
              })}
            </div>
          )}

          {/* TEXT & LAYOUT TAB */}
          {tab === 'text' && (
            <div className="space-y-5">

              {/* Typography */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Type className="w-3.5 h-3.5 text-purple-500" />
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Typography</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Sel label="Heading Size" value={cfg.typography.headingSize}
                    options={HEADING_SIZES} onChange={v => setTypo('headingSize', v)} />
                  <Sel label="Body Text Size" value={cfg.typography.bodySize}
                    options={BODY_SIZES} onChange={v => setTypo('bodySize', v)} />
                  <Sel label="Line Height" value={cfg.typography.lineHeight}
                    options={LINE_HEIGHTS} onChange={v => setTypo('lineHeight', v)} />
                  <Sel label="Section Spacing" value={cfg.typography.sectionSpacing}
                    options={SPACING_OPTS} onChange={v => setTypo('sectionSpacing', v)} />
                  <Sel label="Button Size" value={cfg.typography.buttonSize}
                    options={BUTTON_SIZES} onChange={v => setTypo('buttonSize', v)} />
                </div>

                {/* Text Alignment */}
                <div className="mt-3">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Text Alignment</label>
                  <div className="flex gap-2">
                    {[['left','Left',AlignLeft],['center','Center',AlignCenter],['right','Right',AlignRight]].map(([v, l, Icon]) => {
                      const Ic = Icon as React.ComponentType<{className?:string}>;
                      const active = cfg.typography.textAlign === v;
                      return (
                        <button key={v as string} onClick={() => setTypo('textAlign', v as string)}
                          className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border text-xs font-bold transition-all
                            ${active ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-200 text-gray-500 hover:border-purple-300 bg-white'}`}>
                          <Ic className="w-4 h-4" />
                          <span className="text-[10px]">{l as string}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Layout */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Rows3 className="w-3.5 h-3.5 text-blue-500" />
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Layout Options</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Sel label="Hero Layout" value={cfg.layout.heroLayout}
                    options={HERO_LAYOUTS} onChange={v => setLayout('heroLayout', v)} />
                  <Sel label="Card Style" value={cfg.layout.cardStyle}
                    options={CARD_STYLES} onChange={v => setLayout('cardStyle', v)} />
                  <Sel label="Projects Grid" value={cfg.layout.projectColumns}
                    options={PROJECT_COLS} onChange={v => setLayout('projectColumns', v)} />
                  <Sel label="Services Grid" value={cfg.layout.servicesColumns}
                    options={SERVICE_COLS} onChange={v => setLayout('servicesColumns', v)} />
                </div>
              </div>

              {/* Live preview snippet */}
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Preview — Text Sizes</p>
                <div style={{ textAlign: cfg.typography.textAlign as 'left'|'center'|'right', lineHeight: cfg.typography.lineHeight === 'tight' ? 1.3 : cfg.typography.lineHeight === 'relaxed' ? 1.8 : cfg.typography.lineHeight === 'loose' ? 2 : 1.6 }}>
                  <p className="font-bold text-gray-800 mb-1" style={{ fontSize: { sm:'14px',base:'16px',xl:'20px','2xl':'24px','3xl':'28px' }[cfg.typography.headingSize] ?? '20px' }}>
                    Environmental Solutions
                  </p>
                  <p className="text-gray-500" style={{ fontSize: { xs:'11px',sm:'12px',base:'14px',lg:'16px' }[cfg.typography.bodySize] ?? '14px' }}>
                    Building climate resilience across Bangladesh through science-led solutions.
                  </p>
                  <button className="mt-2 bg-primary-600 text-white rounded-lg font-semibold"
                    style={{ padding: { sm:'4px 12px',base:'6px 16px',lg:'8px 20px',xl:'10px 24px' }[cfg.typography.buttonSize] ?? '8px 20px', fontSize: { sm:'11px',base:'13px',lg:'14px',xl:'15px' }[cfg.typography.buttonSize] ?? '13px' }}>
                    Explore Our Work
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phone preview */}
        {preview && (
          <div className="sm:w-1/2 p-4 bg-gray-50 border-t sm:border-t-0 sm:border-l border-gray-100 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-between w-full mb-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Live Preview</p>
              <button onClick={() => { const f=document.getElementById('mob-preview') as HTMLIFrameElement; if(f) {f.src='';f.src='/';} }}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
            <div className="relative bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl w-[200px]">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-700 rounded-full" />
              <div className="rounded-[2rem] overflow-hidden bg-white" style={{ height: 380 }}>
                <iframe id="mob-preview" src="/" title="Mobile preview" className="w-full h-full border-0"
                  style={{ transform:'scale(0.55)',transformOrigin:'top left',width:'182%',height:'182%' }} />
              </div>
              <div className="flex justify-center mt-2"><div className="w-12 h-1 bg-gray-600 rounded-full" /></div>
            </div>
            <p className="text-[10px] text-gray-400 text-center">Save → Refresh to see changes</p>
          </div>
        )}
      </div>
    </div>
  );
}
