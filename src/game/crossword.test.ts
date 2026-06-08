import { describe, it, expect } from 'vitest';
import { buildCrosswordLayout } from './crossword';
import type { WordEntry } from '../types';

function word(text: string): WordEntry {
  return { word: text, meaning: text };
}

describe('buildCrosswordLayout', () => {
  it('returns null for fewer than 2 words', () => {
    expect(buildCrosswordLayout([word('A')])).toBeNull();
    expect(buildCrosswordLayout([])).toBeNull();
  });

  it('places first word across at origin', () => {
    const result = buildCrosswordLayout([word('ABC'), word('ADC')]);
    expect(result).not.toBeNull();
    expect(result!.placements[0].direction).toBe('across');
    expect(result!.placements[0].row).toBe(0);
    expect(result!.placements[0].col).toBe(0);
  });

  it('places second word crossing the first', () => {
    const result = buildCrosswordLayout([word('AB'), word('CB')]);
    expect(result).not.toBeNull();
    expect(result!.placements.length).toBe(2);
  });

  it('returns null for words that cannot cross', () => {
    const result = buildCrosswordLayout([word('AB'), word('CD')]);
    expect(result).toBeNull();
  });

  it('normalizes coordinates to be 0-based', () => {
    const result = buildCrosswordLayout([word('ABC'), word('DC')]);
    expect(result).not.toBeNull();
    expect(result!.rowCount).toBeGreaterThan(0);
    expect(result!.colCount).toBeGreaterThan(0);
    result!.cells.forEach((cell) => {
      expect(cell.row).toBeGreaterThanOrEqual(0);
      expect(cell.col).toBeGreaterThanOrEqual(0);
    });
  });

  it('tracks which words occupy each cell', () => {
    const result = buildCrosswordLayout([word('AB'), word('AC')]);
    expect(result).not.toBeNull();
    const crossingCell = result!.cells.find((cell) => cell.words.length > 1);
    expect(crossingCell).toBeDefined();
  });

  it('handles four-letter words', () => {
    const result = buildCrosswordLayout([word('KALE'), word('KARA')]);
    expect(result).not.toBeNull();
    expect(result!.placements.length).toBe(2);
  });
});
