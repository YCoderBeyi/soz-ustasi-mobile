import { describe, it, expect } from 'vitest';
import {
  findWheelLetterAtPoint,
  letterCenterPx,
  letterCenterPercent,
  wheelHitRadius,
  wheelRadius,
} from './wheelDrag';

const ring = { left: 100, top: 200, width: 200, height: 200 };

describe('wheelDrag', () => {
  it('wheelRadius küçük harf sayısında daha geniş', () => {
    expect(wheelRadius(4)).toBeGreaterThan(wheelRadius(7));
  });

  it('letterCenterPercent merkezde değil', () => {
    const c = letterCenterPercent(0, 4);
    expect(c.x).toBeCloseTo(50, 0);
    expect(c.y).toBeLessThan(50);
  });

  it('dar hitbox — komşu harfe atlamaz', () => {
    const tile = 56;
    const count = 5;
    const idx0 = letterCenterPx(ring, 0, count);
    const idx1 = letterCenterPx(ring, 1, count);
    const betweenX = idx0.x + (idx1.x - idx0.x) * 0.35;
    const betweenY = idx0.y + (idx1.y - idx0.y) * 0.35;

    expect(findWheelLetterAtPoint(idx0.x, idx0.y, ring, count, tile, null)).toBe(0);
    expect(findWheelLetterAtPoint(betweenX, betweenY, ring, count, tile, 0)).toBe(0);
    expect(findWheelLetterAtPoint(betweenX, betweenY, ring, count, tile, null)).not.toBe(1);
    expect(wheelHitRadius(tile)).toBeLessThan(tile * 0.5);
  });

  it('yapışkan son harf — sınırda kalır', () => {
    const tile = 56;
    const count = 4;
    const center = letterCenterPx(ring, 1, count);
    const edge = center.x + wheelHitRadius(tile) * 0.9;
    expect(findWheelLetterAtPoint(edge, center.y, ring, count, tile, 1)).toBe(1);
  });

  it('boş alanda null döner', () => {
    expect(findWheelLetterAtPoint(ring.left + 100, ring.top + 100, ring, 5, 56, null)).toBeNull();
  });
});
