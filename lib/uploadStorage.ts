import path from 'path';
import { resolveProjectRoot } from './projectRoot';

// Uploads live outside the git repo in production for the same reason as data
// files (see lib/data.ts): a `git pull` redeploy would otherwise wipe every
// image and audio file that was uploaded after the last git commit.
//
// Resolution order:
//   1. UPLOADS_DIR env var  — explicit absolute path (highest priority)
//   2. Production auto-dir  — one level above the repo root, git-proof
//   3. Dev fallback         — <project-root>/public/  (unchanged local behaviour)

function resolveUploadsRoot(): string {
  const custom = process.env.UPLOADS_DIR?.trim();
  if (custom) return path.resolve(custom);

  if (process.env.NODE_ENV === 'production') {
    const root   = resolveProjectRoot();
    const parent = path.dirname(root);
    if (parent !== root) return path.join(parent, 'greenbd_uploads');
  }

  return path.join(resolveProjectRoot(), 'public');
}

export const UPLOADS_ROOT = resolveUploadsRoot();

export type UploadCategory = 'uploads' | 'audio';

export function uploadDir(category: UploadCategory): string {
  return path.join(UPLOADS_ROOT, category);
}

export function uploadUrl(category: UploadCategory, filename: string): string {
  return `/api/uploads/${category}/${filename}`;
}
