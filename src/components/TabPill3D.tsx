import { V2Icon } from './Icon';

export function TabPill3D({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={`tabPill3d ${active ? 'tabPill3dActive' : ''}`} onClick={onClick} aria-pressed={active}>
      <V2Icon name={active ? 'tabActive' : 'tabInactive'} className="tabPill3dBg" />
      <span className="tabPill3dLabel">{label}</span>
    </button>
  );
}
