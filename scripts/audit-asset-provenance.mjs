import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = process.cwd();
const ledgerPath = 'vault/07-Production/Asset-License-Ledger-v1.md';
const mediaExtensions = new Set([
  '.svg', '.png', '.webp', '.jpg', '.jpeg', '.gif', '.avif', '.bmp',
  '.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.woff', '.woff2',
  '.ttf', '.otf', '.glb', '.gltf', '.obj', '.fbx', '.mp4', '.webm',
]);
const roots = ['public', 'src', 'android/app/src/main/res'];
const errors = [];

function walk(dir) {
  if (!existsSync(join(root, dir))) return [];
  return readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const ledger = readFileSync(join(root, ledgerPath), 'utf8');
const rows = new Map();
for (const line of ledger.split(/\r?\n/)) {
  const match = line.match(/^\|\s*`([^`]+)`\s*\|/);
  if (match) rows.set(match[1].replaceAll('/', sep), line);
}

const assets = [...new Set(roots.flatMap(walk))]
  .filter((path) => mediaExtensions.has(path.slice(path.lastIndexOf('.')).toLowerCase()))
  .map((path) => relative(root, join(root, path)).split(sep).join('/'))
  .sort();

for (const asset of assets) {
  const row = rows.get(asset);
  if (!row) errors.push(`${asset}: provenance ledger entry missing`);
  else if (!row.endsWith('| VERIFIED |')) errors.push(`${asset}: provenance is not VERIFIED`);
}

console.log(`Media assets inventoried: ${assets.length}`);
if (errors.length) {
  console.error(`BLOCKED: ${errors.length} media asset(s) lack verified rights/provenance.`);
  for (const error of errors.slice(0, 80)) console.error(`- ${error}`);
  if (errors.length > 80) console.error(`- ...and ${errors.length - 80} more`);
  process.exitCode = 1;
} else {
  console.log('All packaged media has a VERIFIED provenance record.');
}
