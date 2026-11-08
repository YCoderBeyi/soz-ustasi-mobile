import { useCallback, useEffect, useRef, useState } from 'react';
import {
  nextIdleSeconds,
  shouldOfferStallAssist,
  STALL_OFFER_VISIBLE_SECONDS,
} from '../game/stallAssist';

interface Options {
  /** The player could be playing right now (game screen, no modal, level not finished). */
  playing: boolean;
  /** The level is finished or its seal is open: never offer. */
  finished: boolean;
  /** Any number that changes whenever the player makes progress (words found). */
  progress: number;
  /** Changes when a new level starts; resets the per-level budget. */
  levelKey: string;
}

/**
 * Tracks idle time on a level and raises a one-shot, self-expiring offer when the player seems stuck.
 * The offer is a pure signal: what to give (a free letter) is decided by the caller.
 */
export function useStallAssist({ playing, finished, progress, levelKey }: Options) {
  const [offered, setOffered] = useState(false);
  const idleRef = useRef(0);
  const visibleForRef = useRef(0);
  const alreadyOfferedRef = useRef(false);
  const lastProgressRef = useRef(progress);
  const lastLevelKeyRef = useRef(levelKey);
  const latest = useRef({ playing, finished, progress, levelKey });
  latest.current = { playing, finished, progress, levelKey };

  const consume = useCallback(() => {
    alreadyOfferedRef.current = true;
    visibleForRef.current = 0;
    setOffered(false);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const now = latest.current;
      if (now.levelKey !== lastLevelKeyRef.current) {
        lastLevelKeyRef.current = now.levelKey;
        lastProgressRef.current = now.progress;
        idleRef.current = 0;
        visibleForRef.current = 0;
        alreadyOfferedRef.current = false;
        setOffered(false);
        return;
      }
      const progressed = now.progress !== lastProgressRef.current;
      lastProgressRef.current = now.progress;
      const visible = typeof document === 'undefined' || !document.hidden;
      idleRef.current = nextIdleSeconds(idleRef.current, { playing: now.playing && visible, progressed });

      if (progressed) {
        // Real progress while the offer is up means the player no longer needs it.
        visibleForRef.current = 0;
        setOffered(false);
        return;
      }
      if (shouldOfferStallAssist({ idleSeconds: idleRef.current, alreadyOffered: alreadyOfferedRef.current, finished: now.finished })) {
        alreadyOfferedRef.current = true;
        visibleForRef.current = 1;
        setOffered(true);
        return;
      }
      if (visibleForRef.current > 0) {
        visibleForRef.current += 1;
        if (visibleForRef.current > STALL_OFFER_VISIBLE_SECONDS || now.finished) {
          visibleForRef.current = 0;
          setOffered(false);
        }
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return { offered, consume };
}
