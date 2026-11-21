import { useEffect, useRef, useState, type CSSProperties } from 'react';

export const TILE_PRESS_MS = 200;
export const TILE_PRESS_STAGGER_MS = 48;
export const TILE_PRESS_STAGGER_CAP_MS = 144;

/** @deprecated Use TILE_PRESS_STAGGER_MS */
export const TILE_CRACK_MS = TILE_PRESS_MS;
/** @deprecated Use TILE_PRESS_STAGGER_MS */
export const TILE_CRACK_STAGGER_MS = TILE_PRESS_STAGGER_MS;

function clampPressDelay(ms: number): number {
  return Math.min(Math.max(0, ms), TILE_PRESS_STAGGER_CAP_MS);
}

export function WordTileCell({
  letter = '',
  filled = false,
  active = false,
  empty = false,
  calm = false,
  pressDelayMs = 0,
  /** @deprecated alias — pressDelayMs */
  crackDelayMs,
  number,
  className = '',
  style,
}: {
  letter?: string;
  filled?: boolean;
  active?: boolean;
  empty?: boolean;
  /** calmMode || reduceMotion — baskı overlay kapalı. */
  calm?: boolean;
  /** Kelime boyunca harf sırası stagger (ms), cap 144. */
  pressDelayMs?: number;
  crackDelayMs?: number;
  number?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const delayInput = crackDelayMs ?? pressDelayMs;
  const prevFilled = useRef(filled);
  const delayLatchRef = useRef(0);
  const [pressing, setPressing] = useState(false);
  const [latchedDelay, setLatchedDelay] = useState(0);

  // Son bilinen delay'i tut; rising-edge'de latch et (re-render yarışını kes).
  useEffect(() => {
    delayLatchRef.current = clampPressDelay(delayInput);
  }, [delayInput]);

  useEffect(() => {
    const wasFilled = prevFilled.current;
    prevFilled.current = filled;
    if (calm) {
      setPressing(false);
      return undefined;
    }
    if (empty || !filled || wasFilled) return undefined;

    const delay = delayLatchRef.current;
    setLatchedDelay(delay);
    setPressing(true);
    const endId = window.setTimeout(() => setPressing(false), TILE_PRESS_MS + delay);
    return () => {
      window.clearTimeout(endId);
      setPressing(false);
    };
  }, [filled, calm, empty]);

  if (empty) {
    return <span className={`wordTileCell wordTileCellEmpty ${className}`} style={style} aria-hidden="true" />;
  }

  const mergedStyle = {
    ...style,
    ...(filled || pressing ? { '--press-delay': `${latchedDelay}ms` } as CSSProperties : null),
  };

  return (
    <span
      className={`wordTileCell ${filled ? 'wordTileCellFilled' : ''} ${active ? 'wordTileCellActive' : ''} ${pressing ? 'wordTileCellPressing' : ''} ${className}`}
      style={mergedStyle}
      data-press-delay={latchedDelay || undefined}
      data-crack-delay={latchedDelay || undefined}
    >
      {number ? <small className="wordTileNumber">{number}</small> : null}
      {letter ? <span className="wordTileChar">{letter}</span> : null}
      {pressing ? (
        <span
          className="tilePress"
          data-testid="tile-press"
          data-feedback-fx="tile-seal-press"
          aria-hidden="true"
        />
      ) : null}
    </span>
  );
}
