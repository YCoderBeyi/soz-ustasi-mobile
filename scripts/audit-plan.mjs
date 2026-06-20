/**
 * audit-plan.mjs — Plan Uyum Denetimi
 *
 * `audit:levels` teknik geçerliliği kontrol eder (üretilebilirlik, normalize, yasaklı içerik).
 * Bu araç ise ana yolculuğu PLAN sözleşmesine göre ölçer:
 *   vault/07-Production/Soz-Ustasi-240-Level-Learning-Journey-Master-Plan-v1.md
 *
 * Kontrol edilen plan kuralları:
 *   §7.1  Harf/ana-kelime/ortalama-uzunluk bantları
 *   §7.3  5 seviyelik hareketli zorluk ortalaması geriye gidemez; tek seviye düşüşü <= %18
 *   §6.4  Ana kelime tekrar mesafesi >= 40; gizli kelime tekrar mesafesi >= 20
 *   §6.2  Gizli kelime alışkanlığı (gizli kelimesiz seviye taraması)
 *   §5/§9 Keşif kartı sözleşmesi (impact / today / sourceNotes / contentReviewStatus)
 *   §18.1 Katalog büyüklüğü hedefi
 *
 * NOT: Zorluk skorundaki nadirlik/kesişim/belirsizlik bileşenleri PROXY'dir
 * (editoryal difficulty etiketi + kelime uzunluğu + ana kelime sayısı). Mutlak değil,
 * göreli eğri/regresyon tespiti için kullanılır.
 *
 * Çıkış: varsayılan 0 (bilgilendirme). `--strict` ile ihlal varsa 1 döner.
 */
import fs from 'node:fs';
import vm from 'node:vm';

/* global console, process */

const TARGET_CATALOG = 240; // ana yolculuk hedefi (yakın hedef 46-120)

function loadLevels() {
  const modules = [
    ['src/data/levels46to50.ts', 'levels46to50'],
    ['src/data/levels51to55.ts', 'levels51to55'],
    ['src/data/levels56to60.ts', 'levels56to60'],
    ['src/data/levels61to65.ts', 'levels61to65'],
    ['src/data/levels66to70.ts', 'levels66to70'],
    ['src/data/levels71to75.ts', 'levels71to75'],
  ];
  const authored = modules.map(([file, name]) => (
    fs.readFileSync(file, 'utf8')
      .replace(/^import .*?;\s*/gm, '')
      .replace(new RegExp(`export const ${name}: LevelData\\[\\] =`), `const ${name} =`)
  )).join('\n');
  const base = fs.readFileSync('src/data/levels.ts', 'utf8')
    .replace(/^import .*?;\s*/gm, '')
    .replace(/const baseLevels: LevelData\[\] =/, 'const baseLevels =')
    .replace(/export const levels: LevelData\[\] =[\s\S]*$/, '');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`${authored}\n${base}\nresult = [...baseLevels, ...authoredMasteryLevels];`, ctx);
  return ctx.result;
}

function loadStories() {
  const baseSrc = fs.readFileSync('src/data/levelStories.ts', 'utf8')
    .replace(/^import .*?;\s*/gm, '')
    .replace(/const baseLevelStories: LevelStory\[\] =/, 'const baseLevelStories =')
    .replace(/export const levelStories:[\s\S]*$/, '');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`${baseSrc}\nresult = baseLevelStories;`, ctx);
  const base = ctx.result;
  const authored = [
    ['src/data/levelStories46to50.ts', 'levelStories46to50'],
    ['src/data/levelStories51to55.ts', 'levelStories51to55'],
    ['src/data/levelStories56to60.ts', 'levelStories56to60'],
    ['src/data/levelStories61to65.ts', 'levelStories61to65'],
    ['src/data/levelStories66to70.ts', 'levelStories66to70'],
    ['src/data/levelStories71to75.ts', 'levelStories71to75'],
  ].flatMap(([file, name]) => {
    const src = fs.readFileSync(file, 'utf8')
      .replace(/^import .*?;\s*/gm, '')
      .replace(new RegExp(`export const ${name}: LevelStory\\[\\] =`), `const ${name} =`);
    const c = {};
    vm.createContext(c);
    vm.runInContext(`${src}\nresult = ${name};`, c);
    return c.result;
  });
  return [...base, ...authored];
}

const norm = (w) => w.trim().toLocaleUpperCase('tr-TR').normalize('NFD').replace(/[̀-ͯ]/g, '').replaceAll('İ', 'I');

// PLAN §7.3 zorluk proxy
function score(l) {
  const letterCount = l.letters.length;
  const mainCount = l.mainWords.length;
  const avgLen = l.mainWords.reduce((s, w) => s + w.word.length, 0) / mainCount;
  const rarity = l.mainWords.reduce((s, w) => s + (w.difficulty ?? 1), 0) / mainCount;
  const crossing = l.mainWords.filter((w) => w.word.length >= 5).length;
  const ambiguity = Math.max(0, mainCount - 2);
  const hidden = l.hiddenWords.length;
  return letterCount * 1.2 + mainCount * 1.5 + avgLen * 1.8 + rarity * 2.0 + crossing * 1.3 + ambiguity * 1.1 + hidden * 0.4;
}

// PLAN §7.1 bantlar
function band(id) {
  if (id <= 20) return { letters: [3, 5], main: [2, 3], avg: [2.5, 4.0] };
  if (id <= 60) return { letters: [4, 6], main: [3, 4], avg: [3.5, 5.0] };
  if (id <= 120) return { letters: [5, 7], main: [3, 5], avg: [4.0, 6.0] };
  if (id <= 180) return { letters: [5, 8], main: [4, 6], avg: [4.5, 6.5] };
  return { letters: [6, 8], main: [4, 7], avg: [5.0, 7.0] };
}

const levels = loadLevels().slice().sort((a, b) => a.levelId - b.levelId);
const stories = loadStories();
const storyById = new Map(stories.map((s) => [s.levelId, s]));
const scored = levels.map((l) => ({ id: l.levelId, s: score(l), l }));

const findings = { critical: [], major: [], minor: [] };

// §7.3 hareketli ortalama gerilemesi
const ma = scored.map((_, i) => {
  const win = scored.slice(Math.max(0, i - 4), i + 1);
  return win.reduce((s, v) => s + v.s, 0) / win.length;
});
const maReg = [];
for (let i = 1; i < ma.length; i++) if (ma[i] < ma[i - 1] - 0.01) maReg.push(`L${scored[i].id} (${ma[i - 1].toFixed(1)}→${ma[i].toFixed(1)})`);
if (maReg.length) findings.critical.push(`§7.3 5-seviye hareketli ortalama ${maReg.length} kez geriliyor (hedef 0): ${maReg.join(', ')}`);

// §7.3 tek seviye >%18 düşüş
const drops = [];
for (let i = 1; i < scored.length; i++) {
  const d = (scored[i - 1].s - scored[i].s) / scored[i - 1].s;
  if (d > 0.18) drops.push(`L${scored[i].id} (-%${(d * 100).toFixed(0)})`);
}
if (drops.length) findings.critical.push(`§7.3 ${drops.length} seviyede tek-adım düşüş %18'i aşıyor: ${drops.join(', ')}`);

// §7.3 bölüm finali >= bölüm ortalaması +%12 ve yeni bölüm başlangıcı >= önceki bölüm başlangıcı
const chapBuckets = new Map();
for (const sc of scored) {
  const ci = Math.floor((sc.id - 1) / 20);
  if (!chapBuckets.has(ci)) chapBuckets.set(ci, []);
  chapBuckets.get(ci).push(sc);
}
const finaleIssues = [];
const startIssues = [];
let prevStart = null;
for (const [ci, arr] of [...chapBuckets.entries()].sort((a, b) => a[0] - b[0])) {
  const avg = arr.reduce((s, v) => s + v.s, 0) / arr.length;
  const finale = arr[arr.length - 1];
  if (arr.length === 20 && finale.s < avg * 1.12) {
    finaleIssues.push(`Bölüm ${ci + 1} finali L${finale.id} (${finale.s.toFixed(1)}) < ort+%12 (${(avg * 1.12).toFixed(1)})`);
  }
  const start = arr[0];
  if (prevStart && start.s < prevStart.s - 0.01) {
    startIssues.push(`Bölüm ${ci + 1} başı L${start.id} (${start.s.toFixed(1)}) < önceki bölüm başı L${prevStart.id} (${prevStart.s.toFixed(1)})`);
  }
  prevStart = start;
}
if (finaleIssues.length) findings.critical.push(`§7.3 bölüm finali ≥ ortalama+%12 ihlali: ${finaleIssues.join('; ')}`);
if (startIssues.length) findings.major.push(`§7.3 yeni bölüm başlangıcı önceki bölüm başlangıcından kolay: ${startIssues.join('; ')}`);

// §7.1 bant ihlalleri
const bandV = [];
for (const { id, l } of scored) {
  const b = band(id);
  const avg = l.mainWords.reduce((s, w) => s + w.word.length, 0) / l.mainWords.length;
  const iss = [];
  if (l.letters.length < b.letters[0] || l.letters.length > b.letters[1]) iss.push(`harf ${l.letters.length}∉[${b.letters}]`);
  if (l.mainWords.length < b.main[0] || l.mainWords.length > b.main[1]) iss.push(`ana ${l.mainWords.length}∉[${b.main}]`);
  if (avg < b.avg[0] - 0.01 || avg > b.avg[1] + 0.01) iss.push(`ortUz ${avg.toFixed(1)}∉[${b.avg}]`);
  if (iss.length) bandV.push(`L${id}: ${iss.join(', ')}`);
}
if (bandV.length) findings.major.push(`§7.1 ${bandV.length} seviye zorluk bandı dışında:\n    ${bandV.join('\n    ')}`);

// §6.4 ana kelime >=40, gizli >=20
const mainLast = new Map(); const mainRep = [];
const hidLast = new Map(); const hidRep = [];
for (const { id, l } of scored) {
  for (const w of l.mainWords) { const n = norm(w.word); if (mainLast.has(n) && id - mainLast.get(n) < 40) mainRep.push(`${w.word} (L${mainLast.get(n)}→L${id}, mesafe ${id - mainLast.get(n)})`); mainLast.set(n, id); }
  for (const w of l.hiddenWords) { const n = norm(w.word); if (hidLast.has(n) && id - hidLast.get(n) < 20) hidRep.push(`${w.word} (L${hidLast.get(n)}→L${id}, mesafe ${id - hidLast.get(n)})`); hidLast.set(n, id); }
}
if (mainRep.length) findings.critical.push(`§6.4 ana kelime <40 seviye tekrarı (${mainRep.length}): ${mainRep.join(', ')}`);
if (hidRep.length) findings.critical.push(`§6.4 gizli kelime <20 seviye tekrarı (${hidRep.length}): ${hidRep.join(', ')}`);

// §5/§9 keşif kartı sözleşmesi (tip artık impact/today/sourceNotes/contentReviewStatus destekliyor)
const cardGaps = [];
let missingImpactToday = 0;
let unapproved = 0;
for (const { id } of scored) {
  const st = storyById.get(id);
  if (!st) { cardGaps.push(`L${id}`); continue; }
  if (!st.impact || !st.today) missingImpactToday++;
  if (st.contentReviewStatus !== 'approved') unapproved++;
}
if (cardGaps.length) findings.critical.push(`§5 Eksik keşif kartı: ${cardGaps.join(', ')}`);
if (missingImpactToday) findings.major.push(`§9.1 ${missingImpactToday}/${scored.length} kartta "impact" (Neden önemli?) ve/veya "today" (Bugün nerede?) içeriği yok — yapısal alanlar hazır, editoryal içerik borcu.`);
if (unapproved) findings.minor.push(`§16.3 ${unapproved}/${scored.length} kart contentReviewStatus='approved' değil — içerik onay izlenmiyor.`);

// §6.2 gizli kelimesiz
const noHidden = scored.filter(({ l }) => l.hiddenWords.length === 0).map((x) => x.id);
if (noHidden.length) findings.minor.push(`§6.2 gizli kelimesi olmayan seviyeler: ${noHidden.join(', ')} (L1 girişte kabul)`);

// §18.1 katalog büyüklüğü
if (levels.length < TARGET_CATALOG) findings.major.push(`§18.1 Katalog ${levels.length}/${TARGET_CATALOG} seviye. Eksik ana yol içeriği: ${TARGET_CATALOG - levels.length}.`);

// tema dağılımı (bilgi)
const themeCount = {};
for (const { l } of scored) themeCount[l.themeId] = (themeCount[l.themeId] ?? 0) + 1;

// ---- Rapor ----
const line = '─'.repeat(60);
console.log(`${line}\nPLAN UYUM DENETİMİ — ${levels.length} seviye\n${line}`);
console.log(`Tema dağılımı: ${JSON.stringify(themeCount)}\n`);
for (const [sev, label] of [['critical', '🔴 KRİTİK'], ['major', '🟠 ÖNEMLİ'], ['minor', '🟡 İKİNCİL']]) {
  console.log(`${label} (${findings[sev].length})`);
  if (!findings[sev].length) console.log('  (yok)');
  else findings[sev].forEach((f) => console.log(`  - ${f}`));
  console.log('');
}
const total = findings.critical.length + findings.major.length + findings.minor.length;
console.log(`${line}\nÖZET: ${findings.critical.length} kritik, ${findings.major.length} önemli, ${findings.minor.length} ikincil\n${line}`);

if (process.argv.includes('--strict') && findings.critical.length) process.exit(1);
