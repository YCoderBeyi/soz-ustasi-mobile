import { Icon } from './Icon';

export function StarRating({ stars, max = 3, large = false }: { stars: number; max?: number; large?: boolean }) {
  const iconClass = large ? 'uiV1IconLg' : 'uiV1IconMd';
  return (
    <span className="starRating3d" aria-label={`${stars} yıldız`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < stars ? 'starEarned3d' : 'starEmpty3d'}>
          <Icon name="crown" className={iconClass} />
        </span>
      ))}
    </span>
  );
}
