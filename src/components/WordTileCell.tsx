import { useEffect, useRef, useState, type CSSProperties } from 'react';

export const TILE_PRESS_MS = 200;
export const TILE_HINT_PRESS_MS = 140;
export const TILE_PRESS_STAGGER_MS = 48;
export const TILE_PRESS_STAGGER_CAP_MS = 144;

/** @deprecated Use TILE_PRESS_MS */
export const TILE_CRACK_MS = TILE_PRESS_MS;
/** @deprecated Use TILE_PRESS_STAGGER_MS */
export const TILE_CRACK_STAGGER_MS = TILE_PRESS_STAGGER_MS;

export type TilePressTone = 'seal' | 'mist';

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
  pressTone = 'seal',
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
  /** calmMode || reduceMotion — baskı / aktif nefes kapalı. */
  calm?: boolean;
  /** Kelime boyunca harf sırası stagger (ms), cap 144. */
  pressDelayMs?: number;
  /** seal = ana kelime altın; mist = ipucu/keşif soğuk ton. */
  pressTone?: TilePressTone;
  crackDelayMs?: number;
  number?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const delayInput = crackDelayMs ?? pressDelayMs;
  const prevFilled = useRef(filled);
  const delayLatchRef = useRef(0);
  const toneLatchRef = useRef<TilePressTone>(pressTone);
  const [pressing, setPressing] = useState(false);
  const [latchedDelay, setLatchedDelay] = useState(0);
  const [latchedTone, setLatchedTone] = useState<TilePressTone>('seal');

  useEffect(() => {
    delayLatchRef.current = clampPressDelay(delayInput);
  }, [delayInput]);

  useEffect(() => {
    toneLatchRef.current = pressTone;
  }, [pressTone]);

  useEffect(() => {
    const wasFilled = prevFilled.current;
    prevFilled.current = filled;
    if (calm) {
      setPressing(false);
      return undefined;
    }
    if (empty || !filled || wasFilled) return undefined;

    const delay = delayLatchRef.current;
    const tone = toneLatchRef.current;
    const duration = tone === 'mist' ? TILE_HINT_PRESS_MS : TILE_PRESS_MS;
    setLatchedDelay(delay);
    setLatchedTone(tone);
    setPressing(true);
    const endId = window.setTimeout(() => setPressing(false), duration + delay);
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
      data-press-tone={pressing || filled ? latchedTone : undefined}
      data-crack-delay={latchedDelay || undefined}
    >
      {number ? <small className="wordTileNumber">{number}</small> : null}
      {letter ? <span className="wordTileChar">{letter}</span> : null}
      {pressing ? (
        <span
          className="tilePress"
          data-testid="tile-press"
          data-feedback-fx={latchedTone === 'mist' ? 'tile-mist-press' : 'tile-seal-press'}
          data-tone={latchedTone}
          aria-hidden="true"
        />
      ) : null}
    </span>
  );
}
