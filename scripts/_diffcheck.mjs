import fs from 'node:fs';
import vm from 'node:vm';

function loadGeneratedLevels() {
  const mods = [
    ['src/data/levels46to50.ts', 'levels46to50'],
    ['src/data/levels51to55.ts', 'levels51to55'],
    ['src/data/levels56to60.ts', 'levels56to60'],
    ['src/data/levels61to65.ts', 'levels61to65'],
    ['src/data/levels66to70.ts', 'levels66to70'],
    ['src/data/levels71to75.ts', 'levels71to75'],
  ];
  const authoredSources = mods.map(([file, exportName]) => (
    fs.readFileSync(file, 'utf8')
      .replace(/^import .*?;\s*/gm, '')
      .replace(new RegExp(`export const ${exportName}: LevelData\\[\\] =`), `const ${exportName} =`)
  )).join('\n');
  let levelsSource = fs.readFileSync('src/data/levels.ts', 'utf8')
    .replace(/^import .*?;\s*/gm, '')
    .replace(/const baseLevels: LevelData\[\] =/, 'const baseLevels =')
    .replace(/export const levels: LevelData\[\] =[\s\S]*$/, '');
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${authoredSources}\n${levelsSource}\nresult = [...baseLevels, ...authoredMasteryLevels];`, context);
  return context.result;
}

const norm = (w) => w.trim().toLocaleUpperCase('tr-TR').normalize('NFD').replace(/[̀-ͯ]/g, '').replaceAll('İ', 'I');
const levels = loadGeneratedLevels();
const avgDiff = (from, to) => {
  const ws = levels.filter((l) => l.levelId >= from && l.levelId <= to).flatMap((l) => l.mainWords);
  return ws.reduce((s, w) => s + (w.difficulty ?? 1), 0) / ws.length;
};
function dscore(l) {
  const ad = l.mainWords.reduce((s, w) => s + (w.difficulty ?? 1), 0) / l.mainWords.length;
  const al = l.mainWords.reduce((s, w) => s + norm(w.word).length, 0) / l.mainWords.length;
  return l.letters.length * 1.2 + l.mainWords.length * 1.5 + al * 1.8 + ad * 2;
}
const chap = Array.from({ length: 5 }, (_, c) => {
  const ls = levels.slice(c * 15, c * 15 + 15);
  return ls.reduce((s, l) => s + dscore(l), 0) / ls.length;
});
console.log('avg(L1-5)=', avgDiff(1, 5).toFixed(3), '(must <=2)');
console.log('avg(L71-75)=', avgDiff(71, 75).toFixed(3), '(must >=3)');
console.log('chapters dscore:', chap.map((c) => c.toFixed(2)).join(', '));
console.log('last>first:', chap.at(-1) > chap[0]);
for (let i = 1; i < chap.length; i++) {
  console.log(`  chap[${i}]+1>=chap[${i - 1}]:`, (chap[i] + 1 >= chap[i - 1]).toString(), `(${chap[i].toFixed(2)}+1 vs ${chap[i - 1].toFixed(2)})`);
}
for (let c = 0; c < 5; c++) {
  const all = levels.slice(c * 15, c * 15 + 15).flatMap((l) => l.mainWords);
  const ad = all.reduce((s, w) => s + (w.difficulty ?? 1), 0) / all.length;
  console.log(`chapter ${c + 1} avgDiff=${ad.toFixed(3)}`);
}
