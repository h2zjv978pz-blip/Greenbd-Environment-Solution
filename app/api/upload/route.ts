import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB (PDFs can be large)

export async function POST(req: NextRequest) {
  const jar = await cookies();
  const token = jar.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: 'Only JPG, PNG, WEBP, GIF, SVG or PDF allowed' }, { status: 400 });
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: 'File is too large (max 20 MB)' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name).toLowerCase() || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  await writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
