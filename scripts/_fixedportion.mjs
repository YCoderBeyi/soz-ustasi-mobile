import fs from 'node:fs';
import vm from 'node:vm';
function loadGeneratedLevels() {
  const mods = [
    ['src/data/levels46to50.ts', 'levels46to50'],['src/data/levels51to55.ts', 'levels51to55'],
    ['src/data/levels56to60.ts', 'levels56to60'],['src/data/levels61to65.ts', 'levels61to65'],
    ['src/data/levels66to70.ts', 'levels66to70'],['src/data/levels71to75.ts', 'levels71to75'],
  ];
  const authoredSources = mods.map(([file, exportName]) => (
    fs.readFileSync(file, 'utf8').replace(/^import .*?;\s*/gm, '')
      .replace(new RegExp(`export const ${exportName}: LevelData\\[\\] =`), `const ${exportName} =`)
  )).join('\n');
  let levelsSource = fs.readFileSync('src/data/levels.ts', 'utf8').replace(/^import .*?;\s*/gm, '')
    .replace(/const baseLevels: LevelData\[\] =/, 'const baseLevels =')
    .replace(/export const levels: LevelData\[\] =[\s\S]*$/, '');
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${authoredSources}\n${levelsSource}\nresult = [...baseLevels, ...authoredMasteryLevels];`, context);
  return context.result;
}
const norm = (w) => w.trim().toLocaleUpperCase('tr-TR').normalize('NFD').replace(/[̀-ͯ]/g, '').replaceAll('İ', 'I');
const levels = loadGeneratedLevels();
// fixed portion per level (no difficulty term)
function fixed(l) {
  const al = l.mainWords.reduce((s, w) => s + norm(w.word).length, 0) / l.mainWords.length;
  return l.letters.length * 1.2 + l.mainWords.length * 1.5 + al * 1.8;
}
for (let c = 0; c < 5; c++) {
  const ls = levels.slice(c * 15, c * 15 + 15);
  const f = ls.reduce((s, l) => s + fixed(l), 0) / ls.length;
  console.log(`chapter ${c + 1}: fixedAvg=${f.toFixed(3)}  (dscore = fixedAvg + 2*chapAvgDiff)`);
}
