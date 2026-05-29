import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, getNextId } from '@/lib/data';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Sections that hold an array under a specific key
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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  try {
    const data = readData(section);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { section } = await params;
  const body = await req.json();

  // Handle flat sections (about, contact, hero metadata)
  const key = ARRAY_KEY[section];
  if (!key) {
    writeData(section, body);
    return NextResponse.json(body);
  }

  // Array sections: add new item
  const data = readData<Record<string, { id: number }[]>>(section);
  const newItem = { id: getNextId(data[key] || []), ...body };
  data[key] = [...(data[key] || []), newItem];
  writeData(section, data);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { section } = await params;
  const body = await req.json();

  // Full replacement for flat objects (about, contact, hero)
  writeData(section, body);
  return NextResponse.json(body);
}
