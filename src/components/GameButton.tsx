import type { CSSProperties } from 'react';
import { V2Icon, type V2IconName } from './Icon';

interface GameButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'gold' | 'blue' | 'ghost';
  icon?: V2IconName;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  ariaLabel?: string;
}

export function GameButton({
  label,
  onClick,
  variant = 'gold',
  icon,
  className = '',
  style,
  disabled = false,
  ariaLabel,
}: GameButtonProps) {
  const bgName: Record<string, V2IconName | null> = {
    gold: 'buttonGold',
    blue: 'buttonBlue',
    ghost: null,
  };

  return (
    <button
      className={`btn3d btn3dFull ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      style={style}
    >
      {bgName[variant] && <V2Icon name={bgName[variant]!} className="btn3dBg" />}
      <span className="btn3dLabel">
        {icon && <V2Icon name={icon} />}
        {label}
      </span>
    </button>
  );
}
