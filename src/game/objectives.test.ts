import { describe, it, expect } from 'vitest';
import { chooseBestMastery, getObjectiveLabels, getRunObjectives, toRunMastery } from './objectives';
import type { LevelData } from '../types';

function makeLevel(overrides?: Partial<LevelData>): LevelData {
  return {
    levelId: 1,
    themeId: 'eski-istanbul',
    sealId: 'balon',
    letters: ['B', 'A', 'L', 'O', 'N'],
    mainWords: [{ word: 'BALON', meaning: 'Havayla şişirilen lastik araç' }],
    hiddenWords: [],
    story: 'Bir balon hikayesi',
    reward: { baseCoin: 50, hiddenWordBonus: 25 },
    ...overrides,
  };
}

describe('getObjectiveLabels', () => {
  it('returns "Mührü aç" for complete', () => {
    const labels = getObjectiveLabels(makeLevel());
    expect(labels.complete).toBe('Mührü aç');
  });

  it('shows discovery objective as "tüm gizli kelimeleri bul" when hidden words exist', () => {
    const level = makeLevel({ hiddenWords: [{ word: 'BALON', meaning: 'Test' }] });
    expect(getObjectiveLabels(level).discovery).toBe('Tüm gizli kelimeleri bul');
  });

  it('shows discovery objective as "hata yapmadan tamamla" when no hidden words', () => {
    const level = makeLevel({ hiddenWords: [] });
    expect(getObjectiveLabels(level).discovery).toBe('Hata yapmadan tamamla');
  });

  it('returns "Tüm gizlileri ipucusuz bul" for noHint', () => {
    expect(getObjectiveLabels(makeLevel()).noHint).toBe('Tüm gizlileri ipucusuz bul');
  });
});

describe('getRunObjectives', () => {
  it('always includes complete', () => {
    const level = makeLevel();
    const result = getRunObjectives(level, 0, false, 0);
    expect(result).toContain('complete');
  });

  it('includes discovery when all hidden words are found', () => {
    const level = makeLevel({ hiddenWords: [{ word: 'GİZLİ', meaning: 'Saklı' }] });
    const result = getRunObjectives(level, 1, false, 0);
    expect(result).toContain('discovery');
  });

  it('includes discovery automatically when a level has no hidden words', () => {
    const level = makeLevel({ mainWords: [{ word: 'A', meaning: 'a' }, { word: 'B', meaning: 'b' }], hiddenWords: [] });
    const result = getRunObjectives(level, 0, false, 2);
    expect(result).toContain('discovery');
  });

  it('excludes discovery when not all hidden words found', () => {
    const level = makeLevel({ hiddenWords: [{ word: 'GİZLİ', meaning: 'Saklı' }, { word: 'SAKLI', meaning: 'Gizli' }] });
    const result = getRunObjectives(level, 1, false, 0);
    expect(result).not.toContain('discovery');
  });

  it('does not award noHint as a second star when hidden discoveries are missing', () => {
    const level = makeLevel({ hiddenWords: [{ word: 'BAL', meaning: 'Bal' }] });
    const result = getRunObjectives(level, 0, false, 0);
    expect(result).toEqual(['complete']);
  });

  it('excludes noHint when hint was used', () => {
    const level = makeLevel();
    const result = getRunObjectives(level, 0, true, 0);
    expect(result).not.toContain('noHint');
  });
});

describe('mastery snapshots', () => {
  it('creates ordered stars from a single run', () => {
    expect(toRunMastery(['complete', 'discovery', 'noHint'])).toEqual({
      stars: 3, objectives: ['complete', 'discovery', 'noHint'],
    });
  });

  it('keeps the better run without combining objectives across runs', () => {
    expect(chooseBestMastery(
      { stars: 2, objectives: ['complete', 'discovery'] },
      ['complete', 'noHint'],
    )).toEqual({
      stars: 2,
      objectives: ['complete', 'discovery'],
    });
  });

  it('withholds the no-hidden-word discovery star after a mistake', () => {
    const level = makeLevel({ hiddenWords: [] });
    expect(getRunObjectives(level, 0, false, 0, false)).toEqual(['complete']);
    expect(getRunObjectives(level, 0, false, 0, true)).toContain('discovery');
  });
});
