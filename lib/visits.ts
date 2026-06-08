import { readData, writeData } from './data';

interface VisitsData {
  total: number;
  daily: Record<string, number>; // 'YYYY-MM-DD' (UTC) → visit count
}

const RETENTION_DAYS = 90;

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function pruneOldDays(daily: Record<string, number>): Record<string, number> {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - RETENTION_DAYS);
  const cutoffKey = dateKey(cutoff);
  const pruned: Record<string, number> = {};
  for (const [key, count] of Object.entries(daily)) {
    if (key >= cutoffKey) pruned[key] = count;
  }
  return pruned;
}

// Records one visit for "today" (UTC). Called once per browser session.
export function recordVisit(): void {
  const data = readData<Partial<VisitsData>>('visits');
  const daily = pruneOldDays(data.daily || {});
  const today = dateKey(new Date());
  daily[today] = (daily[today] || 0) + 1;

  writeData('visits', {
    total: (data.total || 0) + 1,
    daily,
  } satisfies VisitsData);
}

export function getVisitStats() {
  const data = readData<Partial<VisitsData>>('visits');
  const daily = data.daily || {};

  const sumLastNDays = (n: number): number => {
    let sum = 0;
    const d = new Date();
    for (let i = 0; i < n; i++) {
      sum += daily[dateKey(d)] || 0;
      d.setUTCDate(d.getUTCDate() - 1);
    }
    return sum;
  };

  return {
    total: data.total || 0,
    today: daily[dateKey(new Date())] || 0,
    last7Days: sumLastNDays(7),
    last30Days: sumLastNDays(30),
  };
}
