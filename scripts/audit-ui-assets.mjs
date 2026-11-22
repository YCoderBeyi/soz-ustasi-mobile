import fs from "fs";
import path from "path";

const root = process.cwd();
const srcDir = path.join(root, "src");
const uiDirs = [
  path.join(root, "public", "assets", "ui", "svg"),
  path.join(root, "public", "assets", "ui", "v2"),
];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith(".svg")) acc.push(full);
  }
  return acc;
}

function readAllSource() {
  const files = [];
  function scan(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory() && e.name !== "node_modules") scan(f);
      else if (/\.(tsx?|css)$/.test(e.name)) files.push(fs.readFileSync(f, "utf8"));
    }
  }
  scan(srcDir);
  return files.join("\n");
}

const source = readAllSource();
const assets = walk(uiDirs[0]).concat(walk(uiDirs[1]));

const report = assets.map((file) => {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const base = path.basename(file);
  const refs = [
    rel,
    `/assets/ui/svg/${base}`,
    `/assets/ui/v2/${base}`,
    base.replace(/^\d+-/, "").replace(".svg", ""),
  ];
  const used = refs.some((r) => source.includes(r));
  const hasBakedText = /<text[\s>]/.test(fs.readFileSync(file, "utf8"));
  return { rel, used, hasBakedText };
});

const unused = report.filter((r) => !r.used);
const baked = report.filter((r) => r.hasBakedText);
const usedCount = report.filter((r) => r.used).length;

console.log("=== UI Asset Audit ===");
console.log(`Toplam SVG: ${report.length}`);
console.log(`Kullanılan: ${usedCount} (${Math.round((usedCount / report.length) * 100)}%)`);
console.log(`Kullanılmayan: ${unused.length}`);
console.log(`Baked text içeren: ${baked.length}`);

if (unused.length) {
  console.log("\n--- Kullanılmayan ---");
  unused.forEach((r) => console.log(`  ${r.rel}`));
}

if (baked.length) {
  console.log("\n--- Baked Text (dinamik olmalı) ---");
  baked.forEach((r) => console.log(`  ${r.rel}`));
}

const score = Math.round(
  (usedCount / report.length) * 30 +
    (baked.length === 0 ? 30 : Math.max(0, 30 - baked.length * 5)) +
    40 * (usedCount / report.length)
);

console.log(`\nKullanım skoru: ${score}/100`);
process.exit(unused.length > 20 ? 1 : 0);
