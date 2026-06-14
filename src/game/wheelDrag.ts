/** Harf çemberi yarıçapı — viewBox yüzdesi (50 merkez). */
export function wheelRadius(letterCount: number): number {
  if (letterCount <= 4) return 36;
  if (letterCount <= 6) return 34;
  return 30;
}

export function letterAngle(index: number, letterCount: number): number {
  return (index / letterCount) * Math.PI * 2 - Math.PI / 2;
}

export function letterCenterPercent(index: number, letterCount: number): { x: number; y: number } {
  const radius = wheelRadius(letterCount);
  const angle = letterAngle(index, letterCount);
  return {
    x: 50 + radius * Math.cos(angle),
    y: 50 + radius * Math.sin(angle),
  };
}

export function letterCenterPx(
  ringRect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
  index: number,
  letterCount: number,
): { x: number; y: number } {
  const pct = letterCenterPercent(index, letterCount);
  return {
    x: ringRect.left + (ringRect.width * pct.x) / 100,
    y: ringRect.top + (ringRect.height * pct.y) / 100,
  };
}

const HIT_SCALE = 0.38;
const STICKY_SCALE = 0.5;

export function wheelHitRadius(tilePx: number): number {
  return tilePx * HIT_SCALE;
}

export function wheelStickyRadius(tilePx: number): number {
  return tilePx * STICKY_SCALE;
}

/**
 * Geometrik merkez + dar hitbox + yapışkan son harf.
 * DOM rect yerine ring geometrisi kullanır — trail ile uyumlu.
 */
export function findWheelLetterAtPoint(
  clientX: number,
  clientY: number,
  ringRect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
  letterCount: number,
  tilePx: number,
  lastIndex: number | null,
): number | null {
  if (letterCount <= 0 || tilePx <= 0) return null;

  const hitR = wheelHitRadius(tilePx);
  const stickyR = wheelStickyRadius(tilePx);

  if (lastIndex !== null && lastIndex >= 0 && lastIndex < letterCount) {
    const last = letterCenterPx(ringRect, lastIndex, letterCount);
    if (Math.hypot(clientX - last.x, clientY - last.y) <= stickyR) {
      return lastIndex;
    }
  }

  let bestIndex: number | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < letterCount; i++) {
    if (i === lastIndex) continue;
    const center = letterCenterPx(ringRect, i, letterCount);
    const distance = Math.hypot(clientX - center.x, clientY - center.y);
    if (distance <= hitR && distance < bestDistance) {
      bestIndex = i;
      bestDistance = distance;
    }
  }

  return bestIndex;
}
