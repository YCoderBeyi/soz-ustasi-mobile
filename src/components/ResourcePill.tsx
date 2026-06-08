import { V2Icon } from './Icon';

type PillType = 'coin' | 'timer';

export function ResourcePill({
  type,
  value,
  className = '',
  compact = false,
}: {
  type: PillType;
  value: string | number;
  className?: string;
  compact?: boolean;
}) {
  const icon = type === 'coin' ? 'coinPill' : 'timerPill';
  return (
    <span className={`resourcePillWrap ${compact ? 'resourcePillWrap--compact' : ''} ${className}`} aria-label={type === 'coin' ? `Altın: ${value}` : `Süre: ${value}`}>
      <V2Icon name={icon} className="resourcePillBg" />
      <span className="resourcePillValue">{value}</span>
    </span>
  );
}
