import { V2Icon } from './Icon';
import '../styles/seal.css';

export function WaxSeal({
  className,
  label,
  multiline = false,
  ariaLabel,
}: {
  className: string;
  label: string;
  multiline?: boolean;
  ariaLabel?: string;
}) {
  const textLines = multiline ? label.split('\n') : [label];

  return (
    <span className={`waxSeal ${className}`} aria-label={ariaLabel ?? label}>
      <V2Icon name="waxSealPng" className="waxSealImg" />
      <span className={`waxSealLabel ${multiline ? 'multiLine' : ''}`}>
        {textLines.map((line, index) => (
          <span key={`${line}-${index}`}>{line}</span>
        ))}
      </span>
    </span>
  );
}
