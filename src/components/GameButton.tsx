import type { CSSProperties } from 'react';
import { Button3D, type Button3DVariant } from './Button3D';
import { V2Icon, type V2IconName } from './Icon';

interface GameButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'gold' | 'blue' | 'ghost';
  icon?: V2IconName;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  loading?: boolean;
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
  loading = false,
  ariaLabel,
}: GameButtonProps) {
  if (variant === 'ghost') {
    return (
      <button
        className={`ghostBtn ${className}`}
        onClick={onClick}
        disabled={disabled || loading}
        aria-label={ariaLabel ?? label}
        style={style}
      >
        {icon && <V2Icon name={icon} className="uiV1IconSm" />}
        {label}
      </button>
    );
  }

  const v3d = variant as Button3DVariant;

  return (
    <Button3D
      variant={v3d}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className={className}
    >
      {icon && <V2Icon name={icon} className="uiV1IconSm" />}
      {label}
    </Button3D>
  );
}
