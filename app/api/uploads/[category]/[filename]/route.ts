import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { uploadDir, type UploadCategory } from '@/lib/uploadStorage';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4',
};

const CATEGORIES: UploadCategory[] = ['uploads', 'audio'];

// Serves uploaded files straight from disk on every request — bypassing the
// standalone server's bundled public/ snapshot, which only reflects whatever
// existed at build time and can never see files written afterward.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ category: string; filename: string }> }
) {
  const { category, filename } = await params;

  if (!CATEGORIES.includes(category as UploadCategory))
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\'))
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });

  try {
    const data = await readFile(path.join(uploadDir(category as UploadCategory), filename));
    const ext = path.extname(filename).toLowerCase();
    return new NextResponse(new Uint8Array(data), {
      headers: {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
