import { beforeEach, describe, expect, it } from 'vitest';
import { getDailyChallenge, toLocalDateStr } from './dailyChallenge';

describe('getDailyChallenge', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('selects the challenge only from eligible level ids', () => {
    const challenge = getDailyChallenge([1, 2, 3]);

    expect([1, 2, 3]).toContain(challenge.levelId);
  });

  it('replaces a saved challenge that is no longer eligible', () => {
    localStorage.setItem('soz-daily-v1', JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      levelId: 45,
      completed: false,
      reward: 999,
    }));

    const challenge = getDailyChallenge([1, 2]);

    expect([1, 2]).toContain(challenge.levelId);
    expect(challenge.completed).toBe(false);
  });

  it('formats the date from local calendar parts, not UTC', () => {
    // 01:30 local on June 20; toISOString() can roll to June 19 in positive
    // UTC offsets — toLocalDateStr must stay on the local day.
    expect(toLocalDateStr(new Date(2026, 5, 20, 1, 30))).toBe('2026-06-20');
    expect(toLocalDateStr(new Date(2026, 0, 5, 23, 0))).toBe('2026-01-05');
  });

  it('stamps the returned challenge with the local date', () => {
    const challenge = getDailyChallenge([1, 2, 3]);
    expect(challenge.date).toBe(toLocalDateStr(new Date()));
  });
});
