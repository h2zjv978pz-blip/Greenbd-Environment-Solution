'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ScatterController, Tooltip, Legend,
} from 'chart.js';
import { Line, Scatter } from 'react-chartjs-2';
import {
  DISTRICTS, YEARS, ZONE_COLORS, SEISMIC_COLORS, SEISMIC_ZONE_INFO,
  EARTHQUAKES, DIVISIONS, getYearData, indicatorColor, RISK_COLORS,
  type District, type Scenario, type TrendOverrides,
  type ClimateMapSettings,
} from '@/lib/bangladeshClimateData';
// useLanguage kept available for future bilingual support

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement,
  ScatterController, Tooltip, Legend);

const INDICATORS = [
  { key: 'rain',     label: '🌧 Rainfall'        },
  { key: 'temp',     label: '🌡 Temperature'      },
  { key: 'humidity', label: '💧 Humidity'         },
  { key: 'slr',      label: '🌊 Sea-Level Rise'   },
  { key: 'flood',    label: '🌊 Flood Events'     },
  { key: 'cyclone',  label: '🌀 Cyclone Events'   },
  { key: 'heatwave', label: '🔥 Heatwave Events'  },
  { key: 'drought',  label: '☀ Drought Months'   },
  { key: 'zone',     label: '🗺 Climate Zone'     },
];

const FILTERS = [
  { key:'all',        icon:'🗺', label:'Show All'        },
  { key:'flood',      icon:'🌊', label:'Flood Risk'      },
  { key:'cyclone',    icon:'🌀', label:'Cyclone Risk'    },
  { key:'drought',    icon:'☀', label:'Drought Risk'    },
  { key:'heatwave',   icon:'🔥', label:'Heatwave Risk'  },
  { key:'landslide',  icon:'⛰', label:'Landslide Risk' },
  { key:'salinity',   icon:'💧', label:'Salinity Risk'  },
  { key:'earthquake', icon:'⚡', label:'Earthquake Risk' },
];

const SEISMIC_LABELS: Record<string, string> = {
  IV:'Zone IV — Very High', III:'Zone III — High', II:'Zone II — Moderate', I:'Zone I — Low',
};

type Tab = 'climate' | 'hazards' | 'seismic';

interface Props { compact?: boolean; height?: string; externalSettings?: ClimateMapSettings }

export default function BangladeshClimateMap({ compact = false, height = '100vh', externalSettings }: Props) {
  const mapRef     = useRef<HTMLDivElement>(null);
  const mapInst    = useRef<import('leaflet').Map | null>(null);
  const mrkRef     = useRef<Map<number, import('leaflet').CircleMarker>>(new Map());
  const eqRef       = useRef<import('leaflet').CircleMarker[]>([]);
  const playRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const settingsRef = useRef<ClimateMapSettings>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lRef        = useRef<any>(null);
  const baseTileRef  = useRef<import('leaflet').TileLayer | null>(null);
  const labelTileRef = useRef<import('leaflet').TileLayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [year,           setYear]           = useState(2025);
  const [scenario,       setScenario]       = useState<Scenario>('rcp45');
  const [indicator,      setIndicator]      = useState('rain');
  const [filter,         setFilter]         = useState('all');
  const [division,       setDivision]       = useState('all');
  const [selected,       setSelected]       = useState<District | null>(null);
  const [playing,        setPlaying]        = useState(false);
  const [tab,            setTab]            = useState<Tab>('climate');
  const [mapReady,       setMapReady]       = useState(false);
  const [settingsReady,  setSettingsReady]  = useState(false);
  const [markerTick,     setMarkerTick]     = useState(0);
  const [basemap,        setBasemap]        = useState<'street'|'satellite'|'hybrid'>('street');
  const [isMobile,       setIsMobile]       = useState(false);
  const [mobileSheet,    setMobileSheet]    = useState<'none'|'controls'|'detail'>('none');
  const [mapInView,      setMapInView]      = useState(false);

  // ── Fetch saved settings ──────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/climate-map')
      .then(r => r.json())
      .then((d: ClimateMapSettings) => {
        settingsRef.current = d;
        const def = d.defaults ?? {};
        if (def.year)      setYear(def.year);
        if (def.scenario)  setScenario(def.scenario as Scenario);
        if (def.indicator) setIndicator(def.indicator);
        if (def.filter)    setFilter(def.filter);
        if (def.division)  setDivision(def.division);
      })
      .catch(() => {})
      .finally(() => setSettingsReady(true));
  }, []);

  // ── Mobile detection ─────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Only show mobile overlays when map is visible in viewport ────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { setMapInView(entry.isIntersecting); if (!entry.isIntersecting) setMobileSheet('none'); },
      { threshold: 0.1 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Live-sync external settings (admin panel) ────────────────────────────
  useEffect(() => {
    if (!externalSettings) return;
    settingsRef.current = externalSettings;
    // Sync map defaults so the preview matches what the admin is editing
    const def = externalSettings.defaults ?? {};
    if (def.year      !== undefined) setYear(def.year);
    if (def.indicator !== undefined) setIndicator(def.indicator);
    if (def.scenario  !== undefined) setScenario(def.scenario as Scenario);
    if (def.filter    !== undefined) setFilter(def.filter);
    if (def.division  !== undefined) setDivision(def.division);
    // Bump tick so marker update effect re-runs even when map state values are unchanged
    setMarkerTick(t => t + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSettings]);

  // ── Init map ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!settingsReady || !mapRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((mapRef.current as any)._leaflet_id != null) {
      mapInst.current?.remove(); mapInst.current = null;
    }
    let destroyed = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (destroyed || !mapRef.current) return;
      lRef.current = L;

      const map = L.map(mapRef.current, {
        center: [23.6, 90.3], zoom: compact ? 6 : 7,
        minZoom: 6, maxZoom: 21,
        zoomControl: !compact, scrollWheelZoom: !compact, dragging: !compact,
      });
      mapInst.current = map;

      baseTileRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19, opacity: 0.75,
      }).addTo(map);
      labelTileRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '© CARTO', maxZoom: 20, opacity: 0.95,
      }).addTo(map);

      DISTRICTS.forEach(d => {
        const m = L.circleMarker([d.lat, d.lng], {
          radius: 13, fillColor: d.zoneColor, color: '#fff',
          weight: 1.5, opacity: 1, fillOpacity: 0.85,
        }).addTo(map);
        m.bindTooltip(`<b>${d.name.en}</b><br/>${d.division} · ${d.zone}`, { direction: 'top' });
        m.on('click', () => { setSelected(d); setTab('climate'); setMobileSheet('detail'); });
        m.on('mouseover', () => { m.setStyle({ fillOpacity: 1, weight: 3 }); });
        m.on('mouseout',  () => { m.setStyle({ fillOpacity: 0.85, weight: 1.5 }); });
        mrkRef.current.set(d.id, m);
      });

      const activeEQ = settingsRef.current.earthquakes ?? EARTHQUAKES;
      activeEQ.forEach(eq => {
        const size = Math.max(8, (eq.mag - 4) * 7);
        const em = L.circleMarker([eq.lat, eq.lng], {
          radius: size, fillColor: '#fbbf24', color: '#92400e',
          weight: 2, fillOpacity: 0, opacity: 0,
        }).addTo(map);
        em.bindTooltip(
          `<b>⚡ ${eq.name}</b><br/>Year: ${eq.year} · M${eq.mag}<br/><i>${eq.impact}</i>`,
          { direction: 'top' }
        );
        eqRef.current.push(em);
      });

      setMapReady(true);
      // Force Leaflet to recalculate tile coverage after React renders the container
      setTimeout(() => { if (!destroyed) map.invalidateSize(); }, 50);
    })();
    return () => {
      destroyed = true;
      mapInst.current?.remove(); mapInst.current = null;
      mrkRef.current.clear(); eqRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compact, settingsReady]);

  // ── Update markers ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapInst.current) return;
    const showEQ = filter === 'earthquake';

    eqRef.current.forEach(em =>
      em.setStyle({ fillOpacity: showEQ ? 0.85 : 0, opacity: showEQ ? 1 : 0 })
    );

    const trendOv: TrendOverrides = {
      zoneTempTrends: settingsRef.current.zoneTempTrends,
      zoneRainTrends: settingsRef.current.zoneRainTrends,
    };
    const riskOv = settingsRef.current.districtRiskOverrides ?? {};

    DISTRICTS.forEach(d => {
      const m = mrkRef.current.get(d.id); if (!m) return;
      const vis = division === 'all' || d.division === division;
      let color = d.zoneColor, radius = 13;
      const effectiveRisks = { ...d.risks, ...(riskOv[String(d.id)] ?? {}) };

      if (showEQ) {
        color  = SEISMIC_COLORS[d.seismicZone];
        radius = d.seismicZone==='IV'?19: d.seismicZone==='III'?16: d.seismicZone==='II'?13:10;
      } else if (filter !== 'all') {
        const risk = effectiveRisks[filter as keyof typeof effectiveRisks];
        color  = RISK_COLORS[risk];
        radius = risk==='Very High'?20: risk==='High'?17: risk==='Moderate'?14: risk==='Low'?11:8;
      } else if (indicator === 'zone') {
        color = d.zoneColor;
      } else {
        const val = getYearData(d, year, scenario, trendOv)[indicator as keyof ReturnType<typeof getYearData>] as number;
        color = indicatorColor(indicator, val);
      }

      m.setRadius(radius);
      m.setStyle({ fillColor: color, fillOpacity: vis ? 0.85 : 0, opacity: vis ? 1 : 0 });
    });
  }, [mapReady, year, scenario, indicator, filter, division, markerTick]);

  // ── Play animation ────────────────────────────────────────────────────────
  useEffect(() => {
    if (playing) {
      playRef.current = setInterval(() => {
        setYear(y => { const n = y + 1; return n > 2050 ? 2016 : n; });
      }, 380);
    } else {
      if (playRef.current) clearInterval(playRef.current);
    }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [playing]);

  // ── Basemap switcher ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapInst.current || !lRef.current) return;
    const L   = lRef.current;
    const map = mapInst.current;

    // Remove existing base layers
    if (baseTileRef.current)  { map.removeLayer(baseTileRef.current);  baseTileRef.current  = null; }
    if (labelTileRef.current) { map.removeLayer(labelTileRef.current); labelTileRef.current = null; }

    if (basemap === 'street') {
      baseTileRef.current  = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19, opacity: 0.75,
      }).addTo(map);
      labelTileRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '© CARTO', maxZoom: 20, opacity: 0.95,
      }).addTo(map);
    } else if (basemap === 'satellite') {
      baseTileRef.current = L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'] as unknown as string,
        attribution: '© Google Earth', maxZoom: 21,
      }).addTo(map);
    } else {
      // hybrid — satellite + road/label overlay
      baseTileRef.current = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'] as unknown as string,
        attribution: '© Google Earth', maxZoom: 21,
      }).addTo(map);
    }

    // Bring marker overlay pane back to front (Leaflet panes ensure this, but force a re-sort)
    map.getPane('overlayPane')!.style.zIndex = '400';
  }, [mapReady, basemap]);

  // ── Compact mode ──────────────────────────────────────────────────────────
  if (compact) return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg" style={{ height: 340, isolation: 'isolate' }}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );

  const isProjected = year > 2025;
  const trendOvCalc: TrendOverrides = {
    zoneTempTrends: settingsRef.current.zoneTempTrends,
    zoneRainTrends: settingsRef.current.zoneRainTrends,
  };
  const selData = selected ? getYearData(selected, year, scenario, trendOvCalc) : null;

  // Chart data for selected district
  const temps45 = selected ? YEARS.map(y => getYearData(selected, y, 'rcp45', trendOvCalc).temp) : [];
  const temps85 = selected ? YEARS.map(y => getYearData(selected, y, 'rcp85', trendOvCalc).temp) : [];
  const rains45 = selected ? YEARS.map(y => getYearData(selected, y, 'rcp45', trendOvCalc).rain) : [];
  const rains85 = selected ? YEARS.map(y => getYearData(selected, y, 'rcp85', trendOvCalc).rain) : [];

  const scatterPts = selected ? YEARS.map(y => ({
    x: getYearData(selected, y, scenario, trendOvCalc).temp,
    y: getYearData(selected, y, scenario, trendOvCalc).rain,
  })) : [];
  const scatterColors = YEARS.map(y => y <= 2025 ? '#0ea5e9' : '#dc2626');

  // Nearby earthquakes — use fetched events if available
  const activeEQList = settingsRef.current.earthquakes ?? EARTHQUAKES;
  const nearbyEQ = selected
    ? activeEQList.filter(e => {
        const dlat = e.lat - selected.lat, dlng = e.lng - selected.lng;
        return Math.sqrt(dlat*dlat + dlng*dlng) < 3.5;
      }).slice(0, 5)
    : [];

  // Avg stats for header badges
  const filteredD = DISTRICTS.filter(d => division==='all' || d.division===division);
  const avgTemp = (filteredD.reduce((s,d)=>s+getYearData(d,year,scenario,trendOvCalc).temp,0)/filteredD.length).toFixed(1);
  const avgRain = Math.round(filteredD.reduce((s,d)=>s+getYearData(d,year,scenario,trendOvCalc).rain,0)/filteredD.length);
  const avgSLR  = (filteredD.reduce((s,d)=>s+getYearData(d,year,scenario,trendOvCalc).slr,0)/filteredD.length).toFixed(1);

  return (
    <div ref={containerRef} style={{ display:'flex', flexDirection:'column', height,
                  fontFamily:"'Inter',sans-serif", background:'#f1f5f9',
                  overflow:'hidden' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header style={{ background:'linear-gradient(135deg,#0f4c3a 0%,#1a6b52 100%)',
                       color:'white', padding: isMobile ? '0 12px' : '0 20px',
                       height: isMobile ? '44px' : '60px',
                       display:'flex', alignItems:'center', justifyContent:'space-between',
                       flexShrink:0, boxShadow:'0 4px 12px rgba(0,0,0,0.2)', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
          <div style={{ width: isMobile?28:36, height: isMobile?28:36, background:'rgba(255,255,255,0.15)',
                        borderRadius:8, display:'flex', alignItems:'center',
                        justifyContent:'center', fontSize: isMobile?16:20, flexShrink:0 }}>🇧🇩</div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize: isMobile?13:16, letterSpacing:'-0.3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {isMobile ? 'Climate Map 2016–2050' : 'Bangladesh Climate Intelligence 2016–2050'}
            </div>
            {!isMobile && <div style={{ fontSize:11, opacity:0.85 }}>64 Districts · Historical Data · IPCC AR6 Projections · Earthquake Risk</div>}
          </div>
        </div>
        {/* Stats badges — scrollable on mobile */}
        <div style={{ display:'flex', gap: isMobile?6:10, overflowX:'auto', flexShrink:0 }}>
          {[['🌡',`${avgTemp}°C`],['🌧',`${avgRain.toLocaleString()}mm`],['🌊',`${avgSLR}cm`]].map(([ic,val])=>(
            <div key={String(val)} style={{ display:'flex', alignItems:'center', gap:4,
                           background:'rgba(255,255,255,0.12)', padding: isMobile?'3px 8px':'5px 11px',
                           borderRadius:20, fontSize: isMobile?10:12, fontWeight:500, whiteSpace:'nowrap', flexShrink:0 }}>
              <span>{ic}</span><span>{val}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ── Timeline Controls ──────────────────────────────────────────── */}
      <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', flexShrink:0,
                    padding: isMobile ? '6px 10px' : '0 20px',
                    minHeight: isMobile ? 'auto' : '48px',
                    display:'flex', flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? 5 : 14 }}>
        {/* Row 1 (mobile) / single row (desktop): play + slider + year */}
        <div style={{ display:'flex', alignItems:'center', gap: isMobile?8:14, flex:1 }}>
          <button onClick={()=>setPlaying(p=>!p)}
            style={{ width:30, height:30, borderRadius:'50%', border:'none', cursor:'pointer',
                     background:'linear-gradient(135deg,#0f4c3a,#1a6b52)', color:'white',
                     fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {playing ? '⏸' : '▶'}
          </button>
          <div style={{ flex:1 }}>
            {!isMobile && <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'#64748b', fontWeight:600, marginBottom:3 }}>
              {[2016,2020,2025,2030,2035,2040,2045,2050].map(y=><span key={y}>{y}</span>)}
            </div>}
            <input type="range" min="2016" max="2050" value={year}
              onChange={e=>{ setYear(Number(e.target.value)); setPlaying(false); }}
              style={{ width:'100%', accentColor:'#0f4c3a', height:6 }} />
          </div>
          <div style={{ textAlign:'center', minWidth: isMobile?56:80 }}>
            <div style={{ fontSize: isMobile?18:22, fontWeight:800, color:'#0f4c3a', lineHeight:1 }}>{year}</div>
            <div style={{ fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:4, marginTop:2,
                          background: isProjected?'#fef3c7':'#f0fdf4',
                          color: isProjected?'#92400e':'#166534' }}>
              {isProjected ? 'PROJ' : 'HIST'}
            </div>
          </div>
        </div>
        {/* Row 2 (mobile) / inline (desktop): scenario + indicator */}
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <div style={{ display:'flex', background:'#f1f5f9', borderRadius:8, padding:3, gap:3 }}>
            {(['rcp45','rcp85'] as Scenario[]).map(sc=>(
              <button key={sc} onClick={()=>setScenario(sc)}
                style={{ border:'none', padding: isMobile?'4px 8px':'5px 13px', borderRadius:6, cursor:'pointer',
                         fontSize: isMobile?11:12, fontWeight:600, transition:'all 0.2s',
                         background: scenario===sc?'white':'transparent',
                         color: scenario===sc?'#0f4c3a':'#475569',
                         boxShadow: scenario===sc?'0 2px 4px rgba(0,0,0,0.1)':'none' }}>
                {sc==='rcp45'?'4.5':'8.5'}
              </button>
            ))}
          </div>
          <select value={indicator} onChange={e=>setIndicator(e.target.value)}
            style={{ border:'1px solid #e2e8f0', borderRadius:8, padding: isMobile?'4px 6px':'5px 10px',
                     fontSize: isMobile?11:12, fontWeight:600, color:'#0f172a', background:'white',
                     cursor:'pointer', outline:'none', flex: isMobile?1:'none' }}>
            {INDICATORS.map(i=><option key={i.key} value={i.key}>{i.label}</option>)}
          </select>
        </div>
      </div>

      {/* ── Mobile parameter strip ─────────────────────────────────────── */}
      {isMobile && (
        <div style={{ background:'#0f4c3a', overflowX:'auto', flexShrink:0,
                      display:'flex', alignItems:'center', gap:6, padding:'6px 10px',
                      scrollbarWidth:'none' }}>
          {/* Year chip */}
          <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(255,255,255,0.15)',
                        borderRadius:20, padding:'4px 10px', whiteSpace:'nowrap', flexShrink:0 }}>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.7)' }}>📅</span>
            <span style={{ fontSize:12, fontWeight:800, color:'white' }}>{year}</span>
            <span style={{ fontSize:9, fontWeight:700, padding:'1px 5px', borderRadius:4,
                           background: isProjected?'#fef3c7':'#f0fdf4',
                           color: isProjected?'#92400e':'#166534' }}>
              {isProjected?'PROJ':'HIST'}
            </span>
          </div>
          {/* Scenario chip */}
          <div style={{ display:'flex', alignItems:'center', gap:3, background:'rgba(255,255,255,0.15)',
                        borderRadius:20, padding:'4px 10px', whiteSpace:'nowrap', flexShrink:0 }}>
            <span style={{ fontSize:10 }}>🌍</span>
            <span style={{ fontSize:11, fontWeight:700, color:'white' }}>RCP {scenario==='rcp45'?'4.5':'8.5'}</span>
          </div>
          {/* Indicator chip */}
          <div style={{ display:'flex', alignItems:'center', gap:3, background:'rgba(255,255,255,0.15)',
                        borderRadius:20, padding:'4px 10px', whiteSpace:'nowrap', flexShrink:0 }}>
            <span style={{ fontSize:11, fontWeight:700, color:'#86efac' }}>
              {INDICATORS.find(i=>i.key===indicator)?.label ?? indicator}
            </span>
          </div>
          {/* Active filter chip */}
          {filter !== 'all' && (
            <div style={{ display:'flex', alignItems:'center', gap:3, background:'rgba(255,200,0,0.25)',
                          borderRadius:20, padding:'4px 10px', whiteSpace:'nowrap', flexShrink:0 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#fde68a' }}>
                {FILTERS.find(f=>f.key===filter)?.icon} {FILTERS.find(f=>f.key===filter)?.label}
              </span>
            </div>
          )}
          {/* Avg stats */}
          <div style={{ marginLeft:'auto', display:'flex', gap:8, flexShrink:0 }}>
            {[['🌡',`${avgTemp}°C`],['🌧',`${avgRain}mm`],['🌊',`${avgSLR}cm`]].map(([ic,v])=>(
              <div key={String(v)} style={{ display:'flex', alignItems:'center', gap:3, whiteSpace:'nowrap' }}>
                <span style={{ fontSize:10 }}>{ic}</span>
                <span style={{ fontSize:10, fontWeight:700, color:'#a7f3d0' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <div style={{ flex:1, display:'grid', overflow:'hidden',
                    gridTemplateColumns: isMobile ? '1fr' : (selected ? '260px 1fr 380px' : '260px 1fr') }}>

        {/* ── Sidebar — hidden on mobile (available via bottom sheet) ── */}
        <aside style={{ background:'white', borderRight:'1px solid #e2e8f0',
                         overflowY:'auto', padding:14, display: isMobile ? 'none' : 'flex',
                         flexDirection:'column', gap:14 }}>
          {/* Risk Filters */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
                          letterSpacing:'0.8px', color:'#64748b', marginBottom:8 }}>
              Risk Filters
            </div>
            <div style={{ background:'#f8fafc', borderRadius:10, padding:10,
                          border:'1px solid #e2e8f0' }}>
              {FILTERS.map(f=>(
                <button key={f.key} onClick={()=>setFilter(f.key)}
                  style={{ display:'flex', alignItems:'center', gap:8, width:'100%',
                           padding:'8px 10px', marginBottom:3, border:'none', borderRadius:7,
                           cursor:'pointer', fontSize:12, fontWeight:600, transition:'all 0.18s',
                           background: filter===f.key
                             ? 'linear-gradient(135deg,#0f4c3a,#1a6b52)' : 'white',
                           color: filter===f.key ? 'white' : '#0f172a',
                           boxShadow: filter===f.key?'0 3px 10px rgba(15,76,58,0.25)':'none' }}>
                  <span>{f.icon}</span><span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Division filter */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
                          letterSpacing:'0.8px', color:'#64748b', marginBottom:8 }}>
              Division
            </div>
            <select value={division} onChange={e=>setDivision(e.target.value)}
              style={{ width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0',
                       borderRadius:8, background:'white', fontSize:12,
                       color:'#0f172a', cursor:'pointer', outline:'none' }}>
              <option value="all">All Divisions</option>
              {DIVISIONS.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Zone legend / Seismic legend */}
          {filter === 'earthquake' ? (
            <div>
              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
                            letterSpacing:'0.8px', color:'#64748b', marginBottom:8 }}>
                Seismic Zones (BNBC)
              </div>
              <div style={{ background:'#f8fafc', borderRadius:10, padding:10,
                            border:'1px solid #e2e8f0' }}>
                {(['IV','III','II','I'] as const).map(z=>(
                  <div key={z} style={{ display:'flex', alignItems:'center', gap:8,
                                        marginBottom:6, fontSize:11 }}>
                    <div style={{ width:13, height:13, borderRadius:'50%',
                                  background:SEISMIC_COLORS[z], flexShrink:0 }} />
                    <span style={{ fontWeight:500 }}>{SEISMIC_LABELS[z]}</span>
                  </div>
                ))}
                <div style={{ marginTop:8, padding:'6px 8px', background:'#fffbeb',
                              borderRadius:6, fontSize:10, color:'#92400e', border:'1px solid #fde68a' }}>
                  ⚡ Yellow stars = historical earthquake events
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
                            letterSpacing:'0.8px', color:'#64748b', marginBottom:8 }}>
                Climate Zones
              </div>
              <div style={{ background:'#f8fafc', borderRadius:10, padding:10,
                            border:'1px solid #e2e8f0' }}>
                {Object.entries(ZONE_COLORS).map(([z,c])=>(
                  <div key={z} style={{ display:'flex', alignItems:'center', gap:8,
                                        marginBottom:5, fontSize:11 }}>
                    <div style={{ width:12, height:12, borderRadius:'50%',
                                  background:c, flexShrink:0 }} />
                    <span style={{ fontWeight:500 }}>{z}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* National stats */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
                          letterSpacing:'0.8px', color:'#64748b', marginBottom:8 }}>
              National Overview
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[
                { val:'64', label:'Districts', bg:'#f0fdf4', bc:'#bbf7d0', vc:'#0f4c3a' },
                { val:'4',  label:'Seismic IV', bg:'#fef2f2', bc:'#fecaca', vc:'#dc2626' },
                { val:'19', label:'High Risk', bg:'#fffbeb', bc:'#fde68a', vc:'#b45309' },
                { val: String(EARTHQUAKES.length), label:'Recorded EQs', bg:'#eff6ff', bc:'#bfdbfe', vc:'#1d4ed8' },
              ].map(s=>(
                <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.bc}`,
                                            borderRadius:10, padding:'10px', textAlign:'center' }}>
                  <div style={{ fontSize:20, fontWeight:800, color:s.vc }}>{s.val}</div>
                  <div style={{ fontSize:10, color:'#64748b', marginTop:2, fontWeight:600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop:'auto', padding:'10px', background:'#f8fafc', borderRadius:8,
                        fontSize:10, color:'#64748b', textAlign:'center', lineHeight:1.6 }}>
            Sources: BWDB, BMD, IPCC AR6, BNBC 2020<br/>
            World Bank, LoGIC/LGD 2024<br/>
            Historical: 2016–2025 · Projected: 2026–2050
          </div>
        </aside>

        {/* ── Map ──────────────────────────────────────────────────────── */}
        <div style={{ position:'relative', background:'#e0f2fe', height:'100%', minHeight:0, isolation:'isolate' }}>
          <div ref={mapRef} style={{ width:'100%', height:'100%' }} />
          {/* Overlay hint */}
          <div style={{ position:'absolute', top:14, left:14, zIndex:500,
                        background:'white', padding:'9px 14px', borderRadius:10,
                        boxShadow:'0 8px 24px rgba(0,0,0,0.12)', fontSize:12,
                        fontWeight:600, display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#0f4c3a',
                          animation:'pulse 2s infinite' }} />
            Click any district for detailed climate data
          </div>

          {/* ── Basemap toggle ──────────────────────────────────────────── */}
          <div style={{ position:'absolute', top:14, right:16, zIndex:500,
                        display:'flex', gap:3, background:'rgba(255,255,255,0.97)',
                        borderRadius:10, padding:'4px', boxShadow:'0 4px 16px rgba(0,0,0,0.14)',
                        border:'1px solid #e2e8f0' }}>
            {([
              ['street',    '🗺',  'Street'],
              ['satellite', '🛰',  'Satellite'],
              ['hybrid',    '🌍',  'Hybrid'],
            ] as ['street'|'satellite'|'hybrid', string, string][]).map(([key, icon, label]) => (
              <button key={key} onClick={() => setBasemap(key)}
                style={{
                  display:'flex', alignItems:'center', gap:5, padding:'5px 10px',
                  borderRadius:7, border:'none', cursor:'pointer', fontSize:11,
                  fontWeight: basemap === key ? 700 : 500,
                  background: basemap === key ? '#0f4c3a' : 'transparent',
                  color:      basemap === key ? 'white'   : '#475569',
                  transition: 'all 0.18s',
                }}>
                <span style={{ fontSize:14 }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
          {/* Legend bottom-right */}
          <div style={{ position:'absolute', bottom:16, right:16, zIndex:500,
                        background:'rgba(255,255,255,0.97)', padding:'12px 14px',
                        borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.12)',
                        fontSize:11, maxWidth:180 }}>
            <div style={{ fontWeight:700, marginBottom:7, fontSize:12 }}>
              {filter==='earthquake'?'Seismic Zone':INDICATORS.find(i=>i.key===indicator)?.label??'Indicator'}
            </div>
            {filter==='earthquake'
              ? (['IV','III','II','I'] as const).map(z=>(
                  <div key={z} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%',
                                  background:SEISMIC_COLORS[z] }} />
                    <span>{SEISMIC_LABELS[z].split('—')[1]?.trim()}</span>
                  </div>
                ))
              : indicator==='zone'
              ? Object.entries(ZONE_COLORS).slice(0,6).map(([z,c])=>(
                  <div key={z} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:c }} />
                    <span style={{ fontSize:10 }}>{z}</span>
                  </div>
                ))
              : [['Low','#22c55e'],['Med','#eab308'],['High','#f97316'],['Very High','#dc2626']].map(([l,c])=>(
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                    <div style={{ width:28, height:7, borderRadius:4, background:c }} />
                    <span>{l}</span>
                  </div>
                ))
            }
          </div>
        </div>

        {/* ── Detail panel — desktop only (mobile shows as bottom sheet) ── */}
        {selected && !isMobile ? (
          <div style={{ background:'white', borderLeft:'1px solid #e2e8f0',
                         overflowY:'auto', display:'flex', flexDirection:'column' }}>
            {/* Header */}
            <div style={{ padding:'18px 18px 14px',
                          background:'linear-gradient(135deg,#0f4c3a,#1a6b52)',
                          color:'white', position:'relative', flexShrink:0 }}>
              <button onClick={()=>setSelected(null)}
                style={{ position:'absolute', top:14, right:14, width:30, height:30,
                          background:'rgba(255,255,255,0.15)', border:'none', borderRadius:8,
                          color:'white', cursor:'pointer', fontSize:18, display:'flex',
                          alignItems:'center', justifyContent:'center' }}>×</button>
              <div style={{ fontSize:22, fontWeight:800, marginBottom:3 }}>{selected.name.en}</div>
              <div style={{ fontSize:12, opacity:0.9 }}>
                {selected.division} Division · {selected.zone} · {selected.area.toLocaleString()} km²
              </div>
              <div style={{ marginTop:8, display:'flex', gap:6, flexWrap:'wrap' }}>
                <span style={{ padding:'3px 9px', borderRadius:5, fontSize:10, fontWeight:700,
                               background: isProjected?'#fef3c7':'#f0fdf4',
                               color: isProjected?'#92400e':'#166534' }}>
                  {year} {isProjected?'PROJECTED':'HISTORICAL'}
                </span>
                <span style={{ padding:'3px 9px', borderRadius:5, fontSize:10, fontWeight:700,
                               background: SEISMIC_COLORS[selected.seismicZone]+'33',
                               color: SEISMIC_COLORS[selected.seismicZone] }}>
                  ⚡ Seismic {SEISMIC_LABELS[selected.seismicZone]}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display:'flex', borderBottom:'1px solid #e2e8f0', background:'#f8fafc',
                          flexShrink:0 }}>
              {(['climate','hazards','seismic'] as Tab[]).map(t=>(
                <button key={t} onClick={()=>setTab(t)}
                  style={{ flex:1, padding:'10px 0', border:'none', cursor:'pointer',
                           fontSize:12, fontWeight:600, transition:'all 0.18s',
                           background: tab===t?'white':'transparent',
                           color: tab===t?'#0f4c3a':'#64748b',
                           borderBottom: tab===t?'2px solid #0f4c3a':'2px solid transparent' }}>
                  {t==='climate'?'🌡 Climate':t==='hazards'?'⚠ Hazards':'⚡ Seismic'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding:16, display:'flex', flexDirection:'column', gap:14, flex:1 }}>
              {tab === 'climate' && selData && (
                <>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {[
                      { icon:'🌡', val:`${selData.temp}°C`,              label:'Avg Temperature'  },
                      { icon:'🌧', val:`${selData.rain.toLocaleString()}mm`, label:'Annual Rainfall' },
                      { icon:'💧', val:`${selData.humidity}%`,            label:'Humidity'         },
                      { icon:'🌊', val:`${selData.slr}cm`,                label:'Sea-Level Rise'   },
                    ].map(x=>(
                      <div key={x.label} style={{ background:'#f8fafc', border:'1px solid #e2e8f0',
                                                   borderRadius:10, padding:'12px', textAlign:'center' }}>
                        <div style={{ fontSize:22, marginBottom:4 }}>{x.icon}</div>
                        <div style={{ fontSize:16, fontWeight:800 }}>{x.val}</div>
                        <div style={{ fontSize:10, color:'#64748b', marginTop:2 }}>{x.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Trajectory chart */}
                  <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0',
                                 borderRadius:10, padding:'12px' }}>
                    <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
                                  letterSpacing:'0.6px', color:'#64748b', marginBottom:8 }}>
                      📈 Climate Trajectory 2016–2050
                    </div>
                    <div style={{ height:150 }}>
                      <Line
                        data={{
                          labels: YEARS,
                          datasets: [
                            { label:'Temp RCP4.5',  data:temps45, borderColor:'#0ea5e9',
                              borderWidth:2, pointRadius:0, tension:0.4, yAxisID:'y' },
                            { label:'Temp RCP8.5',  data:temps85, borderColor:'#dc2626',
                              borderWidth:2, pointRadius:0, tension:0.4, yAxisID:'y',
                              borderDash:[5,4] },
                            { label:'Rain RCP4.5',  data:rains45, borderColor:'#16a34a',
                              borderWidth:1.5, pointRadius:0, tension:0.4, yAxisID:'y1' },
                            { label:'Rain RCP8.5',  data:rains85, borderColor:'#f59e0b',
                              borderWidth:1.5, pointRadius:0, tension:0.4, yAxisID:'y1',
                              borderDash:[5,4] },
                          ],
                        }}
                        options={{
                          responsive:true, maintainAspectRatio:false, animation:false,
                          plugins:{ legend:{ position:'top', labels:{ font:{size:9}, boxWidth:6, padding:6 }}},
                          scales:{
                            x:{ ticks:{font:{size:8},maxTicksLimit:7}, grid:{display:false}},
                            y:{ position:'left', ticks:{font:{size:8}},
                                title:{display:true,text:'°C',font:{size:9}}},
                            y1:{position:'right', ticks:{font:{size:8}}, grid:{display:false},
                                title:{display:true,text:'mm',font:{size:9}}},
                          },
                        }} />
                    </div>
                  </div>
                  {/* Scatter chart */}
                  <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0',
                                 borderRadius:10, padding:'12px' }}>
                    <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
                                  letterSpacing:'0.6px', color:'#64748b', marginBottom:8 }}>
                      🔵 Temp vs Rainfall · <span style={{color:'#0ea5e9'}}>blue=hist</span> &nbsp;
                      <span style={{color:'#dc2626'}}>red=proj</span>
                    </div>
                    <div style={{ height:120 }}>
                      <Scatter
                        data={{ datasets:[{ label:'', data:scatterPts,
                          backgroundColor:scatterColors, pointRadius:3.5 }] }}
                        options={{
                          responsive:true, maintainAspectRatio:false, animation:false,
                          plugins:{ legend:{display:false},
                            tooltip:{ callbacks:{ label:(ctx) => {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const r = ctx.raw as any;
                              return YEARS[ctx.dataIndex] + ': ' + r.x + 'degC, ' + r.y + 'mm';
                            }}}},
                          scales:{
                            x:{ title:{display:true,text:'°C',font:{size:9}}, ticks:{font:{size:8}}},
                            y:{ title:{display:true,text:'mm',font:{size:9}}, ticks:{font:{size:8}}},
                          },
                        }} />
                    </div>
                  </div>
                </>
              )}

              {tab === 'hazards' && selData && (
                <>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {[
                      { icon:'🌊', val:selData.flood,    label:'Flood Events'    },
                      { icon:'🌀', val:selData.cyclone,  label:'Cyclone Events'  },
                      { icon:'🔥', val:selData.heatwave, label:'Heatwave Events' },
                      { icon:'☀', val:selData.drought,  label:'Drought Months'  },
                    ].map(x=>(
                      <div key={x.label} style={{ background:'#f8fafc', border:'1px solid #e2e8f0',
                                                   borderRadius:10, padding:'12px', textAlign:'center' }}>
                        <div style={{ fontSize:22, marginBottom:4 }}>{x.icon}</div>
                        <div style={{ fontSize:18, fontWeight:800 }}>{x.val}</div>
                        <div style={{ fontSize:10, color:'#64748b', marginTop:2 }}>{x.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0',
                                 borderRadius:10, padding:14 }}>
                    <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
                                  letterSpacing:'0.6px', color:'#64748b', marginBottom:10 }}>
                      ⚠ Risk Assessment
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {Object.entries(selected.risks).map(([k,v])=>{
                        const cls: Record<string,{bg:string;color:string;border:string}> = {
                          'Very High':{bg:'#fef2f2',color:'#991b1b',border:'#fecaca'},
                          'High':{bg:'#fff7ed',color:'#9a3412',border:'#fed7aa'},
                          'Moderate':{bg:'#fffbeb',color:'#92400e',border:'#fde68a'},
                          'Low':{bg:'#f0fdf4',color:'#166534',border:'#bbf7d0'},
                          'Very Low':{bg:'#eff6ff',color:'#1e40af',border:'#bfdbfe'},
                        };
                        const s = cls[v] ?? cls['Low'];
                        const icons: Record<string,string> = {
                          flood:'🌊',cyclone:'🌀',drought:'☀',
                          heatwave:'🔥',landslide:'⛰',salinity:'💧'
                        };
                        return (
                          <span key={k} style={{ padding:'5px 10px', borderRadius:16,
                                                  fontSize:11, fontWeight:700,
                                                  background:s.bg, color:s.color,
                                                  border:`1px solid ${s.border}` }}>
                            {icons[k]} {k.charAt(0).toUpperCase()+k.slice(1)}: {v}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {tab === 'seismic' && (
                <>
                  {/* Seismic zone card */}
                  <div style={{ background: SEISMIC_COLORS[selected.seismicZone]+'15',
                                 border:`2px solid ${SEISMIC_COLORS[selected.seismicZone]}`,
                                 borderRadius:12, padding:14 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                      <div style={{ width:40, height:40, borderRadius:10, display:'flex',
                                    alignItems:'center', justifyContent:'center', fontSize:22,
                                    background: SEISMIC_COLORS[selected.seismicZone]+'33' }}>⚡</div>
                      <div>
                        <div style={{ fontWeight:800, fontSize:15 }}>
                          {SEISMIC_LABELS[selected.seismicZone]}
                        </div>
                        <div style={{ fontSize:11, color:'#64748b', marginTop:1 }}>
                          Bangladesh National Building Code (BNBC 2020)
                        </div>
                      </div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                      <div style={{ background:'white', borderRadius:8, padding:'8px 10px' }}>
                        <div style={{ fontSize:10, color:'#64748b' }}>Risk Level</div>
                        <div style={{ fontWeight:700, color: SEISMIC_COLORS[selected.seismicZone] }}>
                          {SEISMIC_ZONE_INFO[selected.seismicZone].risk}
                        </div>
                      </div>
                      <div style={{ background:'white', borderRadius:8, padding:'8px 10px' }}>
                        <div style={{ fontSize:10, color:'#64748b' }}>Max Magnitude</div>
                        <div style={{ fontWeight:700, color:'#0f172a' }}>
                          {SEISMIC_ZONE_INFO[selected.seismicZone].maxMag}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize:12, color:'#374151', lineHeight:1.6, marginBottom:8 }}>
                      {SEISMIC_ZONE_INFO[selected.seismicZone].description}
                    </div>
                    <div style={{ fontSize:11, color:'#64748b' }}>
                      <b>Active Faults:</b> {SEISMIC_ZONE_INFO[selected.seismicZone].faults}
                    </div>
                  </div>

                  {/* Historical nearby earthquakes */}
                  <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0',
                                 borderRadius:10, padding:14 }}>
                    <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
                                  letterSpacing:'0.6px', color:'#64748b', marginBottom:10 }}>
                      📋 Historical Earthquakes Near This District
                    </div>
                    {nearbyEQ.length > 0 ? nearbyEQ.map(eq=>(
                      <div key={`${eq.year}-${eq.mag}`}
                        style={{ padding:'10px 12px', marginBottom:6, background:'white',
                                  border:'1px solid #e2e8f0', borderRadius:8 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <div style={{ fontWeight:700, fontSize:13 }}>{eq.name}</div>
                          <div style={{ fontSize:11, fontWeight:700,
                                        color: eq.mag>=7?'#dc2626':eq.mag>=6?'#f97316':'#eab308',
                                        background: eq.mag>=7?'#fef2f2':eq.mag>=6?'#fff7ed':'#fffbeb',
                                        padding:'2px 8px', borderRadius:12 }}>
                            M{eq.mag}
                          </div>
                        </div>
                        <div style={{ fontSize:11, color:'#64748b', marginTop:3 }}>
                          Year {eq.year} — {eq.impact}
                        </div>
                      </div>
                    )) : (
                      <div style={{ textAlign:'center', color:'#94a3b8', fontSize:12,
                                    padding:'16px 0' }}>
                        No significant earthquakes recorded directly at this location.<br/>
                        <span style={{ fontSize:11 }}>
                          Distant events still pose ground-shaking risk based on seismic zone.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Predicted risk */}
                  <div style={{ background:'#fef2f2', border:'1px solid #fecaca',
                                 borderRadius:10, padding:14 }}>
                    <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
                                  letterSpacing:'0.6px', color:'#991b1b', marginBottom:8 }}>
                      🔮 Earthquake Prediction & Preparedness
                    </div>
                    {selected.seismicZone === 'IV' && (
                      <div style={{ fontSize:12, color:'#374151', lineHeight:1.7 }}>
                        <b style={{color:'#dc2626'}}>High Alert:</b> The Dauki Fault has an estimated
                        recurrence interval of 250–500 years. Geological evidence suggests a
                        potential <b>M8.0–8.5</b> earthquake could affect this region.
                        Current seismic gap indicates accumulated strain.<br/>
                        <b>Action:</b> Enforce seismic building codes (BNBC 2020 Zone IV),
                        community early-warning drills, hospital retrofitting programmes.
                      </div>
                    )}
                    {selected.seismicZone === 'III' && (
                      <div style={{ fontSize:12, color:'#374151', lineHeight:1.7 }}>
                        <b style={{color:'#f97316'}}>Moderate-High Alert:</b> This district lies
                        near active fold-belt faults capable of producing <b>M6.5–7.0</b> events.
                        Periodic seismicity is expected every 50–100 years.<br/>
                        <b>Action:</b> Apply Zone III seismic design, conduct risk assessments
                        for critical infrastructure, train emergency responders.
                      </div>
                    )}
                    {(selected.seismicZone === 'II' || selected.seismicZone === 'I') && (
                      <div style={{ fontSize:12, color:'#374151', lineHeight:1.7 }}>
                        <b style={{color:'#eab308'}}>Lower Risk:</b> Probability of a damaging
                        local earthquake is relatively low, but <b>M5.5–6.5</b> distant events
                        can cause ground shaking amplified by soft alluvial sediments.
                        Liquefaction risk during major regional events.<br/>
                        <b>Action:</b> Standard seismic codes, soil improvement for large buildings,
                        community awareness programmes.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Mobile floating buttons — only when map is visible ──────── */}
      {isMobile && mapInView && (
        <>
          {/* Backdrop — tap outside to close sheet */}
          {mobileSheet !== 'none' && (
            <div onClick={() => setMobileSheet('none')}
              style={{ position:'fixed', inset:0, zIndex:9998, background:'rgba(0,0,0,0.4)' }} />
          )}

          {/* Controls button — shows active filter name */}
          <button onClick={() => setMobileSheet(s => s==='controls' ? 'none' : 'controls')}
            style={{ position:'fixed', bottom:80, left:12, zIndex:9999,
                     background: mobileSheet==='controls' ? '#0f4c3a' : 'white',
                     color: mobileSheet==='controls' ? 'white' : '#0f4c3a',
                     border:'2px solid #0f4c3a', borderRadius:28, padding:'8px 14px',
                     fontSize:12, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(0,0,0,0.18)',
                     display:'flex', alignItems:'center', gap:6, transition:'all 0.2s' }}>
            {mobileSheet==='controls' ? '✕ Close' : `⚙️ ${filter==='all' ? 'Filters' : (FILTERS.find(f=>f.key===filter)?.icon+' '+FILTERS.find(f=>f.key===filter)?.label)}`}
          </button>

          {/* District detail button — shown when district selected */}
          {selected && (
            <button onClick={() => setMobileSheet(s => s==='detail' ? 'none' : 'detail')}
              style={{ position:'fixed', bottom:80, right:12, zIndex:9999,
                       background:'#0f4c3a', color:'white',
                       border:'none', borderRadius:28, padding:'8px 14px',
                       fontSize:12, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(0,0,0,0.25)',
                       display:'flex', alignItems:'center', gap:6, animation:'pulse 2s infinite' }}>
              📊 {selected.name.en}
            </button>
          )}

          {/* Controls bottom sheet — full parameter control */}
          {mobileSheet === 'controls' && (
            <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:9999,
                          background:'white', borderRadius:'20px 20px 0 0',
                          boxShadow:'0 -8px 32px rgba(0,0,0,0.2)',
                          maxHeight:'80vh', overflowY:'auto', padding:'12px 14px 28px',
                          animation:'slideUpSheet 0.25s ease-out' }}>
              <div style={{ width:36, height:4, background:'#e2e8f0', borderRadius:2, margin:'0 auto 12px' }} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <div style={{ fontWeight:700, fontSize:14, color:'#0f172a' }}>⚙️ Climate Map Controls</div>
                <button onClick={() => setMobileSheet('none')}
                  style={{ border:'none', background:'#f1f5f9', borderRadius:8, width:30, height:30, cursor:'pointer', fontSize:16 }}>✕</button>
              </div>

              {/* ── Year timeline ── */}
              <div style={{ background:'#f8fafc', borderRadius:12, padding:'10px 12px', marginBottom:12, border:'1px solid #e2e8f0' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', color:'#64748b' }}>📅 Year</div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:18, fontWeight:800, color:'#0f4c3a' }}>{year}</span>
                    <span style={{ fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:4,
                                   background: isProjected?'#fef3c7':'#f0fdf4',
                                   color: isProjected?'#92400e':'#166534' }}>
                      {isProjected?'PROJECTED':'HISTORICAL'}
                    </span>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <button onClick={()=>setPlaying(p=>!p)}
                    style={{ width:32, height:32, borderRadius:'50%', border:'none', cursor:'pointer',
                             background:'linear-gradient(135deg,#0f4c3a,#1a6b52)', color:'white', fontSize:13,
                             display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {playing?'⏸':'▶'}
                  </button>
                  <input type="range" min="2016" max="2050" value={year}
                    onChange={e=>{ setYear(Number(e.target.value)); setPlaying(false); }}
                    style={{ flex:1, accentColor:'#0f4c3a', height:6 }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'#94a3b8', fontWeight:600, marginTop:4 }}>
                  {[2016,2020,2025,2030,2035,2040,2045,2050].map(y=><span key={y}>{y}</span>)}
                </div>
              </div>

              {/* ── Scenario + Indicator row ── */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                <div style={{ background:'#f8fafc', borderRadius:12, padding:'10px 12px', border:'1px solid #e2e8f0' }}>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', color:'#64748b', marginBottom:8 }}>🌍 Scenario</div>
                  <div style={{ display:'flex', background:'#f1f5f9', borderRadius:8, padding:3, gap:3 }}>
                    {(['rcp45','rcp85'] as Scenario[]).map(sc=>(
                      <button key={sc} onClick={()=>setScenario(sc)}
                        style={{ flex:1, border:'none', padding:'6px 4px', borderRadius:6, cursor:'pointer', fontSize:11,
                                 fontWeight:700, transition:'all 0.2s', textAlign:'center',
                                 background: scenario===sc?'#0f4c3a':'transparent',
                                 color: scenario===sc?'white':'#475569',
                                 boxShadow: scenario===sc?'0 2px 4px rgba(0,0,0,0.15)':'none' }}>
                        {sc==='rcp45'?'4.5':'8.5'}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize:9, color:'#94a3b8', marginTop:6 }}>
                    {scenario==='rcp45'?'Moderate emissions':'High emissions'}
                  </div>
                </div>
                <div style={{ background:'#f8fafc', borderRadius:12, padding:'10px 12px', border:'1px solid #e2e8f0' }}>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', color:'#64748b', marginBottom:8 }}>📊 Indicator</div>
                  <select value={indicator} onChange={e=>setIndicator(e.target.value)}
                    style={{ width:'100%', padding:'6px 8px', border:'1px solid #e2e8f0', borderRadius:8,
                             fontSize:11, fontWeight:600, color:'#0f172a', background:'white', cursor:'pointer', outline:'none' }}>
                    {INDICATORS.map(i=><option key={i.key} value={i.key}>{i.label}</option>)}
                  </select>
                </div>
              </div>

              {/* ── Risk filters ── */}
              <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', color:'#64748b', marginBottom:8 }}>⚡ Risk Filter</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:12 }}>
                {FILTERS.map(f=>(
                  <button key={f.key} onClick={()=>setFilter(f.key)}
                    style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 10px', border:'none', borderRadius:10,
                             cursor:'pointer', fontSize:11, fontWeight:600, transition:'all 0.18s',
                             background: filter===f.key ? 'linear-gradient(135deg,#0f4c3a,#1a6b52)' : '#f8fafc',
                             color: filter===f.key ? 'white' : '#0f172a',
                             boxShadow: filter===f.key ? '0 3px 8px rgba(15,76,58,0.3)' : '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <span style={{ fontSize:14 }}>{f.icon}</span><span>{f.label}</span>
                  </button>
                ))}
              </div>

              {/* ── Division + Basemap row ── */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', color:'#64748b', marginBottom:6 }}>🏙 Division</div>
                  <select value={division} onChange={e=>setDivision(e.target.value)}
                    style={{ width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:10,
                             fontSize:11, fontWeight:600, color:'#0f172a', cursor:'pointer', outline:'none', background:'white' }}>
                    <option value="all">All Divisions</option>
                    {DIVISIONS.map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', color:'#64748b', marginBottom:6 }}>🗺 Basemap</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    {([['street','🗺 Street'],['satellite','🛰 Satellite'],['hybrid','🌍 Hybrid']] as ['street'|'satellite'|'hybrid', string][]).map(([k,l])=>(
                      <button key={k} onClick={()=>setBasemap(k)}
                        style={{ padding:'6px 8px', border:'none', borderRadius:8, cursor:'pointer', fontSize:11, fontWeight:700,
                                 textAlign:'left', background: basemap===k ? '#0f4c3a' : '#f1f5f9',
                                 color: basemap===k ? 'white' : '#475569' }}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* District detail bottom sheet — elaborate 3-tab view */}
          {mobileSheet === 'detail' && selected && selData && (() => {
            const sz  = selected.seismicZone;
            const szi = SEISMIC_ZONE_INFO[sz];
            const riskBg  = (v: string) => v==='Very High'?'#fef2f2':v==='High'?'#fff7ed':v==='Moderate'?'#fefce8':v==='Low'?'#f0fdf4':'#f8fafc';
            const riskClr = (v: string) => v==='Very High'?'#dc2626':v==='High'?'#f97316':v==='Moderate'?'#eab308':v==='Low'?'#16a34a':'#64748b';
            const riskBar = (v: string) => ({ VH:100,H:75,M:50,L:30,VL:10 }[{
              'Very High':'VH','High':'H','Moderate':'M','Low':'L','Very Low':'VL'
            }[v as string] ?? 'L'] ?? 30);
            return (
            <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:9999,
                          background:'white', borderRadius:'20px 20px 0 0',
                          boxShadow:'0 -8px 32px rgba(0,0,0,0.25)',
                          maxHeight:'82vh', display:'flex', flexDirection:'column',
                          animation:'slideUpSheet 0.25s ease-out' }}>

              {/* ── Header ───────────────────────────────────────────── */}
              <div style={{ background:'linear-gradient(135deg,#0f4c3a,#1a6b52)', color:'white',
                            padding:'10px 14px 12px', borderRadius:'20px 20px 0 0', position:'relative', flexShrink:0 }}>
                <div style={{ width:36, height:4, background:'rgba(255,255,255,0.3)', borderRadius:2, margin:'0 auto 8px' }} />
                <button onClick={() => setMobileSheet('none')}
                  style={{ position:'absolute', top:10, right:12, width:28, height:28,
                           background:'rgba(255,255,255,0.15)', border:'none', borderRadius:8,
                           color:'white', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, fontSize:20, lineHeight:1.2 }}>{selected.name.en}</div>
                    <div style={{ fontSize:11, opacity:0.8, marginTop:2 }}>
                      {selected.division} Division · {selected.zone} · {selected.area.toLocaleString()} km²
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end', flexShrink:0 }}>
                    <span style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:4,
                                   background: isProjected?'#fef3c7':'rgba(255,255,255,0.15)',
                                   color: isProjected?'#92400e':'white' }}>
                      {year} {isProjected?'PROJECTED':'HISTORICAL'}
                    </span>
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:4,
                                   background:'rgba(255,255,255,0.15)', color:'white' }}>
                      RCP {scenario==='rcp45'?'4.5':'8.5'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Tab bar ──────────────────────────────────────────── */}
              <div style={{ display:'flex', borderBottom:'1px solid #f1f5f9', flexShrink:0, background:'white' }}>
                {(['climate','hazards','seismic'] as Tab[]).map(t=>(
                  <button key={t} onClick={()=>setTab(t)}
                    style={{ flex:1, padding:'10px 4px', border:'none', borderBottom: tab===t?'2px solid #0f4c3a':'2px solid transparent',
                             background:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, textTransform:'capitalize',
                             color: tab===t?'#0f4c3a':'#94a3b8', transition:'all 0.15s' }}>
                    {t==='climate'?'🌡 Climate':t==='hazards'?'⚠️ Hazards':'⚡ Seismic'}
                  </button>
                ))}
              </div>

              {/* ── Tab content ──────────────────────────────────────── */}
              <div style={{ overflowY:'auto', flex:1, padding:'12px 14px 24px' }}>

                {/* CLIMATE TAB */}
                {tab === 'climate' && (
                  <>
                    {/* 4 key stats */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:7, marginBottom:14 }}>
                      {[['🌡',`${selData.temp}°C`,'Temp','#0f4c3a'],
                        ['🌧',`${selData.rain}mm`,'Rain','#0369a1'],
                        ['💧',`${selData.humidity}%`,'Humidity','#0891b2'],
                        ['🌊',`${selData.slr}cm`,'SLR','#6d28d9']].map(([ic,val,lbl,clr])=>(
                        <div key={String(lbl)} style={{ background:'#f8fafc', borderRadius:12, padding:'10px 6px', textAlign:'center', border:'1px solid #e2e8f0' }}>
                          <div style={{ fontSize:18, marginBottom:4 }}>{ic}</div>
                          <div style={{ fontSize:14, fontWeight:800, color:String(clr), lineHeight:1 }}>{val}</div>
                          <div style={{ fontSize:9, color:'#64748b', fontWeight:600, marginTop:3 }}>{lbl}</div>
                        </div>
                      ))}
                    </div>
                    {/* Event counts */}
                    <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', color:'#64748b', letterSpacing:'0.8px', marginBottom:8 }}>Annual Events ({year})</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:14 }}>
                      {[['🌊', 'Flood events', selData.flood, '#ef4444'],
                        ['🌀', 'Cyclone events', selData.cyclone, '#f97316'],
                        ['🔥', 'Heatwave days', selData.heatwave, '#eab308'],
                        ['☀', 'Drought months', selData.drought, '#84cc16']].map(([ic,lbl,val,clr])=>(
                        <div key={String(lbl)} style={{ background:'#f8fafc', borderRadius:10, padding:'8px 10px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:8 }}>
                          <span style={{ fontSize:20 }}>{ic}</span>
                          <div>
                            <div style={{ fontSize:16, fontWeight:800, color:String(clr), lineHeight:1 }}>{val}</div>
                            <div style={{ fontSize:9, color:'#64748b', fontWeight:600, marginTop:1 }}>{lbl}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Climate zone & context */}
                    <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius:12, padding:'10px 12px', border:'1px solid #bbf7d0' }}>
                      <div style={{ fontSize:11, fontWeight:700, color:'#0f4c3a', marginBottom:4 }}>🗺 Climate Zone</div>
                      <div style={{ fontSize:13, fontWeight:800, color:'#0f4c3a' }}>{selected.zone}</div>
                      <div style={{ fontSize:10, color:'#374151', marginTop:4, lineHeight:1.5 }}>
                        Base temp: <b>{selected.base.t}°C</b> · Base rain: <b>{selected.base.r}mm</b> · Humidity: <b>{selected.base.h}%</b>
                        {selected.base.s > 0 && ` · SLR base: ${selected.base.s}cm`}
                      </div>
                    </div>
                  </>
                )}

                {/* HAZARDS TAB */}
                {tab === 'hazards' && (
                  <>
                    <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', color:'#64748b', letterSpacing:'0.8px', marginBottom:10 }}>Risk Assessment</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {([['flood','🌊','Flood'],['cyclone','🌀','Cyclone'],['drought','☀','Drought'],
                         ['heatwave','🔥','Heatwave'],['landslide','⛰','Landslide'],['salinity','💧','Salinity']] as [string,string,string][])
                        .map(([k,ic,lbl])=>{
                        const v = selected.risks[k as keyof typeof selected.risks];
                        const bar = riskBar(v);
                        return (
                          <div key={k} style={{ background:'#f8fafc', borderRadius:12, padding:'10px 12px', border:'1px solid #e2e8f0' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                                <span style={{ fontSize:16 }}>{ic}</span>
                                <span style={{ fontSize:12, fontWeight:700, color:'#374151' }}>{lbl} Risk</span>
                              </div>
                              <span style={{ fontSize:11, fontWeight:800, padding:'3px 10px', borderRadius:20,
                                             background:riskBg(v), color:riskClr(v) }}>{v}</span>
                            </div>
                            {/* Risk bar */}
                            <div style={{ background:'#e2e8f0', borderRadius:4, height:5, overflow:'hidden' }}>
                              <div style={{ height:'100%', borderRadius:4, width:`${bar}%`,
                                           background:riskClr(v), transition:'width 0.5s ease' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* SEISMIC TAB */}
                {tab === 'seismic' && (
                  <>
                    {/* Zone badge */}
                    <div style={{ display:'flex', alignItems:'center', gap:12, background:'#f8fafc', borderRadius:12,
                                  padding:'12px 14px', border:'1px solid #e2e8f0', marginBottom:12 }}>
                      <div style={{ width:48, height:48, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
                                    fontSize:22, fontWeight:900, color:'white', flexShrink:0,
                                    background:SEISMIC_COLORS[sz] }}>
                        {sz}
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:800, color:'#0f172a' }}>{SEISMIC_LABELS[sz]}</div>
                        <div style={{ fontSize:10, color:'#64748b', marginTop:2 }}>Max expected: <b>{szi.maxMag}</b></div>
                        <div style={{ fontSize:10, color:'#64748b' }}>Risk level: <b style={{ color:SEISMIC_COLORS[sz] }}>{szi.risk}</b></div>
                      </div>
                    </div>
                    {/* Description */}
                    <div style={{ background:'#fffbeb', borderRadius:12, padding:'10px 12px', border:'1px solid #fde68a', marginBottom:12 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:'#92400e', marginBottom:4 }}>⚡ Seismic Risk</div>
                      <div style={{ fontSize:11, color:'#374151', lineHeight:1.6 }}>{szi.description}</div>
                    </div>
                    {/* Faults */}
                    <div style={{ background:'#f8fafc', borderRadius:12, padding:'10px 12px', border:'1px solid #e2e8f0', marginBottom:12 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 }}>Nearby Faults</div>
                      <div style={{ fontSize:11, color:'#374151', lineHeight:1.7 }}>{szi.faults}</div>
                    </div>
                    {/* Nearby earthquakes */}
                    {nearbyEQ.length > 0 && (
                      <>
                        <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', color:'#64748b', letterSpacing:'0.8px', marginBottom:8 }}>Historical Earthquakes Nearby</div>
                        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                          {nearbyEQ.map((eq,i)=>(
                            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, background:'#f8fafc',
                                                   borderRadius:10, padding:'8px 10px', border:'1px solid #e2e8f0' }}>
                              <div style={{ background:'#fef3c7', borderRadius:8, padding:'4px 8px', flexShrink:0, textAlign:'center' }}>
                                <div style={{ fontSize:13, fontWeight:800, color:'#92400e' }}>M{eq.mag}</div>
                                <div style={{ fontSize:9, color:'#92400e' }}>{eq.year}</div>
                              </div>
                              <div>
                                <div style={{ fontSize:11, fontWeight:700, color:'#0f172a' }}>{eq.name}</div>
                                <div style={{ fontSize:10, color:'#64748b', lineHeight:1.5 }}>{eq.impact}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {nearbyEQ.length === 0 && (
                      <div style={{ textAlign:'center', color:'#94a3b8', fontSize:12, padding:'16px' }}>
                        No major earthquakes recorded within 350km
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            );
          })()}

          <style>{`
            @keyframes slideUpSheet {
              from { transform: translateY(100%); opacity: 0; }
              to   { transform: translateY(0);    opacity: 1; }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
