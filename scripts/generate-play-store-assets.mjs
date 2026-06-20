import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const outputDir = path.resolve('artifacts/play-store');
await fs.mkdir(outputDir, { recursive: true });

await sharp('public/favicon.png')
  .resize(512, 512, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toFile(path.join(outputDir, 'app-icon-512.png'));

const logo = await sharp('public/favicon.png')
  .resize(250, 250, { fit: 'cover' })
  .png()
  .toBuffer();

const background = Buffer.from(`
  <svg width="1024" height="500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#071426"/>
        <stop offset="0.55" stop-color="#10385a"/>
        <stop offset="1" stop-color="#2f9cc8"/>
      </linearGradient>
      <radialGradient id="glow">
        <stop offset="0" stop-color="#f1c96a" stop-opacity=".28"/>
        <stop offset="1" stop-color="#f1c96a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1024" height="500" fill="url(#bg)"/>
    <circle cx="835" cy="125" r="310" fill="url(#glow)"/>
    <path d="M0 430 C180 350 330 470 520 400 S830 350 1024 415 V500 H0Z"
          fill="#061326" opacity=".7"/>
    <text x="72" y="175" fill="#fff9ef" font-family="Arial, sans-serif"
          font-size="76" font-weight="800">Söz <tspan fill="#f1c96a">Ustası</tspan></text>
    <text x="76" y="233" fill="#dce9ef" font-family="Arial, sans-serif"
          font-size="27">Harfleri birleştir, kelimeleri keşfet.</text>
    <text x="76" y="278" fill="#dce9ef" font-family="Arial, sans-serif"
          font-size="27">Mührü aç, Türkçeni geliştir.</text>
    <rect x="76" y="320" width="315" height="52" rx="26"
          fill="#f1c96a" fill-opacity=".16" stroke="#f1c96a" stroke-opacity=".65"/>
    <text x="101" y="354" fill="#f7d987" font-family="Arial, sans-serif"
          font-size="20" font-weight="700">ÇEVRİMDIŞI KELİME MACERASI</text>
  </svg>
`);

await sharp(background)
  .composite([{ input: logo, left: 715, top: 125 }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(outputDir, 'feature-graphic-1024x500.png'));

console.log(`Play Store assets generated in ${outputDir}`);
