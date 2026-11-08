import { describe, expect, it } from 'vitest';
import { collectionProgress } from './collectionMilestones';

describe('collectionProgress', () => {
  it('starts at zero with the first milestone ahead', () => {
    expect(collectionProgress(0)).toEqual({ count: 0, reached: 0, next: 10, ratio: 0 });
  });

  it('measures progress between milestones', () => {
    const p = collectionProgress(17);
    expect(p.reached).toBe(10);
    expect(p.next).toBe(25);
    expect(p.ratio).toBeCloseTo(7 / 15);
  });

  it('counts exactly reaching a milestone as reached', () => {
    expect(collectionProgress(25)).toMatchObject({ reached: 25, next: 50, ratio: 0 });
  });

  it('is complete past the last milestone and tolerates bad input', () => {
    expect(collectionProgress(900)).toMatchObject({ reached: 500, next: null, ratio: 1 });
    expect(collectionProgress(-3).count).toBe(0);
  });
});
