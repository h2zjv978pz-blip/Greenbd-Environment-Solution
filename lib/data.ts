import fs from 'fs';
import path from 'path';
import { resolveProjectRoot } from './projectRoot';

// ── Why DATA_DIR exists ───────────────────────────────────────────────────────
// All data/*.json files are tracked in git. Every `git pull` during a
// Hostinger redeploy overwrites them with the last-committed versions,
// wiping every admin edit made since then (new projects, updated settings, etc.).
//
// Setting DATA_DIR to an absolute path OUTSIDE the repo (e.g.
// /home/u123456789/greenbd_data) keeps production data completely isolated from
// git. On first access of any file, we auto-seed from the bundled defaults in
// data/ so no manual copying is needed.
//
// Without DATA_DIR the behaviour is unchanged (backwards-compatible): data is
// read from and written to <project-root>/data/, which survives `next build`
// restarts but IS wiped by a full git-pull redeploy.

const customDataDir = process.env.DATA_DIR?.trim();

function resolveDataDir(): string {
  // Custom persistent directory — highest priority, survives ALL redeploys.
  if (customDataDir) return path.resolve(customDataDir);

  // Walk candidates to find an existing data/ directory. The real project root
  // is checked first because process.cwd() on the standalone server often
  // resolves inside .next/standalone — a build artifact wiped by `next build`.
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

// Seed directory: where bundled default JSON files live (inside the git repo).
// Used to bootstrap DATA_DIR on first run.
function seedDir(): string {
  const root = resolveProjectRoot();
  return path.join(root, 'data');
}

// Auto-seed: if DATA_DIR is external and the file doesn't exist there yet,
// copy the bundled default. Safe on concurrent access — worst case two requests
// race to copy the same seed; both writes are idempotent.
function ensureSeeded(file: string, filePath: string): void {
  if (!customDataDir) return;            // only needed for external DATA_DIR
  if (fs.existsSync(filePath)) return;   // already present
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const seed = path.join(seedDir(), `${file}.json`);
    if (fs.existsSync(seed)) {
      fs.copyFileSync(seed, filePath);
      console.log(`[data] seeded ${file}.json → ${filePath}`);
    }
  } catch { /* best effort — readData will return {} and warn below */ }
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
