import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { recordVisit, getVisitStats } from '@/lib/visits';

async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get('admin_token')?.value;
  return !!token && (await verifyToken(token));
}

// Public — records one visit for the current browser session.
export async function POST() {
  recordVisit();
  return NextResponse.json({ ok: true });
}

// Admin-only — aggregate visit counts for the dashboard.
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(getVisitStats());
}
