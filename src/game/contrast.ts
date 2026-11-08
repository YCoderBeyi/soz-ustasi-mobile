// WCAG 2.x contrast helpers (pure) for checking text on skin colors.
function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function parseHex(hex: string): [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`Expected #rrggbb, got ${hex}`);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Blend `overlay` over `base` at `alpha` (0..1); returns #rrggbb. */
export function blendHex(base: string, overlay: string, alpha: number): string {
  const b = parseHex(base);
  const o = parseHex(overlay);
  const mix = b.map((v, i) => Math.round(v * (1 - alpha) + o[i] * alpha));
  return `#${mix.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
