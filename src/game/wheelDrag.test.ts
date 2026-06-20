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
  it('opens the radius up as letters grow so tiles do not crowd', () => {
    // Harf çoğaldıkça yarıçap küçülmemeli (eski hata); en az korunmalı/açılmalı.
    expect(wheelRadius(8)).toBeGreaterThanOrEqual(wheelRadius(4));
    expect(wheelRadius(8)).toBeGreaterThanOrEqual(wheelRadius(6));
  });

  it('keeps adjacent letter hitboxes from overlapping for every letter count', () => {
    // Gerçek oran: taş ≈ ring genişliğinin %20.6'sı (14cqw / 68cqw).
    const ringWidth = 248;
    const tile = ringWidth * 0.206;
    const hitDiameter = wheelHitRadius(tile) * 2;
    for (let n = 3; n <= 8; n++) {
      const a = letterCenterPx({ left: 0, top: 0, width: ringWidth, height: ringWidth }, 0, n);
      const b = letterCenterPx({ left: 0, top: 0, width: ringWidth, height: ringWidth }, 1, n);
      const adjacent = Math.hypot(a.x - b.x, a.y - b.y);
      expect(adjacent, `n=${n}: komşu hitbox çakışıyor`).toBeGreaterThanOrEqual(hitDiameter);
    }
  });

  it('keeps tiles inside the ring at the widest radius', () => {
    // yarıçap + taş yarı-genişliği (%10.3) <= %50 (ring kenarı)
    const tileHalfPct = 20.6 / 2;
    for (let n = 3; n <= 8; n++) {
      expect(wheelRadius(n) + tileHalfPct).toBeLessThanOrEqual(50);
    }
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
