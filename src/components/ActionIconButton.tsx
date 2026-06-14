import { V2Icon, type V2IconName } from './Icon';

interface ActionIconButtonProps {
  icon: V2IconName;
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ActionIconButton({
  icon,
  onClick,
  ariaLabel,
  className = '',
  disabled = false,
  size = 'md',
}: ActionIconButtonProps) {
  const sizeClass = {
    sm: 'uiV1IconSm',
    md: 'uiV1IconMd',
    lg: 'uiV1IconLg',
  }[size];

  return (
    <button
      type="button"
      className={`svgBtn ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <V2Icon name={icon} className="btnIconSvg" />
    </button>
  );
}
