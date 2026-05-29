import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const ARRAY_KEY: Record<string, string> = {
  projects:     'projects',
  services:     'services',
  team:         'members',
  publications: 'publications',
  clients:      'clients',
  testimonials: 'testimonials',
  stats:        'stats',
  slides:       'slides',
};

async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get('admin_token')?.value;
  return !!token && (await verifyToken(token));
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { section, id } = await params;
  const body = await req.json();
  const key = ARRAY_KEY[section];
  if (!key) return NextResponse.json({ error: 'Invalid section' }, { status: 400 });

  const data = readData<Record<string, { id: number }[]>>(section);
  const idx = data[key].findIndex((i) => i.id === Number(id));
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  data[key][idx] = { ...data[key][idx], ...body, id: Number(id) };
  writeData(section, data);
  return NextResponse.json(data[key][idx]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { section, id } = await params;
  const key = ARRAY_KEY[section];
  if (!key) return NextResponse.json({ error: 'Invalid section' }, { status: 400 });

  const data = readData<Record<string, { id: number }[]>>(section);
  data[key] = data[key].filter((i) => i.id !== Number(id));
  writeData(section, data);
  return NextResponse.json({ ok: true });
}
