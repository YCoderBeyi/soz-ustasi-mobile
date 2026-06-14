import { describe, expect, it } from 'vitest';
import {
  findWheelLetterAtPoint,
  letterCenterPercent,
  letterCenterPx,
  wheelHitRadius,
  wheelRadius,
} from './wheelDrag';

const ring = { left: 100, top: 200, width: 200, height: 200 };

describe('wheelDrag', () => {
  it('uses a wider radius for small letter sets', () => {
    expect(wheelRadius(4)).toBeGreaterThan(wheelRadius(7));
  });

  it('places letters away from the center', () => {
    const center = letterCenterPercent(0, 4);
    expect(center.x).toBeCloseTo(50, 0);
    expect(center.y).toBeLessThan(50);
  });

  it('captures a mobile touch slightly beyond half the tile radius', () => {
    const tile = 56;
    const center = letterCenterPx(ring, 0, 5);
    const touchX = center.x + tile * 0.52;

    expect(findWheelLetterAtPoint(center.x, center.y, ring, 5, tile, null)).toBe(0);
    expect(findWheelLetterAtPoint(touchX, center.y, ring, 5, tile, null)).toBe(0);
    expect(wheelHitRadius(tile)).toBeGreaterThan(tile * 0.5);
  });

  it('keeps the last letter sticky near its edge', () => {
    const tile = 56;
    const center = letterCenterPx(ring, 1, 4);
    const edge = center.x + wheelHitRadius(tile) * 0.9;
    expect(findWheelLetterAtPoint(edge, center.y, ring, 4, tile, 1)).toBe(1);
  });

  it('returns null in empty space', () => {
    expect(findWheelLetterAtPoint(ring.left + 100, ring.top + 100, ring, 5, 56, null)).toBeNull();
  });
});
