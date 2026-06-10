import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { uploadDir, uploadUrl } from '@/lib/uploadStorage';
import { readData } from '@/lib/data';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB (PDFs can be large)

// Photos sharper than the source can ever look on a phone screen, so we
// boost contrast/clarity slightly on upload — see /admin/image-quality
const SHARPEN_PRESETS: Record<string, { sigma: number; m1: number; m2: number }> = {
  off:    { sigma: 0,    m1: 0,   m2: 0   },
  light:  { sigma: 0.8,  m1: 0.6, m2: 0.3 },
  medium: { sigma: 1,    m1: 1,   m2: 0.5 },
  strong: { sigma: 1.2,  m1: 1.5, m2: 0.8 },
};

const ENHANCEABLE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ImageSettings { mobileEnhance: boolean; sharpenLevel: keyof typeof SHARPEN_PRESETS; }

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

  let buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = uploadDir('uploads');
  await mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name).toLowerCase() || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

  if (ENHANCEABLE_TYPES.includes(file.type)) {
    const { mobileEnhance, sharpenLevel } = readData<ImageSettings>('imageSettings');
    const preset = SHARPEN_PRESETS[sharpenLevel] || SHARPEN_PRESETS.medium;
    if (mobileEnhance && preset.sigma > 0) {
      try {
        buffer = Buffer.from(await sharp(buffer)
          .sharpen({ sigma: preset.sigma, m1: preset.m1, m2: preset.m2 })
          .toBuffer());
      } catch (err) {
        console.warn('[upload] sharpen failed, saving original:', (err as Error).message);
      }
    }
  }

  await writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: uploadUrl('uploads', filename) });
}
