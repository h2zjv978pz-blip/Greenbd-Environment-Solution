import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get('admin_token')?.value;
  return !!token && (await verifyToken(token));
}

export async function GET() {
  try {
    const data = readData('climateMap');
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  writeData('climateMap', body);
  return NextResponse.json({ ok: true });
}
