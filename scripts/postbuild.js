/**
 * postbuild.js
 * Copies data/ and public/ into .next/standalone/ so the standalone
 * server can find them at runtime on any deployment platform.
 */
const fs   = require('fs');
const path = require('path');

const root       = path.join(__dirname, '..');
const standalone = path.join(root, '.next', 'standalone');

if (!fs.existsSync(standalone)) {
  console.log('[postbuild] No .next/standalone found — skipping file copy (not a standalone build).');
  process.exit(0);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.cpSync(src, dest, { recursive: true, force: true });
  console.log(`[postbuild] Copied ${path.relative(root, src)} → ${path.relative(root, dest)}`);
}

copyDir(path.join(root, 'data'),   path.join(standalone, 'data'));
copyDir(path.join(root, 'public'), path.join(standalone, 'public'));

console.log('[postbuild] Done.');
