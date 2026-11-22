// Stall assist: when a player is stuck, offer one free letter instead of letting them give up.
// Pure rules only; timing lives in useStallAssist and the effect lives in SessionContext.

/** Seconds without a new word before the offer appears. */
export const STALL_ASSIST_SECONDS = 40;

/** The offer fades on its own so it never nags. */
export const STALL_OFFER_VISIBLE_SECONDS = 14;

export interface StallState {
  idleSeconds: number;
  /** Already offered (and used or dismissed) on this level. */
  alreadyOffered: boolean;
  /** Level finished or seal already open. */
  finished: boolean;
}

export function shouldOfferStallAssist({ idleSeconds, alreadyOffered, finished }: StallState): boolean {
  return !alreadyOffered && !finished && idleSeconds >= STALL_ASSIST_SECONDS;
}

/** Idle only grows while the player could actually be playing, and any progress resets it. */
export function nextIdleSeconds(current: number, input: { playing: boolean; progressed: boolean }): number {
  if (input.progressed) return 0;
  return input.playing ? current + 1 : current;
}
