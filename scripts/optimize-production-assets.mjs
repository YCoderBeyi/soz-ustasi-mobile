import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const roots = [
  'public/assets/level-start',
  'public/assets/ui/map',
  'public/assets/ui/start',
  'public/assets/ui/seals',
  'public/assets/gameplay/wheel-v3',
  'public/assets/reward/v2',
  'public/assets/map/topbar-3d',
  'public/assets/map/nav-3d',
];

const extensions = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const minBytes = 50 * 1024;

const maxDimensions = [
  { pattern: /public[\\/]assets[\\/]ui[\\/]seals[\\/]/, size: 512 },
  { pattern: /public[\\/]assets[\\/]ui[\\/]map[\\/](07-level-node-gold|08-level-node-active-blue|09-level-node-locked-wax)\.png$/, size: 512 },
  { pattern: /public[\\/]assets[\\/]ui[\\/]start[\\/]wax-seal-s\.png$/, size: 768 },
  { pattern: /public[\\/]assets[\\/]ui[\\/]start[\\/]logo-plaque\.png$/, size: 900 },
];

function getMaxDimension(filePath) {
  const normalizedPath = filePath.replaceAll(path.sep, '/');
  return maxDimensions.find((rule) => rule.pattern.test(normalizedPath))?.size;
}

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryFileOperation(operation) {
  let lastError;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      await wait(75 * (attempt + 1));
    }
  }
  throw lastError;
}

async function replaceFile(sourcePath, targetPath) {
  try {
    await retryFileOperation(() => fs.rename(sourcePath, targetPath));
  } catch (error) {
    if (error?.code !== 'EXDEV') {
      throw error;
    }
    await retryFileOperation(() => fs.copyFile(sourcePath, targetPath));
    await retryFileOperation(() => fs.unlink(sourcePath));
  }
}

async function listImages(root) {
  const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => []);
  const files = [];

  for (const entry of entries) {
    const filePath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listImages(filePath));
      continue;
    }
    if (entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(filePath);
    }
  }

  return files;
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const before = (await fs.stat(filePath)).size;
  if (before < minBytes) {
    return { filePath, before, after: before, changed: false, skipped: true };
  }

  const tempPath = path.join(
    os.tmpdir(),
    `sozustasi-asset-${process.pid}-${Date.now()}-${path.basename(filePath)}`,
  );
  let pipeline = sharp(filePath, { animated: false }).rotate();
  const maxDimension = getMaxDimension(filePath);

  if (maxDimension) {
    pipeline = pipeline.resize({
      width: maxDimension,
      height: maxDimension,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  if (ext === '.png') {
    pipeline = pipeline.png({
      compressionLevel: 9,
      effort: 10,
      palette: false,
    });
  } else if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({
      quality: 88,
      mozjpeg: true,
      chromaSubsampling: '4:4:4',
    });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({
      quality: 86,
      effort: 6,
    });
  }

  await pipeline.toFile(tempPath);
  const after = (await fs.stat(tempPath)).size;

  if (after < before) {
    await replaceFile(tempPath, filePath);
    return { filePath, before, after, changed: true, skipped: false };
  }

  await retryFileOperation(() => fs.unlink(tempPath));
  return { filePath, before, after: before, changed: false, skipped: false };
}

const files = (await Promise.all(roots.map(listImages))).flat();
const results = [];

for (const filePath of files) {
  results.push(await optimizeImage(filePath));
}

const changed = results.filter((result) => result.changed);
const savedBytes = changed.reduce((sum, result) => sum + (result.before - result.after), 0);

console.log(`Scanned ${results.length} production assets.`);
console.log(`Optimized ${changed.length} assets.`);
console.log(`Saved ${(savedBytes / 1024 / 1024).toFixed(2)} MB.`);

for (const result of changed.sort((a, b) => (b.before - b.after) - (a.before - a.after)).slice(0, 20)) {
  const saved = result.before - result.after;
  console.log(`- ${result.filePath}: ${(saved / 1024).toFixed(1)} KB saved`);
}
