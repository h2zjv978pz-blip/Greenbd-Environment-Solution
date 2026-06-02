'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import { Map, ExternalLink, Save, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import Link from 'next/link';
import {
  DISTRICTS, DIVISIONS, ZONE_TEMP_TREND, ZONE_RAIN_TREND,
  type RiskLevel, type ClimateMapSettings,
} from '@/lib/bangladeshClimateData';

const BangladeshClimateMap = dynamic(() => import('@/components/BangladeshClimateMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-teal-800 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      <p className="text-white/80 text-sm font-semibold">Loading Climate Intelligence Dashboard…</p>
    </div>
  ),
});

// ── Constants ────────────────────────────────────────────────────────────────

type Scenario = 'rcp45' | 'rcp85';
const RISK_LEVELS: RiskLevel[] = ['Very High', 'High', 'Moderate', 'Low', 'Very Low'];
const RISK_COLORS: Record<RiskLevel, string> = {
  'Very High': '#dc2626', 'High': '#f97316', 'Moderate': '#eab308', 'Low': '#22c55e', 'Very Low': '#9ca3af',
};
const INDICATORS = [
  { key: 'rain',     label: '🌧 Rainfall'       },
  { key: 'temp',     label: '🌡 Temperature'     },
  { key: 'humidity', label: '💧 Humidity'        },
  { key: 'slr',      label: '🌊 Sea-Level Rise'  },
  { key: 'flood',    label: '🌊 Flood Events'    },
  { key: 'cyclone',  label: '🌀 Cyclone Events'  },
  { key: 'heatwave', label: '🔥 Heatwave Events' },
  { key: 'drought',  label: '☀ Drought Months'  },
  { key: 'zone',     label: '🗺 Climate Zone'    },
];
const FILTERS = [
  { key: 'all',        label: 'Show All'        },
  { key: 'flood',      label: 'Flood Risk'      },
  { key: 'cyclone',    label: 'Cyclone Risk'    },
  { key: 'drought',    label: 'Drought Risk'    },
  { key: 'heatwave',   label: 'Heatwave Risk'   },
  { key: 'landslide',  label: 'Landslide Risk'  },
  { key: 'salinity',   label: 'Salinity Risk'   },
  { key: 'earthquake', label: 'Earthquake Risk' },
];
const RISK_FIELDS = ['flood', 'cyclone', 'drought', 'heatwave', 'landslide', 'salinity'] as const;

interface EqEvent { year: number; mag: number; lat: number; lng: number; name: string; impact: string }
const DEF_EQ: EqEvent = { year: new Date().getFullYear(), mag: 5.0, lat: 23.8, lng: 90.4, name: '', impact: '' };

type SettingsTab = 'defaults' | 'trends' | 'earthquakes' | 'districts';

// ── Component ────────────────────────────────────────────────────────────────

export default function AdminClimateMapPage() {
  const [data,        setData]        = useState<ClimateMapSettings | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [tab,         setTab]         = useState<SettingsTab>('defaults');
  const [distSearch,  setDistSearch]  = useState('');
  const [distDiv,     setDistDiv]     = useState('all');
  const [eqEditing,   setEqEditing]   = useState<number | 'new' | null>(null);
  const [eqDraft,     setEqDraft]     = useState<EqEvent>(DEF_EQ);
  const savedTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    fetch('/api/climate-map').then(r => r.json()).then((d: ClimateMapSettings) => setData(d)).catch(() => {});
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    await fetch('/api/climate-map', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false); setSaved(true);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2500);
  };

  const setDef = (k: keyof NonNullable<ClimateMapSettings['defaults']>, v: string | number) =>
    setData(d => d ? { ...d, defaults: { ...d.defaults, [k]: v } } : d);

  const setTempTrend = (zone: string, idx: 0 | 1, val: number) =>
    setData(d => {
      if (!d) return d;
      const cur = (d.zoneTempTrends?.[zone] ?? ZONE_TEMP_TREND[zone]) as [number, number];
      const next: [number, number] = [cur[0], cur[1]];
      next[idx] = val;
      return { ...d, zoneTempTrends: { ...d.zoneTempTrends, [zone]: next } };
    });

  const setRainTrend = (zone: string, val: number) =>
    setData(d => d ? { ...d, zoneRainTrends: { ...d.zoneRainTrends, [zone]: val } } : d);

  const saveEq = () => {
    if (!data || !eqDraft.name.trim()) return;
    setData(d => {
      if (!d) return d;
      const eqs = [...(d.earthquakes ?? [])];
      if (eqEditing === 'new') eqs.push(eqDraft);
      else if (typeof eqEditing === 'number') eqs[eqEditing] = eqDraft;
      return { ...d, earthquakes: eqs };
    });
    setEqEditing(null);
  };

  const deleteEq = (idx: number) =>
    setData(d => d ? { ...d, earthquakes: (d.earthquakes ?? []).filter((_, i) => i !== idx) } : d);

  const setRiskOverride = (distId: number, field: typeof RISK_FIELDS[number], val: RiskLevel | '') => {
    setData(d => {
      if (!d) return d;
      const ov = { ...(d.districtRiskOverrides?.[String(distId)] ?? {}) };
      if (val === '') delete ov[field]; else ov[field] = val;
      const newOv = { ...(d.districtRiskOverrides ?? {}) };
      if (Object.keys(ov).length === 0) delete newOv[String(distId)]; else newOv[String(distId)] = ov;
      return { ...d, districtRiskOverrides: newOv };
    });
  };

  if (!data) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );

  const filteredDistricts = DISTRICTS.filter(d =>
    (distDiv === 'all' || d.division === distDiv) &&
    (!distSearch || d.name.en.toLowerCase().includes(distSearch.toLowerCase()))
  );
  const defaults = data.defaults ?? {};

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Map className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Climate Map Parameters</h1>
            <p className="text-xs text-gray-400 mt-0.5">Changes reflect on the map instantly</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-60 shadow-sm">
            {saving  ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> :
             saved   ? <Check className="w-3.5 h-3.5" /> :
                       <Save  className="w-3.5 h-3.5" />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>
          <Link href="/#climate-map" target="_blank"
            className="inline-flex items-center gap-1.5 text-xs px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium shadow-sm transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Public Site
          </Link>
        </div>
      </div>

      {/* ── Body: settings panel | live map ──────────────────────────────── */}
      <div className="-mx-8 -mb-8 flex-1 flex overflow-hidden">

        {/* Settings panel */}
        <div className="w-[420px] flex-shrink-0 flex flex-col border-r border-gray-200 bg-white overflow-hidden">

          {/* Sub-tabs */}
          <div className="flex border-b border-gray-100 flex-shrink-0">
            {([
              ['defaults',   'Defaults'],
              ['trends',     'Zone Trends'],
              ['earthquakes','Earthquakes'],
              ['districts',  'Districts'],
            ] as [SettingsTab, string][]).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 -mb-px ${
                  tab === k ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}>
                {l}
              </button>
            ))}
          </div>

          {/* Tab content (scrollable) */}
          <div className="flex-1 overflow-y-auto p-4">

            {/* ── Defaults ─────────────────────────────────────────────── */}
            {tab === 'defaults' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400">Controls what the map shows when first loaded by a visitor.</p>

                <div>
                  <label className="label-xs">Default Year</label>
                  <div className="flex items-center gap-3 mt-1.5">
                    <input type="range" min="2016" max="2050" value={defaults.year ?? 2025}
                      onChange={e => setDef('year', Number(e.target.value))}
                      className="flex-1" style={{ accentColor: '#059669' }} />
                    <span className="text-sm font-bold text-emerald-700 w-10 text-right tabular-nums">{defaults.year ?? 2025}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-xs">Default Indicator</label>
                    <select value={defaults.indicator ?? 'rain'} onChange={e => setDef('indicator', e.target.value)}
                      className="field mt-1.5 w-full text-xs">
                      {INDICATORS.map(i => <option key={i.key} value={i.key}>{i.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-xs">Default Filter</label>
                    <select value={defaults.filter ?? 'all'} onChange={e => setDef('filter', e.target.value)}
                      className="field mt-1.5 w-full text-xs">
                      {FILTERS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-xs">Default Division</label>
                    <select value={defaults.division ?? 'all'} onChange={e => setDef('division', e.target.value)}
                      className="field mt-1.5 w-full text-xs">
                      <option value="all">All Divisions</option>
                      {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-xs">Play Speed (ms)</label>
                    <input type="number" min="100" max="2000" step="50" value={defaults.playSpeed ?? 380}
                      onChange={e => setDef('playSpeed', Number(e.target.value))}
                      className="field mt-1.5 w-full" />
                  </div>
                </div>

                <div>
                  <label className="label-xs">Default Scenario</label>
                  <div className="flex gap-2 mt-1.5">
                    {(['rcp45', 'rcp85'] as Scenario[]).map(sc => (
                      <button key={sc} onClick={() => setDef('scenario', sc)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                          (defaults.scenario ?? 'rcp45') === sc
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-300'
                        }`}>
                        {sc === 'rcp45' ? 'RCP 4.5' : 'RCP 8.5'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Zone Trends ───────────────────────────────────────────── */}
            {tab === 'trends' && (
              <div>
                <p className="text-xs text-gray-400 mb-3">Post-2025 temperature (°C/yr) and rainfall (mm/yr) projection rates per climate zone.</p>
                <div className="space-y-1">
                  <div className="grid grid-cols-4 gap-1 px-2 mb-2">
                    {['Zone','RCP4.5 T','RCP8.5 T','Rain'].map(h => (
                      <div key={h} className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{h}</div>
                    ))}
                  </div>
                  {Object.keys(ZONE_TEMP_TREND).map(zone => {
                    const c45  = data.zoneTempTrends?.[zone]?.[0] ?? ZONE_TEMP_TREND[zone][0];
                    const c85  = data.zoneTempTrends?.[zone]?.[1] ?? ZONE_TEMP_TREND[zone][1];
                    const rain = data.zoneRainTrends?.[zone] ?? ZONE_RAIN_TREND[zone];
                    const isDirty = data.zoneTempTrends?.[zone] !== undefined || data.zoneRainTrends?.[zone] !== undefined;
                    return (
                      <div key={zone} className={`grid grid-cols-4 gap-1 items-center px-2 py-1.5 rounded-lg ${isDirty ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}>
                        <span className="text-xs font-semibold text-gray-700 truncate" title={zone}>{zone}</span>
                        <input type="number" step="0.001" value={c45}
                          onChange={e => setTempTrend(zone, 0, Number(e.target.value))}
                          className="field text-xs text-center px-1.5 py-1" />
                        <input type="number" step="0.001" value={c85}
                          onChange={e => setTempTrend(zone, 1, Number(e.target.value))}
                          className="field text-xs text-center px-1.5 py-1" />
                        <input type="number" step="0.5" value={rain}
                          onChange={e => setRainTrend(zone, Number(e.target.value))}
                          className="field text-xs text-center px-1.5 py-1" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Earthquakes ───────────────────────────────────────────── */}
            {tab === 'earthquakes' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-400">Events shown in Earthquake Risk filter.</p>
                  <button onClick={() => { setEqDraft(DEF_EQ); setEqEditing('new'); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>

                {eqEditing !== null && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-3">
                    <p className="text-xs font-bold text-emerald-800 mb-2">
                      {eqEditing === 'new' ? '+ New Event' : 'Edit Event'}
                    </p>
                    <div className="space-y-2">
                      <input placeholder="Event name *" value={eqDraft.name}
                        onChange={e => setEqDraft(d => ({ ...d, name: e.target.value }))}
                        className="field w-full text-xs" />
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { k: 'year', label: 'Year', type: 'number' },
                          { k: 'mag',  label: 'Magnitude', type: 'number' },
                          { k: 'lat',  label: 'Latitude', type: 'number' },
                          { k: 'lng',  label: 'Longitude', type: 'number' },
                        ].map(f => (
                          <div key={f.k}>
                            <label className="text-[10px] font-semibold text-gray-500 uppercase">{f.label}</label>
                            <input type={f.type} step={f.k === 'mag' ? '0.1' : f.k === 'lat' || f.k === 'lng' ? '0.01' : '1'}
                              value={(eqDraft as unknown as Record<string, number>)[f.k]}
                              onChange={e => setEqDraft(d => ({ ...d, [f.k]: Number(e.target.value) }))}
                              className="field w-full text-xs" />
                          </div>
                        ))}
                      </div>
                      <textarea placeholder="Impact description" value={eqDraft.impact} rows={2}
                        onChange={e => setEqDraft(d => ({ ...d, impact: e.target.value }))}
                        className="field w-full text-xs resize-none" />
                      <div className="flex gap-2">
                        <button onClick={saveEq}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700">
                          <Check className="w-3 h-3" /> Save
                        </button>
                        <button onClick={() => setEqEditing(null)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50">
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  {(data.earthquakes ?? []).sort((a, b) => b.year - a.year).map((eq, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 text-base">⚡</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-gray-800">{eq.name}</span>
                          <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">M{eq.mag}</span>
                          <span className="text-[10px] text-gray-400">{eq.year}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{eq.impact}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => {
                          const realIdx = (data.earthquakes ?? []).findIndex(e => e === eq);
                          setEqDraft({ ...eq });
                          setEqEditing(realIdx);
                        }}
                          className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors">
                          <Edit2 className="w-3 h-3 text-gray-400" />
                        </button>
                        <button onClick={() => deleteEq((data.earthquakes ?? []).findIndex(e => e === eq))}
                          className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                          <Trash2 className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── District Risks ─────────────────────────────────────────── */}
            {tab === 'districts' && (
              <div>
                <div className="flex gap-2 mb-3">
                  <input type="text" placeholder="Search…" value={distSearch}
                    onChange={e => setDistSearch(e.target.value)}
                    className="field flex-1 text-xs" />
                  <select value={distDiv} onChange={e => setDistDiv(e.target.value)}
                    className="field text-xs">
                    <option value="all">All Divs.</option>
                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <p className="text-[10px] text-gray-400 mb-3">
                  {Object.keys(data.districtRiskOverrides ?? {}).length} override(s) active.
                  Select a value to override; leave blank to use default.
                </p>

                <div className="space-y-1">
                  {filteredDistricts.map(d => {
                    const ov = data.districtRiskOverrides?.[String(d.id)] ?? {};
                    const hasOv = Object.keys(ov).length > 0;
                    return (
                      <div key={d.id} className={`rounded-xl border p-2.5 transition-colors ${hasOv ? 'border-emerald-200 bg-emerald-50/60' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                        <div className="flex items-center gap-1.5 mb-2">
                          {hasOv && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
                          <span className="text-xs font-bold text-gray-800">{d.name.en}</span>
                          <span className="text-[10px] text-gray-400">{d.division}</span>
                          {hasOv && (
                            <button onClick={() => setData(d2 => {
                              if (!d2) return d2;
                              const n = { ...(d2.districtRiskOverrides ?? {}) };
                              delete n[String(d.id)];
                              return { ...d2, districtRiskOverrides: n };
                            })}
                              className="ml-auto text-[10px] text-red-400 hover:text-red-600">Reset</button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {RISK_FIELDS.map(field => {
                            const def   = d.risks[field];
                            const ovVal = ov[field];
                            return (
                              <div key={field}>
                                <div className="text-[9px] font-bold text-gray-400 uppercase mb-0.5 truncate">{field}</div>
                                <select value={ovVal ?? ''}
                                  onChange={e => setRiskOverride(d.id, field, e.target.value as RiskLevel | '')}
                                  className={`w-full rounded-md border text-[10px] px-1 py-0.5 focus:outline-none ${
                                    ovVal ? 'border-emerald-300 bg-emerald-50 font-bold' : 'border-gray-200 bg-white text-gray-500'
                                  }`}
                                  style={{ color: ovVal ? RISK_COLORS[ovVal] : undefined }}>
                                  <option value="">({def})</option>
                                  {RISK_LEVELS.map(rl => (
                                    <option key={rl} value={rl} style={{ color: RISK_COLORS[rl] }}>{rl}</option>
                                  ))}
                                </select>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Live Map ─────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden">
          <BangladeshClimateMap height="100%" externalSettings={data} />
        </div>

      </div>
    </div>
  );
}
