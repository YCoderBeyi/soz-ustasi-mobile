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
  const iconSrc = type === 'coin' ? '/assets/map/topbar-3d/topbar-coin.png' : '/assets/map/topbar-3d/topbar-gem.png';
  const compactClass = compact ? 'map-resource-compact' : '';
  return (
    <div className={`map-resource-pill ${type === 'coin' ? 'map-resource-coin' : 'map-resource-gem'} ${compactClass} ${className}`} aria-label={type === 'coin' ? `Altın: ${value}` : `Değer: ${value}`}>
      <img className="map-resource-icon" src={iconSrc} alt="" />
      <span className="map-resource-value">{value}</span>
    </div>
  );
}
