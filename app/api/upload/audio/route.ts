import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const jar = await cookies();
  const token = jar.get('admin_token')?.value;
  if (!token || !(await verifyToken(token)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const audioDir = path.join(process.cwd(), 'public', 'audio');
  await mkdir(audioDir, { recursive: true });

  // Sanitise filename and prefix with timestamp to avoid collisions
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const stored = `${Date.now()}-${safe}`;
  const dest = path.join(audioDir, stored);

  await writeFile(dest, Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/audio/${stored}`, name: file.name });
}
