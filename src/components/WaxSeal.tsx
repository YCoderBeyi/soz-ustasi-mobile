import { V2Icon } from './Icon';
import '../styles/seal.css';

export function WaxSeal({
  className,
  label,
  multiline = false,
  ariaLabel,
  variant,
}: {
  className: string;
  label: string;
  multiline?: boolean;
  ariaLabel?: string;
  variant?: string | null;
}) {
  const textLines = multiline ? label.split('\n') : [label];

  return (
    <span className={`waxSeal ${className}`} aria-label={ariaLabel ?? label}>
      {variant ? (
        <img className="waxSealImg" src={`/assets/ui/seals/${variant}.png`} alt="" />
      ) : (
        <V2Icon name="waxSealPng" className="waxSealImg" />
      )}
      <span className={`waxSealLabel ${multiline ? 'multiLine' : ''}`}>
        {textLines.map((line, index) => (
          <span key={`${line}-${index}`}>{line}</span>
        ))}
      </span>
    </span>
  );
}
