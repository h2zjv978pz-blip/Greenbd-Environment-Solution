import fs from 'fs';
import path from 'path';
import { resolveProjectRoot } from './projectRoot';

// Try multiple candidate locations for the data directory.
// On some platforms process.cwd() is the project root; on others the server
// binary runs from a different directory. Walking candidates ensures we find
// the data/ folder wherever the platform puts it.
//
// The real project root is checked FIRST (and preferred) over process.cwd(),
// because process.cwd() on the standalone server often resolves inside
// .next/standalone — a build artifact directory that gets wiped on every
// `next build`. Writing there meant every admin edit (settings, projects,
// etc.) reverted back to the last git-committed values after each redeploy.
function resolveDataDir(): string {
  const root = resolveProjectRoot();
  const candidates = [
    path.join(root, 'data'),                                    // real project root — survives rebuilds
    path.join(process.cwd(), 'data'),                           // standard: process cwd
    path.join(process.cwd(), '..', 'data'),                     // one level up
    path.join(__dirname, '..', 'data'),                         // relative to compiled file
    path.join(__dirname, '..', '..', 'data'),
    path.join(__dirname, '..', '..', '..', 'data'),
    '/app/data',                                                 // common Docker container path
  ];

  for (const dir of candidates) {
    try {
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) return dir;
    } catch { /* continue */ }
  }

  // Fallback — will fail gracefully inside readData
  return path.join(process.cwd(), 'data');
}

const DATA_DIR = resolveDataDir();

export function readData<T>(file: string): T {
  const filePath = path.join(DATA_DIR, `${file}.json`);
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
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`[data] writeData("${file}") failed (read-only filesystem?):`, (err as Error).message);
  }
}

export function getNextId(items: { id: number }[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}
