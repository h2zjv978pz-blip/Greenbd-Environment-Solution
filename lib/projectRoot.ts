import path from 'path';

// The app builds with output: 'standalone', and the standalone server's
// process.cwd() often resolves to somewhere inside `.next/standalone` —
// a directory `next build` regenerates from scratch on every redeploy.
// Anything written there (data edits, uploads) gets wiped on the next
// rebuild and replaced with whatever was last committed to git, which is
// why settings/content kept reverting after deployments.
//
// This walks back out of any `.next/...` segment to land on the real
// project root, which `next build` never touches.
export function resolveProjectRoot(): string {
  let dir = process.cwd();
  while (dir.split(path.sep).includes('.next')) {
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return dir;
}
