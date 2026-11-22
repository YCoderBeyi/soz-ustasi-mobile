const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcImage = 'd:/ydTeknik/13-Projelerim/APP/sozustası/public/favicon.png';
const resDir = 'd:/ydTeknik/13-Projelerim/APP/sozustası/android/app/src/main/res';
const bgColor = '#061326'; // Deep navy blue matching the theme

const launcherSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

const foregroundSizes = {
  'mipmap-mdpi': 108,
  'mipmap-hdpi': 162,
  'mipmap-xhdpi': 216,
  'mipmap-xxhdpi': 324,
  'mipmap-xxxhdpi': 432
};

const splashScreens = [
  { path: 'drawable/splash.png', w: 480, h: 320, land: true },
  { path: 'drawable-land-hdpi/splash.png', w: 800, h: 480, land: true },
  { path: 'drawable-land-mdpi/splash.png', w: 480, h: 320, land: true },
  { path: 'drawable-land-xhdpi/splash.png', w: 1280, h: 720, land: true },
  { path: 'drawable-land-xxhdpi/splash.png', w: 1600, h: 960, land: true },
  { path: 'drawable-land-xxxhdpi/splash.png', w: 1920, h: 1280, land: true },
  { path: 'drawable-port-hdpi/splash.png', w: 480, h: 800, land: false },
  { path: 'drawable-port-mdpi/splash.png', w: 320, h: 480, land: false },
  { path: 'drawable-port-xhdpi/splash.png', w: 720, h: 1280, land: false },
  { path: 'drawable-port-xxhdpi/splash.png', w: 960, h: 1600, land: false },
  { path: 'drawable-port-xxxhdpi/splash.png', w: 1280, h: 1920, land: false }
];

async function generate() {
  console.log('Generating Android assets...');

  // 1. Generate launcher icons (standard & round)
  for (const [folder, size] of Object.entries(launcherSizes)) {
    const destFolder = path.join(resDir, folder);
    if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });

    // ic_launcher.png (square)
    await sharp(srcImage)
      .resize(size, size)
      .toFile(path.join(destFolder, 'ic_launcher.png'));

    // ic_launcher_round.png (round mask)
    const radius = size / 2;
    const circleSvg = Buffer.from(
      `<svg><circle cx="${radius}" cy="${radius}" r="${radius}" /></svg>`
    );
    await sharp(srcImage)
      .resize(size, size)
      .composite([{ input: circleSvg, blend: 'dest-in' }])
      .toFile(path.join(destFolder, 'ic_launcher_round.png'));

    console.log(`Generated ic_launcher & round in ${folder} (${size}x${size})`);
  }

  // 2. Generate launcher foreground (adaptive icon)
  for (const [folder, size] of Object.entries(foregroundSizes)) {
    const destFolder = path.join(resDir, folder);
    if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });

    // Adaptive icon foreground needs padding around the logo. We place a scaled logo in the center of a transparent canvas.
    const logoSize = Math.round(size * 0.65); // 65% of size is the actual logo
    const logoResized = await sharp(srcImage).resize(logoSize, logoSize).toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent background
      }
    })
    .composite([{ input: logoResized, gravity: 'center' }])
    .toFile(path.join(destFolder, 'ic_launcher_foreground.png'));

    console.log(`Generated ic_launcher_foreground in ${folder} (${size}x${size})`);
  }

  // 3. Generate splash screens
  for (const splash of splashScreens) {
    const destPath = path.join(resDir, splash.path);
    const destFolder = path.dirname(destPath);
    if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });

    // Splash logo size should be relative to screen dimension (e.g., 30% of minimum dimension)
    const minDim = Math.min(splash.w, splash.h);
    const logoSize = Math.round(minDim * 0.35); // 35% of small dimension

    const logoResized = await sharp(srcImage).resize(logoSize, logoSize).toBuffer();

    await sharp({
      create: {
        width: splash.w,
        height: splash.h,
        channels: 4,
        background: bgColor
      }
    })
    .composite([{ input: logoResized, gravity: 'center' }])
    .toFile(destPath);

    console.log(`Generated splash screen for ${splash.path} (${splash.w}x${splash.h})`);
  }

  console.log('Android assets generated successfully!');
}

generate().catch(console.error);
