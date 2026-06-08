import type { ReactNode } from 'react';
import { V2Icon, type V2IconName } from './Icon';

const FRAME_MAP = {
  gold: 'buttonGold',
  green: 'buttonGreen',
  blue: 'buttonBlue',
} as const satisfies Record<string, V2IconName>;

export type Button3DVariant = keyof typeof FRAME_MAP;

export function Button3D({
  variant = 'gold',
  children,
  onClick,
  className = '',
  fullWidth = true,
  disabled,
  type = 'button',
}: {
  variant?: Button3DVariant;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      className={`btn3d ${fullWidth ? 'btn3dFull' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <V2Icon name={FRAME_MAP[variant]} className="btn3dBg" />
      <span className="btn3dLabel">{children}</span>
    </button>
  );
}

export function ShopBuyButton3D({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button type="button" className={`shopBuy3d ${className}`} onClick={onClick}>
      <V2Icon name="shopBuy" className="shopBuy3dBg" />
      <span className="shopBuy3dLabel">{children}</span>
    </button>
  );
}
