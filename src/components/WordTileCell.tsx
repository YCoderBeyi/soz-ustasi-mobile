import type { CSSProperties } from 'react';

export function WordTileCell({
  letter = '',
  filled = false,
  active = false,
  empty = false,
  number,
  className = '',
  style,
}: {
  letter?: string;
  filled?: boolean;
  active?: boolean;
  empty?: boolean;
  number?: number;
  className?: string;
  style?: CSSProperties;
}) {
  if (empty) {
    return <span className={`wordTileCell wordTileCellEmpty ${className}`} style={style} aria-hidden="true" />;
  }

  return (
    <span className={`wordTileCell ${filled ? 'wordTileCellFilled' : ''} ${active ? 'wordTileCellActive' : ''} ${className}`} style={style}>
      {number ? <small className="wordTileNumber">{number}</small> : null}
      {letter ? <span className="wordTileChar">{letter}</span> : null}
    </span>
  );
}
