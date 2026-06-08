import type { CSSProperties } from 'react';
import { V2Icon } from './Icon';

export function WordTileCell({
  letter = '',
  filled = false,
  active = false,
  empty = false,
  className = '',
  style,
}: {
  letter?: string;
  filled?: boolean;
  active?: boolean;
  empty?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  if (empty) {
    return <span className={`wordTileCell wordTileCellEmpty ${className}`} style={style} aria-hidden="true" />;
  }

  return (
    <span className={`wordTileCell ${filled ? 'wordTileCellFilled' : ''} ${active ? 'wordTileCellActive' : ''} ${className}`} style={style}>
      <V2Icon name={filled ? 'wordTileFilled' : 'wordTileEmpty'} className="wordTileBg" />
      {letter ? <span className="wordTileChar">{letter}</span> : null}
    </span>
  );
}
