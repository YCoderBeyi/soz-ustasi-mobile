import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const source = path.join(root, 'artifacts', 'play-store', 'app-icon-3d-v2.png');
const res = path.join(root, 'android', 'app', 'src', 'main', 'res');

const densities = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

for (const [density, size] of Object.entries(densities)) {
  const folder = path.join(res, `mipmap-${density}`);

  await sharp(source)
    .resize(size, size, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(folder, 'ic_launcher.png'));

  await sharp(source)
    .resize(size, size, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(folder, 'ic_launcher_round.png'));

  const foregroundSize = Math.round(size * 2.25);
  const artworkSize = Math.round(foregroundSize * 0.66);
  const artwork = await sharp(source)
    .resize(artworkSize, artworkSize, { fit: 'contain' })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: foregroundSize,
      height: foregroundSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: artwork, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(folder, 'ic_launcher_foreground.png'));
}

console.log('Android launcher and splash foreground assets generated.');
