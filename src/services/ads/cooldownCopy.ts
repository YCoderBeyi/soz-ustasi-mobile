function cooldownSeconds(remainingSeconds: number): number {
  return Math.max(1, Math.ceil(remainingSeconds));
}

/** Player-facing copy for the shared fullscreen ad cooldown (C+). */
export function fullscreenCooldownMessage(remainingSeconds: number): string {
  return `Tam ekran reklam için ${cooldownSeconds(remainingSeconds)} sn bekle. Reklamsız oynayabilirsin.`;
}

/** Compact CTA label while fullscreen cooldown is active. */
export function fullscreenCooldownButtonLabel(remainingSeconds: number): string {
  return `${cooldownSeconds(remainingSeconds)} sn bekle`;
}
