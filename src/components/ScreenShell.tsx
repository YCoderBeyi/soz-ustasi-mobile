import type { CSSProperties, ReactNode } from 'react';
import { assetPath } from '../assets/gameAssets';

interface ScreenShellProps {
  children: ReactNode;
  background?: string;
  className?: string;
  style?: CSSProperties;
}

export function ScreenShell({
  children,
  background,
  className = '',
  style,
}: ScreenShellProps) {
  return (
    <div
      className={`screen ${className}`}
      style={{
        ...style,
        ...(background ? {
          backgroundImage: `url(${assetPath(background)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}),
      }}
    >
      {background && <div className="screenOverlay" />}
      <div className="screenContent">
        {children}
      </div>
    </div>
  );
}
