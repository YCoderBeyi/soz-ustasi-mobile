import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = path.resolve(
  'C:/Users/DELL/.cursor/projects/d-ydTeknik-13-Projelerim-APP-sozustas/assets',
);
const OUT = path.resolve('public/assets/screens');

const files = {
  bg: 'c__Users_DELL_AppData_Roaming_Cursor_User_workspaceStorage_0d04cf13cc0792c28b80fd6827f06ea8_images_9a204ba1-a569-4476-88e8-75a4deabf783-4397eb57-6f1c-4339-8c07-ab1f3ddd4752.png',
  logo: 'c__Users_DELL_AppData_Roaming_Cursor_User_workspaceStorage_0d04cf13cc0792c28b80fd6827f06ea8_images_d0348320-7269-4a62-a5d8-f71a110c45bb-aaad1606-a1ae-41d8-aff4-101ef5b90349.png',
  cta: 'c__Users_DELL_AppData_Roaming_Cursor_User_workspaceStorage_0d04cf13cc0792c28b80fd6827f06ea8_images_e72333fc-4e30-4bbd-830f-21a418fa94b6-9f10f147-2b63-4edc-a4e6-3b25c1626be2.png',
  seal: 'c__Users_DELL_AppData_Roaming_Cursor_User_workspaceStorage_0d04cf13cc0792c28b80fd6827f06ea8_images_214123b7-aff4-4046-b1b8-687aa0f7f8cf-985c43da-f4f6-4118-af28-15f83b3b5258.png',
};

/** Soft matte + opaque halo removal for AI-exported white backgrounds */
function applyMatte(data, threshold = 228) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const lightness = (r + g + b) / 3;

    if (min >= threshold) {
      data[i + 3] = 0;
      continue;
    }

    if (min >= threshold - 28) {
      const t = (min - (threshold - 28)) / 28;
      data[i + 3] = Math.round(a * (1 - t));
      const avg = lightness;
      data[i] = Math.round(r * (1 - t * 0.35) + avg * t * 0.35);
      data[i + 1] = Math.round(g * (1 - t * 0.35) + avg * t * 0.35);
      data[i + 2] = Math.round(b * (1 - t * 0.35) + avg * t * 0.35);
      continue;
    }

    // Opaque near-white fringe (white glow on dark bg)
    if (a > 200 && lightness > 205 && max - min < 28) {
      data[i + 3] = 0;
    }
  }
  return data;
}

async function toTransparentWebp(inputPath, outputPath, threshold = 228, lossless = false) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  applyMatte(data, threshold);

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 12 })
    .webp(
      lossless
        ? { lossless: true, effort: 6 }
        : { quality: 96, alphaQuality: 100, effort: 6, nearLossless: true },
    )
    .toFile(outputPath);

  console.log('✓', path.basename(outputPath));
}

async function cropTransparent(inputPath, region, outputPath, threshold = 226) {
  const { data, info } = await sharp(inputPath)
    .extract(region)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  applyMatte(data, threshold);

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 12 })
    .webp({ lossless: true, effort: 6 })
    .toFile(outputPath);

  console.log('✓', path.basename(outputPath));
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const bgIn = path.join(SRC, files.bg);
  await sharp(bgIn)
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(OUT, 'splash-bg.webp'));
  console.log('✓ splash-bg.webp');

  await toTransparentWebp(path.join(SRC, files.logo), path.join(OUT, 'logo-soz-ustasi.webp'), 232);
  await toTransparentWebp(path.join(SRC, files.seal), path.join(OUT, 'wax-seal.webp'), 242);

  const ctaIn = path.join(SRC, files.cta);
  const crops = {
    'btn-basla.webp': { left: 24, top: 12, width: 772, height: 288 },
    'btn-guest.webp': { left: 16, top: 332, width: 392, height: 158 },
    'btn-continue.webp': { left: 412, top: 332, width: 392, height: 158 },
    'welcome-card.webp': { left: 100, top: 500, width: 620, height: 220 },
  };

  for (const [name, region] of Object.entries(crops)) {
    await cropTransparent(ctaIn, region, path.join(OUT, name), 222);
  }

  console.log('\nSplash assets processed → public/assets/screens/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
