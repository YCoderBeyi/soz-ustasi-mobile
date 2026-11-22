import type { ReactNode } from 'react';
import './PremiumPrimaryButton.css';

const BUTTON_ART = {
  primary: '/assets/ui/start/kit/btn-primary.webp',
  secondary: '/assets/ui/start/kit/btn-secondary.webp',
};

export function PremiumPrimaryButton({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'large',
  type = 'button',
  'aria-busy': ariaBusy,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'large' | 'compact';
  type?: 'button' | 'submit';
  'aria-busy'?: boolean;
}) {
  return (
    <button
      type={type}
      className={`premiumPrimaryButton premiumPrimaryButton--${variant} premiumPrimaryButton--${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-busy={ariaBusy}
    >
      <img src={BUTTON_ART[variant]} alt="" aria-hidden="true" />
      <span>{children}</span>
    </button>
  );
}
