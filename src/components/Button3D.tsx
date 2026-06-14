import type { ReactNode } from 'react';
import { V2Icon, type V2IconName } from './Icon';

const FRAME_MAP: Record<string, V2IconName> = {
  gold: 'buttonGold',
  green: 'buttonGreen',
  blue: 'buttonBlue',
  red: 'buttonGreen', // Placeholder
  grey: 'buttonBlue', // Placeholder
};

export type Button3DVariant = 'gold' | 'green' | 'blue' | 'red' | 'grey';

export function Button3D({
  variant = 'gold',
  children,
  onClick,
  className = '',
  fullWidth = true,
  compact = false,
  disabled,
  loading,
  type = 'button',
}: {
  variant?: Button3DVariant;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
  compact?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
}) {
  const iconName = FRAME_MAP[variant] ?? 'buttonGold';
  const isGold = variant === 'gold';

  return (
    <button
      type={type}
      className={`btn3d btn3d-${variant} ${fullWidth ? 'btn3dFull' : ''} ${compact ? 'btn3dCompact' : ''} ${loading ? 'btn3dLoading' : ''} ${isGold ? 'btn3dShimmer' : ''} ${className}`}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
    >
      <V2Icon name={iconName} className="btn3dBg" />
      <div className="btn3dContent">
        {loading ? (
          <div className="btn3dLoader" />
        ) : (
          <span className="btn3dLabel">{children}</span>
        )}
      </div>
    </button>
  );
}

export function ShopBuyButton3D({
  children,
  onClick,
  className = '',
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button 
      type="button" 
      className={`shopBuy3d ${className}`} 
      onClick={onClick}
      disabled={disabled}
    >
      <V2Icon name="shopBuy" className="shopBuy3dBg" />
      <span className="shopBuy3dLabel">{children}</span>
    </button>
  );
}
