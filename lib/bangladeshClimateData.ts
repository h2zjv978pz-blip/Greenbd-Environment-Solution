export type RiskLevel = 'Very High' | 'High' | 'Moderate' | 'Low' | 'Very Low';
export type Scenario  = 'rcp45' | 'rcp85';
export type SeismicZone = 'IV' | 'III' | 'II' | 'I';

export interface YearData {
  temp: number; rain: number; humidity: number; slr: number;
  flood: number; cyclone: number; heatwave: number; drought: number;
}

export interface District {
  id: number;
  name: { en: string; bn: string };
  division: string;
  lat: number; lng: number; area: number;
  zone: string; zoneColor: string;
  risks: {
    flood: RiskLevel; cyclone: RiskLevel; drought: RiskLevel;
    heatwave: RiskLevel; landslide: RiskLevel; salinity: RiskLevel;
  };
  seismicZone: SeismicZone;
  base: { t: number; r: number; h: number; s: number };
}

export interface EarthquakeEvent {
  year: number; mag: number; lat: number; lng: number;
  name: string; impact: string;
}

// ── Zone colours ───────────────────────────────────────────────────────────
export const ZONE_COLORS: Record<string, string> = {
  'South-Eastern': '#1e40af', 'North-Eastern': '#0e7490', 'Northern': '#15803d',
  'North-Western': '#a16207', 'Western': '#c2410c', 'South-Western': '#7c3aed',
  'Central': '#059669', 'South-Central': '#0891b2',
};

export const SEISMIC_COLORS: Record<SeismicZone, string> = {
  'IV': '#dc2626', 'III': '#f97316', 'II': '#eab308', 'I': '#22c55e',
};

export const SEISMIC_ZONE_INFO: Record<SeismicZone, { risk: string; description: string; maxMag: string; faults: string }> = {
  'IV': { risk: 'Very High', maxMag: 'M8.0+',
    description: 'Located near the Dauki Fault system — one of the most hazardous faults in South Asia. A major rupture could devastate the region with intense ground shaking and landslides.',
    faults: 'Dauki Fault, Sylhet Trough, Shillong Plateau Fault' },
  'III': { risk: 'High', maxMag: 'M6.5–7.0',
    description: 'Positioned near active fold belts and secondary faults. Moderate-to-strong earthquakes expected periodically; buildings require seismic-resistant design.',
    faults: 'Chittagong Fold Belt, Rangpur Fault, Brahmaputra Fault Zone' },
  'II': { risk: 'Moderate', maxMag: 'M5.5–6.5',
    description: 'Some seismic vulnerability from distant fault activity. Structures should follow basic seismic design codes. Soft alluvial soils may amplify shaking.',
    faults: 'Hinge Zone Fault, Bogra Fault, Bengal Basin faults' },
  'I': { risk: 'Low', maxMag: 'M5.0–5.5',
    description: 'Lowest seismic hazard in Bangladesh. Coastal alluvial deposits and deltaic sediments can still amplify distant earthquake waves. Standard precautions apply.',
    faults: 'Distal Bengal Basin; remote fault influence only' },
};

// ── Time-series generator ──────────────────────────────────────────────────
function sr(seed: number): number {
  return Math.abs(Math.sin(seed * 9301 + 49297) * 233280) % 1;
}

export const ZONE_TEMP_TREND: Record<string, [number, number]> = {
  'Western':       [0.070, 0.110], 'North-Western': [0.065, 0.100],
  'Northern':      [0.060, 0.095], 'Central':       [0.055, 0.085],
  'South-Central': [0.050, 0.080], 'South-Western': [0.048, 0.075],
  'North-Eastern': [0.045, 0.072], 'South-Eastern': [0.042, 0.068],
};
export const ZONE_RAIN_TREND: Record<string, number> = {
  'Western': -3, 'North-Western': -2, 'Northern': 2, 'Central': 3,
  'South-Central': 4, 'South-Western': 1, 'North-Eastern': 8, 'South-Eastern': 10,
};
const RISK_W: Record<RiskLevel, number> = {
  'Very High': 3, 'High': 2, 'Moderate': 1, 'Low': 0.4, 'Very Low': 0,
};

export interface TrendOverrides {
  zoneTempTrends?: Record<string, [number, number]>;
  zoneRainTrends?: Record<string, number>;
}

export interface ClimateMapSettings {
  defaults?: {
    year?: number; indicator?: string; scenario?: string;
    filter?: string; division?: string; playSpeed?: number;
  };
  zoneTempTrends?: Record<string, [number, number]>;
  zoneRainTrends?: Record<string, number>;
  earthquakes?: EarthquakeEvent[];
  districtRiskOverrides?: Record<string, Partial<Record<'flood'|'cyclone'|'drought'|'heatwave'|'landslide'|'salinity', RiskLevel>>>;
}

export function getYearData(d: District, year: number, sc: Scenario, ov?: TrendOverrides): YearData {
  const ZTT  = ov?.zoneTempTrends ?? ZONE_TEMP_TREND;
  const ZRT  = ov?.zoneRainTrends ?? ZONE_RAIN_TREND;
  const idx  = year - 2016;
  const pIdx = Math.max(0, idx - 9);
  const is85 = sc === 'rcp85';
  const [tr45, tr85] = ZTT[d.zone] ?? [0.055, 0.085];
  const seed = d.id * 1000 + idx * 7 + (is85 ? 500 : 0);
  const sm   = is85 ? 1.5 : 1.0;

  const temp = Math.round((
    d.base.t + idx * 0.028 + pIdx * (is85 ? tr85 : tr45) + (sr(seed) - 0.5) * 0.55
  ) * 100) / 100;

  const rt   = ZRT[d.zone] ?? 2;
  const rain = Math.round(Math.max(400,
    d.base.r + idx * rt * 0.5 + pIdx * rt * sm + (sr(seed + 1) - 0.5) * d.base.r * 0.14,
  ));

  const humidity = Math.min(98, Math.max(45,
    Math.round(d.base.h + pIdx * 0.09 * sm + (sr(seed + 2) - 0.5) * 7),
  ));

  const slr = Math.round((
    d.base.s + Math.min(idx, 9) * 0.35 + pIdx * (is85 ? 0.65 : 0.45)
  ) * 100) / 100;

  return {
    temp, rain, humidity, slr,
    flood:    Math.max(0, Math.round(RISK_W[d.risks.flood]    * 1.5 + sr(seed + 3) * 3 + pIdx * 0.15 * sm)),
    cyclone:  Math.max(0, Math.round(RISK_W[d.risks.cyclone]  * 1.2 + sr(seed + 4) * 2 + pIdx * 0.06 * sm)),
    heatwave: Math.max(0, Math.round(RISK_W[d.risks.heatwave] * 2   + sr(seed + 5) * 5 + pIdx * 0.25 * sm)),
    drought:  Math.max(0, Math.round(RISK_W[d.risks.drought]  * 1.5 + sr(seed + 6) * 3 + pIdx * 0.12 * sm)),
  };
}

export const YEARS = Array.from({ length: 35 }, (_, i) => 2016 + i);

// ── District builder helper ────────────────────────────────────────────────
type R = RiskLevel;
const VH: R = 'Very High', H: R = 'High', M: R = 'Moderate', L: R = 'Low', VL: R = 'Very Low';

function mk(
  id: number, en: string, bn: string, div: string,
  lat: number, lng: number, area: number, zone: string,
  fl: R, cy: R, dr: R, hw: R, ls: R, sa: R,
  bt: number, br: number, bh: number, bs: number,
  sz: SeismicZone,
): District {
  return {
    id, name: { en, bn }, division: div, lat, lng, area, zone,
    zoneColor: ZONE_COLORS[zone] ?? '#6b7280',
    risks: { flood: fl, cyclone: cy, drought: dr, heatwave: hw, landslide: ls, salinity: sa },
    seismicZone: sz,
    base: { t: bt, r: br, h: bh, s: bs },
  };
}

// ── 64 Districts ──────────────────────────────────────────────────────────
export const DISTRICTS: District[] = [
  // DHAKA DIVISION
  mk(1,'Dhaka','ঢাকা','Dhaka',23.8103,90.4125,1464,'Central',H,L,L,H,VL,VL,26.16,2001,75,0,'II'),
  mk(2,'Faridpur','ফরিদপুর','Dhaka',23.607,89.842,2072,'Central',H,L,M,H,VL,VL,25.54,1526,70,0,'II'),
  mk(3,'Gazipur','গাজীপুর','Dhaka',24.096,90.413,1741,'Central',M,L,L,H,VL,VL,25.52,1502,74,0,'II'),
  mk(4,'Gopalganj','গোপালগঞ্জ','Dhaka',23.005,89.826,1490,'South-Central',H,L,L,M,VL,L,25.62,1848,74,0,'II'),
  mk(5,'Kishoreganj','কিশোরগঞ্জ','Dhaka',24.426,90.982,2689,'North-Eastern',H,L,L,M,VL,VL,25.28,1861,76,0,'III'),
  mk(6,'Madaripur','মাদারীপুর','Dhaka',23.239,90.187,1145,'Central',H,L,L,M,VL,L,25.92,1915,74,0,'II'),
  mk(7,'Manikganj','মানিকগঞ্জ','Dhaka',23.862,90.000,1378,'Central',H,L,L,H,VL,VL,25.93,1532,71,0,'II'),
  mk(8,'Munshiganj','মুন্সীগঞ্জ','Dhaka',23.498,90.413,955,'Central',H,L,L,M,VL,L,26.34,3647,80,0,'II'),
  mk(9,'Narayanganj','নারায়ণগঞ্জ','Dhaka',23.623,90.500,759,'Central',H,L,L,H,VL,VL,26.37,1951,75,0,'II'),
  mk(10,'Narsingdi','নরসিংদী','Dhaka',24.134,90.786,1141,'North-Eastern',M,L,L,M,VL,VL,25.83,2010,76,0,'III'),
  mk(11,'Rajbari','রাজবাড়ী','Dhaka',23.715,89.588,1119,'Western',H,L,H,H,VL,VL,25.55,4282,72,0,'II'),
  mk(12,'Shariatpur','শরীয়তপুর','Dhaka',23.242,90.435,1182,'Central',H,L,L,M,VL,L,26.14,2880,74,0,'II'),
  mk(13,'Tangail','টাঙ্গাইল','Dhaka',24.245,89.911,3414,'Northern',M,L,H,H,VL,VL,25.69,1515,69,0,'II'),
  // MYMENSINGH DIVISION
  mk(14,'Jamalpur','জামালপুর','Mymensingh',24.938,89.937,2032,'Northern',H,L,H,M,VL,VL,24.95,1451,73,0,'III'),
  mk(15,'Mymensingh','ময়মনসিংহ','Mymensingh',24.743,90.398,4362,'Northern',H,L,M,M,VL,VL,25.05,2448,76,0,'III'),
  mk(16,'Netrokona','নেত্রকোনা','Mymensingh',24.810,90.866,2810,'North-Eastern',H,L,M,M,VL,VL,25.4,3484,79,0,'IV'),
  mk(17,'Sherpur','শেরপুর','Mymensingh',25.075,90.150,1364,'Northern',M,L,H,M,VL,VL,25.12,2305,66,0,'III'),
  // RAJSHAHI DIVISION
  mk(18,'Bogra','বগুড়া','Rajshahi',24.844,89.370,2920,'Northern',M,L,H,H,VL,VL,25.6,1668,66,0,'III'),
  mk(19,'Joypurhat','জয়পুরহাট','Rajshahi',25.095,89.095,965,'Northern',L,L,H,H,VL,VL,26.01,1377,65,0,'III'),
  mk(20,'Naogaon','নওগাঁ','Rajshahi',24.913,88.753,3640,'North-Western',L,L,VH,VH,VL,VL,26.3,1254,61,0,'II'),
  mk(21,'Natore','নাটোর','Rajshahi',24.410,89.008,1895,'Northern',M,L,H,H,VL,VL,26.0,2212,65,0,'II'),
  mk(22,'Chapainawabganj','চাঁপাইনবাবগঞ্জ','Rajshahi',24.597,88.278,1702,'Western',L,L,VH,VH,VL,VL,26.32,1207,59,0,'II'),
  mk(23,'Pabna','পাবনা','Rajshahi',24.011,89.256,2371,'Western',H,L,H,H,VL,VL,26.11,1579,64,0,'II'),
  mk(24,'Rajshahi','রাজশাহী','Rajshahi',24.364,88.624,2407,'Western',L,L,VH,VH,VL,VL,26.4,1529,60,0,'II'),
  mk(25,'Sirajganj','সিরাজগঞ্জ','Rajshahi',24.314,89.570,2498,'Northern',H,L,H,H,VL,VL,25.1,1724,69,0,'II'),
  // RANGPUR DIVISION
  mk(26,'Dinajpur','দিনাজপুর','Rangpur',25.628,88.633,3439,'Northern',M,L,H,H,VL,VL,25.67,1772,67,0,'III'),
  mk(27,'Gaibandha','গাইবান্ধা','Rangpur',25.330,89.543,2179,'Northern',H,L,H,M,VL,VL,24.95,1161,64,0,'III'),
  mk(28,'Kurigram','কুড়িগ্রাম','Rangpur',25.807,89.630,2296,'Northern',VH,L,H,M,VL,VL,24.94,2132,70,0,'IV'),
  mk(29,'Lalmonirhat','লালমনিরহাট','Rangpur',25.992,89.285,1242,'Northern',H,L,H,M,VL,VL,25.54,1941,67,0,'IV'),
  mk(30,'Nilphamari','নীলফামারী','Rangpur',25.848,88.941,1642,'Northern',H,L,M,M,VL,VL,25.06,2002,67,0,'III'),
  mk(31,'Panchagarh','পঞ্চগড়','Rangpur',26.271,88.595,1404,'Northern',M,L,H,M,VL,VL,24.68,2367,71,0,'III'),
  mk(32,'Rangpur','রংপুর','Rangpur',25.744,89.275,2308,'Northern',H,L,H,M,VL,VL,24.8,2371,67,0,'III'),
  mk(33,'Thakurgaon','ঠাকুরগাঁও','Rangpur',26.042,88.428,1809,'North-Western',L,L,H,H,VL,VL,25.39,1795,63,0,'III'),
  // BARISAL DIVISION
  mk(34,'Barguna','বরগুনা','Barisal',22.095,90.112,1832,'South-Central',H,H,L,M,VL,H,25.73,2638,79,2.1,'I'),
  mk(35,'Barisal','বরিশাল','Barisal',22.703,90.347,2790,'South-Central',H,H,L,M,VL,H,25.04,2118,80,1.8,'I'),
  mk(36,'Bhola','ভোলা','Barisal',22.179,90.710,3403,'South-Central',VH,VH,L,M,VL,VH,25.74,3111,78,3.2,'I'),
  mk(37,'Jhalokati','ঝালকাঠি','Barisal',22.572,90.187,758,'South-Central',H,H,L,M,VL,H,25.62,2275,82,1.5,'I'),
  mk(38,'Patuakhali','পটুয়াখালী','Barisal',22.225,90.455,3205,'South-Central',VH,VH,L,M,VL,VH,25.5,2181,80,3.5,'I'),
  mk(39,'Pirojpur','পিরোজপুর','Barisal',22.579,89.976,1308,'South-Central',H,H,L,M,VL,H,26.22,1973,78,1.8,'I'),
  // CHATTOGRAM DIVISION
  mk(40,'Bandarban','বান্দরবান','Chattogram',21.831,92.369,4480,'South-Eastern',H,VH,VH,VL,M,VL,24.07,4491,86,0,'III'),
  mk(41,'Brahmanbaria','ব্রাহ্মণবাড়িয়া','Chattogram',23.961,91.112,1927,'North-Eastern',M,L,M,M,VL,VL,25.24,2223,73,0,'III'),
  mk(42,'Chandpur','চাঁদপুর','Chattogram',23.251,90.852,1704,'Central',H,M,L,M,VL,L,26.03,2402,79,0.5,'II'),
  mk(43,'Chattogram','চট্টগ্রাম','Chattogram',22.348,91.812,5285,'South-Eastern',H,H,M,L,M,L,24.15,3224,89,1.2,'III'),
  mk(44,'Comilla','কুমিল্লা','Chattogram',23.462,91.187,3084,'North-Eastern',M,L,M,M,VL,VL,25.74,2792,75,0,'III'),
  mk(45,"Cox's Bazar","কক্সবাজার",'Chattogram',21.440,92.008,2492,'South-Eastern',H,VH,L,L,M,H,23.86,6345,87,2.8,'III'),
  mk(46,'Feni','ফেনী','Chattogram',23.016,91.398,1125,'South-Eastern',H,H,L,M,VL,L,25.34,2649,77,0.8,'III'),
  mk(47,'Khagrachhari','খাগড়াছড়ি','Chattogram',23.132,91.949,2699,'South-Eastern',H,M,H,VL,H,VL,24.4,2653,88,0,'III'),
  mk(48,'Lakshmipur','লক্ষ্মীপুর','Chattogram',22.945,90.828,1456,'South-Eastern',H,H,L,M,VL,H,25.43,3483,79,1.5,'II'),
  mk(49,'Noakhali','নোয়াখালী','Chattogram',22.872,91.097,3601,'South-Eastern',H,H,L,M,VL,H,25.54,3513,78,2.0,'II'),
  mk(50,'Rangamati','রাঙামাটি','Chattogram',22.732,92.299,6116,'South-Eastern',H,M,H,VL,H,VL,23.79,1883,85,0,'III'),
  // SYLHET DIVISION
  mk(51,'Habiganj','হবিগঞ্জ','Sylhet',24.477,91.451,2636,'North-Eastern',H,L,M,L,VL,VL,24.97,2517,86,0,'IV'),
  mk(52,'Moulvibazar','মৌলভীবাজার','Sylhet',24.310,91.732,2799,'North-Eastern',H,L,M,L,VL,VL,24.81,2518,86,0,'IV'),
  mk(53,'Sunamganj','সুনামগঞ্জ','Sylhet',25.072,91.399,3670,'North-Eastern',VH,L,M,L,VL,VL,24.77,4363,88,0,'IV'),
  mk(54,'Sylhet','সিলেট','Sylhet',24.905,91.861,3489,'North-Eastern',VH,L,L,L,VL,VL,25.16,4433,89,0,'IV'),
  // KHULNA DIVISION
  mk(55,'Bagerhat','বাগেরহাট','Khulna',22.660,89.790,3960,'South-Western',H,H,M,M,VL,VH,25.46,2035,76,2.5,'I'),
  mk(56,'Chuadanga','চুয়াডাঙ্গা','Khulna',23.616,88.826,1158,'Western',L,L,VH,VH,VL,M,26.9,1553,66,0,'II'),
  mk(57,'Jessore','যশোর','Khulna',23.163,89.218,2567,'Western',M,L,H,H,VL,M,26.55,1704,68,0,'II'),
  mk(58,'Jhenaidah','ঝিনাইদহ','Khulna',23.545,89.173,1961,'Western',M,L,H,H,VL,L,26.68,1650,66,0,'II'),
  mk(59,'Khulna','খুলনা','Khulna',22.846,89.540,4317,'South-Western',H,H,M,M,VL,VH,25.96,2227,75,3.0,'I'),
  mk(60,'Kushtia','কুষ্টিয়া','Khulna',23.891,89.110,1620,'Western',L,L,VH,VH,VL,L,26.62,954,65,0,'II'),
  mk(61,'Magura','মাগুরা','Khulna',23.486,89.420,1049,'Western',M,L,H,H,VL,L,27.0,1682,67,0,'II'),
  mk(62,'Meherpur','মেহেরপুর','Khulna',23.805,88.672,716,'Western',L,L,VH,VH,VL,M,26.56,1946,64,0,'II'),
  mk(63,'Narail','নড়াইল','Khulna',23.166,89.499,917,'South-Western',M,L,H,H,VL,M,26.04,1322,68,0,'II'),
  mk(64,'Satkhira','সাতক্ষীরা','Khulna',22.316,89.112,3858,'South-Western',H,H,M,M,VL,VH,25.78,1980,74,3.5,'I'),
];

// ── Historical Earthquake Events ───────────────────────────────────────────
export const EARTHQUAKES: EarthquakeEvent[] = [
  { year:1869, mag:7.5, lat:24.8, lng:92.6, name:'Cachar Earthquake',
    impact:'Severe damage across Sylhet; liquefaction reported in river plains' },
  { year:1897, mag:8.0, lat:26.0, lng:91.0, name:'Great Assam Earthquake',
    impact:'Massive destruction in Sylhet & Mymensingh; thousands of casualties' },
  { year:1918, mag:7.6, lat:24.5, lng:92.4, name:'Srimangal Earthquake',
    impact:'Heavy structural damage in Sylhet division; railway lines buckled' },
  { year:1930, mag:7.1, lat:26.1, lng:90.0, name:'Dhubri Earthquake',
    impact:'Wide shaking felt across Rangpur and northern Bangladesh' },
  { year:1943, mag:6.1, lat:22.7, lng:89.1, name:'Satkhira Earthquake',
    impact:'Minor-moderate damage in SW Bangladesh' },
  { year:1988, mag:5.8, lat:25.8, lng:89.2, name:'Haripur Earthquake',
    impact:'Cracked buildings in Rangpur; no major casualties' },
  { year:1997, mag:6.0, lat:22.9, lng:92.5, name:'Bandarban Earthquake',
    impact:'Landslides in CHT; minor structural damage in Chattogram' },
  { year:2003, mag:5.0, lat:24.9, lng:91.7, name:'Sylhet Earthquake',
    impact:'Slight damage to older structures; widely felt across NE Bangladesh' },
  { year:2017, mag:5.9, lat:25.7, lng:89.5, name:'Rangpur Earthquake',
    impact:'Visible cracks in buildings; panic in northern districts' },
  { year:2020, mag:5.5, lat:22.6, lng:92.3, name:'Chattogram Earthquake',
    impact:'Felt strongly in Chattogram & Cox\'s Bazar; minor damage' },
  { year:2022, mag:5.6, lat:24.5, lng:91.3, name:'NE Bangladesh Earthquake',
    impact:'Felt across Sylhet, Mymensingh; cracked walls in old structures' },
];

// ── Indicator colour helpers ───────────────────────────────────────────────
export function indicatorColor(key: string, value: number): string {
  if (key === 'temp') {
    if (value < 24) return '#3b82f6'; if (value < 26) return '#22c55e';
    if (value < 28) return '#eab308'; if (value < 30) return '#f97316';
    return '#dc2626';
  }
  if (key === 'rain') {
    if (value < 1200) return '#fef3c7'; if (value < 1800) return '#fde68a';
    if (value < 2500) return '#fbbf24'; if (value < 3500) return '#f97316';
    if (value < 4500) return '#d97706'; return '#92400e';
  }
  if (key === 'humidity') {
    if (value < 65) return '#bfdbfe'; if (value < 75) return '#60a5fa';
    if (value < 85) return '#3b82f6'; return '#1d4ed8';
  }
  if (key === 'slr') {
    if (value < 2) return '#22c55e'; if (value < 6) return '#eab308';
    if (value < 12) return '#f97316'; if (value < 18) return '#ef4444';
    return '#7f1d1d';
  }
  if (key === 'flood' || key === 'heatwave' || key === 'drought') {
    if (value < 2) return '#22c55e'; if (value < 4) return '#eab308';
    if (value < 6) return '#f97316'; return '#dc2626';
  }
  if (key === 'cyclone') {
    if (value < 1) return '#22c55e'; if (value < 2) return '#eab308';
    if (value < 3) return '#f97316'; return '#dc2626';
  }
  return '#6b7280';
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  'Very High': '#7f1d1d', 'High': '#dc2626', 'Moderate': '#f59e0b',
  'Low': '#16a34a', 'Very Low': '#9ca3af',
};

export const DIVISIONS = [
  'Dhaka','Mymensingh','Rajshahi','Rangpur','Barisal','Chattogram','Sylhet','Khulna',
];
