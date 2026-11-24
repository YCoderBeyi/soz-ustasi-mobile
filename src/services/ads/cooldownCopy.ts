/** Player-facing copy for the shared fullscreen ad cooldown (C+). */
export function fullscreenCooldownMessage(remainingSeconds: number): string {
  const seconds = Math.max(1, Math.ceil(remainingSeconds));
  return `Tam ekran reklam için ${seconds} sn bekle. Reklamsız oynayabilirsin.`;
}
