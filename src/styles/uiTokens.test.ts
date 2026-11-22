import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';

// Guards the shared control scale (src/styles/base.css tokens): no text below the floor, no control re-inventing its size.
const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
const cssFiles = walk('src').filter((file) => file.endsWith('.css'));

// Deliberate micro text: clue-number digits, star counters, decorative pseudo-elements.
const MICRO_ALLOWED = /wordTileNumber|level-node__stars|::before|::after/;
const CONTROL = /\.(btn3d\S*|ls-play|ls-close|pauseAction\S*|pausePrivacy|profileAction|settingsItem|shopBuy|tabPill3d|map-daily-card|wheelCtrlBtn|gameSealAction|bottom-nav|bottomNav)\b/;

function declarations(prop: RegExp) {
  const found: { file: string; selector: string; value: string }[] = [];
  for (const file of cssFiles) {
    postcss.parse(readFileSync(file, 'utf8')).walkDecls(prop, (decl) => {
      const parent = decl.parent as postcss.Rule | undefined;
      found.push({ file: file.replace(/\\/g, '/'), selector: String(parent?.selector ?? ''), value: decl.value.trim() });
    });
  }
  return found;
}

describe('ui control scale', () => {
  it('keeps every font-size at or above the 11px micro floor', () => {
    const tooSmall = declarations(/^font-size$/)
      .filter((d) => /^\d+(\.\d+)?px$/.test(d.value) && parseFloat(d.value) < 11)
      .filter((d) => !MICRO_ALLOWED.test(d.selector));
    expect(tooSmall.map((d) => `${d.file} ${d.selector} ${d.value}`)).toEqual([]);
  });

  it('keeps text on controls at or above the 12px control floor', () => {
    const tooSmall = declarations(/^font-size$/)
      .filter((d) => CONTROL.test(d.selector) && !MICRO_ALLOWED.test(d.selector))
      .filter((d) => /^\d+(\.\d+)?px$/.test(d.value) && parseFloat(d.value) < 12);
    expect(tooSmall.map((d) => `${d.file} ${d.selector} ${d.value}`)).toEqual([]);
  });

  it('does not hard-code a pixel height on a control family root', () => {
    const rootOf = /^\.(btn3d|ls-play|pauseAction|profileAction|settingsItem|shopBuy|wheelCtrlBtn)$/;
    const hardCoded = declarations(/^(height|min-height)$/)
      .filter((d) => d.selector.split(',').some((s) => rootOf.test(s.trim())))
      .filter((d) => /^\d+px$/.test(d.value));
    expect(hardCoded.map((d) => `${d.file} ${d.selector} ${d.value}`)).toEqual([]);
  });

  it('defines every control token exactly once, in base.css', () => {
    const tokens = ['--ui-row-h', '--ui-radius-ctl', '--ui-text-min', '--ui-text-micro', '--ui-touch-floor'];
    for (const token of tokens) {
      const defs = cssFiles.filter((file) => new RegExp(`${token}\\s*:`).test(readFileSync(file, 'utf8')));
      expect(defs.map((f) => f.replace(/\\/g, '/')), token).toEqual(['src/styles/base.css']);
    }
  });
});
