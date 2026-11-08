import { describe, expect, it } from 'vitest';
import { applyApprovedWord, applyWrongWord, comboProgress, INITIAL_SCORE_STATE, multiplierFor, wordPoints } from './score';

describe('score engine', () => {
  it('scores by length and kind', () => {
    expect(wordPoints('KARE', 'main', 0)).toBe(40);
    expect(wordPoints('KARE', 'hidden', 0)).toBe(45);
    expect(wordPoints('KARE', 'bonus', 0)).toBe(43);
  });

  it('raises the multiplier at combo 3, 6 and 10', () => {
    expect([0, 2, 3, 5, 6, 9, 10, 40].map((c) => multiplierFor(c))).toEqual([1, 1, 1.5, 1.5, 2, 2, 3, 3]);
  });

  it('boosts the word after a tier is reached, not the one that reaches it', () => {
    let s = INITIAL_SCORE_STATE;
    for (let i = 0; i < 3; i += 1) s = applyApprovedWord(s, 'KARE', 'main');
    expect(s.score).toBe(120);
    s = applyApprovedWord(s, 'KARE', 'main');
    expect(s.score).toBe(180);
  });

  it('drops one tier on a wrong word and never reduces the score', () => {
    expect(applyWrongWord({ combo: 12, score: 500 })).toEqual({ combo: 6, score: 500 });
    expect(applyWrongWord({ combo: 7, score: 500 })).toEqual({ combo: 3, score: 500 });
    expect(applyWrongWord({ combo: 4, score: 500 })).toEqual({ combo: 0, score: 500 });
    expect(applyWrongWord({ combo: 1, score: 500 })).toEqual({ combo: 0, score: 500 });
  });

  it('calm mode keeps the multiplier at 1', () => {
    expect(wordPoints('KARE', 'main', 20, true)).toBe(40);
    expect(applyApprovedWord({ combo: 20, score: 0 }, 'KARE', 'main', true).score).toBe(40);
  });
});

describe('comboProgress', () => {
  it('fills toward the next tier and stays full at the top', () => {
    expect(comboProgress(0)).toBe(0);
    expect(comboProgress(3)).toBe(0);
    expect(comboProgress(4.5)).toBeCloseTo(0.5);
    expect(comboProgress(10)).toBe(1);
    expect(comboProgress(99)).toBe(1);
  });
});
