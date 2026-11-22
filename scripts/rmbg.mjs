import sharp from "sharp";
async function process(src, tol) {
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const freq = {};
  for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) {
    const i = (y * w + x) * 3; freq[`${data[i]},${data[i + 1]},${data[i + 2]}`] = (freq[`${data[i]},${data[i + 1]},${data[i + 2]}`] || 0) + 1;
  }
  for (let y = 0; y < 10; y++) for (let x = w - 10; x < w; x++) {
    const i = (y * w + x) * 3; freq[`${data[i]},${data[i + 1]},${data[i + 2]}`] = (freq[`${data[i]},${data[i + 1]},${data[i + 2]}`] || 0) + 1;
  }
  for (let y = h - 10; y < h; y++) for (let x = 0; x < 10; x++) {
    const i = (y * w + x) * 3; freq[`${data[i]},${data[i + 1]},${data[i + 2]}`] = (freq[`${data[i]},${data[i + 1]},${data[i + 2]}`] || 0) + 1;
  }
  for (let y = h - 10; y < h; y++) for (let x = w - 10; x < w; x++) {
    const i = (y * w + x) * 3; freq[`${data[i]},${data[i + 1]},${data[i + 2]}`] = (freq[`${data[i]},${data[i + 1]},${data[i + 2]}`] || 0) + 1;
  }
  const bg = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  console.log(`${src} bg: rgb(${bg}) tol=${tol}`);
  const out = Buffer.alloc(w * h * 4);
  let removed = 0;
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const d = Math.sqrt((data[i] - bg[0]) ** 2 + (data[i + 1] - bg[1]) ** 2 + (data[i + 2] - bg[2]) ** 2);
    const isBg = d < tol;
    if (isBg) removed++;
    out[j] = data[i]; out[j + 1] = data[i + 1]; out[j + 2] = data[i + 2];
    out[j + 3] = isBg ? 0 : 255;
  }
  console.log(`  removed: ${(removed / (w * h) * 100).toFixed(1)}%`);
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toFile(src);
  const m = await sharp(src).metadata();
  console.log(`  → ${m.width}x${m.height} alpha:${m.hasAlpha}`);
}
await process("public/assets/ui/start/logo-plaque.png", 80);
await process("public/assets/ui/start/wax-seal-s.png", 70);
