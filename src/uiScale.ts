/** Design frame — all display tokens derive from this width */
export const UI_FRAME_W = 390;
export const UI_SHELL_MAX = 430;
export const UI_FRAME_H = 844;

/** Native SVG export dimensions */
export const UI_NATIVE = {
  iconButton: 128,
  actionButton: { w: 250, h: 86 },
  wideButton: { w: 360, h: 86 },
  resourcePill: { w: 230, h: 72 },
  letterNode: 96,
  wordTile: 96,
  tabPill: { w: 180, h: 52 },
  shopBuy: { w: 120, h: 52 },
} as const;

/** CSS calc() helper for inline styles */
export function uiScaledPx(base: number, useVertical = false): string {
  const scale = useVertical ? 'var(--ui-scale-total)' : 'var(--ui-scale)';
  return `calc(${base}px * ${scale})`;
}

/** Container-query width helper (58% of shell) */
export function uiCqw(percent: number): string {
  return `${percent}cqw`;
}
