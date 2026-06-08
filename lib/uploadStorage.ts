import path from 'path';
import { resolveProjectRoot } from './projectRoot';

// ── Why this file exists ────────────────────────────────────────────────────
// This app builds with `output: 'standalone'`. Next.js regenerates the entire
// `.next` directory (including `.next/standalone`) from scratch on every
// `next build`, which runs on every redeploy. The old upload routes wrote
// files to `path.join(process.cwd(), 'public', 'uploads')` — and on the
// standalone server, `process.cwd()` resolves *inside* `.next/standalone`,
// so every uploaded image landed in a directory that gets wiped on the next
// rebuild. That's why images kept disappearing after redeploys.
//
// The fix: walk back out of any `.next/...` segment to find the real project
// root (which isn't touched by `next build`), and serve uploaded files
// through an API route that reads from disk on each request — instead of
// relying on the standalone server's bundled `public/` snapshot, which never
// sees files written after the build completed.

const customRoot = process.env.UPLOADS_DIR?.trim();

// Optional escape hatch: point UPLOADS_DIR at an absolute path outside the
// deploy folder (e.g. one created via the host's file manager) for storage
// that survives even a full re-clone style redeploy.
export const UPLOADS_ROOT = customRoot ? path.resolve(customRoot) : path.join(resolveProjectRoot(), 'public');

export type UploadCategory = 'uploads' | 'audio';

export function uploadDir(category: UploadCategory): string {
  return path.join(UPLOADS_ROOT, category);
}

export function uploadUrl(category: UploadCategory, filename: string): string {
  return `/api/uploads/${category}/${filename}`;
}
