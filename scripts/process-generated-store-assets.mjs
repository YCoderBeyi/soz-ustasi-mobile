import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDir = path.join(root, "artifacts", "play-store", "generated-sources");
const outputDir = path.join(root, "artifacts", "play-store");

await sharp(path.join(sourceDir, "app-icon-3d-source.png"))
  .resize(512, 512, { fit: "cover", position: "centre" })
  .png({ compressionLevel: 9, palette: true, quality: 95 })
  .toFile(path.join(outputDir, "app-icon-3d-v2.png"));

await sharp(path.join(sourceDir, "feature-graphic-3d-source.png"))
  .resize(1024, 500, { fit: "cover", position: "centre" })
  .sharpen({ sigma: 0.4 })
  .jpeg({ quality: 92, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toFile(path.join(outputDir, "feature-graphic-3d-v2.jpg"));

for (const file of ["app-icon-3d-v2.png", "feature-graphic-3d-v2.jpg"]) {
  const imagePath = path.join(outputDir, file);
  const metadata = await sharp(imagePath).metadata();
  console.log(`${file}: ${metadata.width}x${metadata.height}, ${metadata.format}`);
}
