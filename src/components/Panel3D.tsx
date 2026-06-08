import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import { V2Icon, type V2IconName } from './Icon';

const FRAME_MAP = {
  hero: 'mapHeroPanel',
  featured: 'mapFeaturedPanel',
  stat: 'mapStatChip',
  widget: 'mapWidgetPanel',
} as const satisfies Record<string, V2IconName>;

export type Panel3DVariant = keyof typeof FRAME_MAP;

export function Panel3D({
  variant,
  children,
  className = '',
  as: Tag = 'div',
  onClick,
  style,
  type,
  disabled,
  ...rest
}: {
  variant: Panel3DVariant;
  children: ReactNode;
  className?: string;
  as?: ElementType;
  onClick?: () => void;
  style?: CSSProperties;
  type?: 'button';
  disabled?: boolean;
} & HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={`panel3d panel3d--${variant} ${className}`}
      onClick={onClick}
      style={style}
      type={Tag === 'button' ? type ?? 'button' : undefined}
      disabled={disabled}
      {...rest}
    >
      <V2Icon name={FRAME_MAP[variant]} className="panel3dBg" />
      <div className="panel3dContent">{children}</div>
    </Tag>
  );
}
