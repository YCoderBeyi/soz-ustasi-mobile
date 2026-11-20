/** Mühür açılış kutlaması — confetti yalnızca sealOpen + tam FX modunda. */
export const SEAL_CONFETTI_COUNT = 28;

export function shouldShowSealConfetti(reduceMotion: boolean, calmMode: boolean): boolean {
  return !reduceMotion && !calmMode;
}