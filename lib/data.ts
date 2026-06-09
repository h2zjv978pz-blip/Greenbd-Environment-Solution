import fs from 'fs';
import path from 'path';
import { resolveProjectRoot } from './projectRoot';

// ── Persistent data storage strategy ─────────────────────────────────────────
//
// Problem: data/*.json are tracked in git. Every `git pull` during a Hostinger
// redeploy overwrites them with the last-committed versions, wiping every admin
// edit (new projects, settings, pictures, etc.).
//
// Auto-fix (no server configuration needed):
//   In production the app writes data to a folder ONE LEVEL ABOVE the git repo.
//   That parent directory is never touched by `git pull` or a full re-clone, so
//   all admin edits survive every future deployment automatically.
//
//   Layout on Hostinger:
//     /home/user/domains/greenbd23.com/          ← parent, git never touches this
//       greenbd_data/                            ← ✅ persistent production data
//       public_nodejs/  (git repo)               ← ❌ wiped on git pull
//
// The git-tracked data/*.json files remain as seed defaults. On first start
// after a fresh deploy, any missing file is auto-copied from there, so the site
// always comes up with valid content even on a brand new server.
//
// Override: set DATA_DIR=/absolute/path in your server environment variables to
// point to any custom location instead.

const customDataDir = process.env.DATA_DIR?.trim();

// Seed source: the git-tracked data/ inside the project root. On every fresh
// git pull these are reset to defaults, which is exactly what we want for
// seeding new environments — production data lives elsewhere (see below).
function seedDataDir(): string {
  return path.join(resolveProjectRoot(), 'data');
}

// In production, place data one level above the repo root so it is unreachable
// by git operations. Falls back to null in dev (NODE_ENV !== 'production') so
// local development continues to use the project's own data/ directory as before.
function resolveProductionDataDir(): string | null {
  if (process.env.NODE_ENV !== 'production') return null;
  const root = resolveProjectRoot();
  const parent = path.dirname(root);
  if (parent === root) return null; // at filesystem root, bail
  return path.join(parent, 'greenbd_data');
}

function resolveDataDir(): string {
  // 1. Explicit env override — highest priority.
  if (customDataDir) return path.resolve(customDataDir);

  // 2. Production auto-persistence — above the repo, git-proof.
  const prodDir = resolveProductionDataDir();
  if (prodDir) return prodDir;

  // 3. Development / fallback — walk candidates to find an existing data/ dir.
  const root = resolveProjectRoot();
  const candidates = [
    path.join(root, 'data'),
    path.join(process.cwd(), 'data'),
    path.join(process.cwd(), '..', 'data'),
    path.join(__dirname, '..', 'data'),
    path.join(__dirname, '..', '..', 'data'),
    path.join(__dirname, '..', '..', '..', 'data'),
    '/app/data',
  ];
  for (const dir of candidates) {
    try {
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) return dir;
    } catch { /* continue */ }
  }
  return path.join(process.cwd(), 'data');
}

const DATA_DIR = resolveDataDir();

// Auto-seed: copy the bundled default into DATA_DIR if the file is missing.
// Runs only when DATA_DIR differs from the seed source (i.e. in production).
function ensureSeeded(file: string, filePath: string): void {
  const seed = seedDataDir();
  if (DATA_DIR === seed) return;          // dev mode — same dir, nothing to seed
  if (fs.existsSync(filePath)) return;    // already present
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const seedFile = path.join(seed, `${file}.json`);
    if (fs.existsSync(seedFile)) {
      fs.copyFileSync(seedFile, filePath);
      console.log(`[data] first-run seed: ${file}.json → ${filePath}`);
    }
  } catch { /* best effort */ }
}

export function readData<T>(file: string): T {
  const filePath = path.join(DATA_DIR, `${file}.json`);
  ensureSeeded(file, filePath);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[data] readData("${file}") failed (${DATA_DIR}):`, (err as Error).message);
    return {} as T;
  }
}

export function writeData(file: string, data: unknown): void {
  const filePath = path.join(DATA_DIR, `${file}.json`);
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`[data] writeData("${file}") failed (read-only filesystem?):`, (err as Error).message);
  }
}

export function getNextId(items: { id: number }[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}
