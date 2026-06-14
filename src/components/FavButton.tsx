import { Icon } from './Icon';

export function FavButton({
  active,
  onClick,
  className = '',
}: {
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`favBtn3d ${active ? 'favBtn3dActive' : ''} ${className}`}
      onClick={onClick}
      aria-label={active ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      <Icon name="seal" className="uiV1IconMd" />
    </button>
  );
}
