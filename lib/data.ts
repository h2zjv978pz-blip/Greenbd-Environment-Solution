import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export function readData<T>(file: string): T {
  const filePath = path.join(DATA_DIR, `${file}.json`);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err) {
    // On read-only deployments (Vercel/Netlify) the file may not be bundled.
    // Return a safe empty shell so the page renders instead of crashing.
    console.warn(`[data] readData("${file}") failed:`, (err as Error).message);
    return {} as T;
  }
}

export function writeData(file: string, data: unknown): void {
  const filePath = path.join(DATA_DIR, `${file}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Serverless platforms have read-only filesystems after deployment.
    // Admin edits won't persist, but the server won't crash.
    console.warn(`[data] writeData("${file}") failed (read-only filesystem?):`, (err as Error).message);
  }
}

export function getNextId(items: { id: number }[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}
