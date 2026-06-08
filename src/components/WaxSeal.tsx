import { useId } from 'react';
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
  const uid = useId().replace(/:/g, '');
  const bodyId = `${uid}-body`;
  const highlightId = `${uid}-highlight`;
  const noiseId = `${uid}-noise`;
  const grainId = `${uid}-grain`;
  const filterId = `${uid}-filter`;
  const textLines = multiline ? label.split('\n') : [label];

  return (
    <span className={`waxSeal ${className}`} aria-label={ariaLabel ?? label}>
      <svg className="waxSealSvg" viewBox="0 0 220 220" role="presentation" aria-hidden="true">
        <defs>
          <radialGradient id={bodyId} cx="34%" cy="28%" r="84%">
            <stop offset="0%" stopColor="#f06270" />
            <stop offset="28%" stopColor="#cc4051" />
            <stop offset="58%" stopColor="#9f2d3e" />
            <stop offset="82%" stopColor="#6f1d2b" />
            <stop offset="100%" stopColor="#351018" />
          </radialGradient>
          <radialGradient id={highlightId} cx="32%" cy="28%" r="56%">
            <stop offset="0%" stopColor="rgba(255, 244, 210, 0.58)" />
            <stop offset="32%" stopColor="rgba(255, 232, 183, 0.24)" />
            <stop offset="60%" stopColor="rgba(255, 232, 183, 0.08)" />
            <stop offset="100%" stopColor="rgba(255, 232, 183, 0)" />
          </radialGradient>
          <linearGradient id={grainId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.16)" />
            <stop offset="28%" stopColor="rgba(255, 255, 255, 0.04)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.045" numOctaves="2" seed="8" result={noiseId} />
            <feDisplacementMap in="SourceGraphic" in2={noiseId} scale="10" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <path
          d="M109 17C125 17 139 21 151 27C161 31 171 37 178 47C185 56 188 67 190 78C193 91 193 102 191 113C189 124 186 134 182 145C177 157 171 167 161 175C151 183 140 188 129 193C118 197 107 199 95 198C84 197 73 194 62 190C50 186 39 180 31 172C22 164 17 154 13 144C9 134 7 123 6 112C5 100 6 89 9 78C12 67 17 57 24 48C32 38 41 32 52 27C64 22 76 18 109 17Z"
          fill={`url(#${bodyId})`}
          filter={`url(#${filterId})`}
        />
        <ellipse cx="83" cy="54" rx="30" ry="20" fill={`url(#${highlightId})`} opacity="0.92" />
        <circle cx="110" cy="106" r="70" fill="rgba(54, 7, 16, 0.12)" stroke="rgba(45, 5, 13, 0.62)" strokeWidth="9" />
        <circle cx="110" cy="104" r="62" fill="rgba(171, 43, 60, 0.18)" stroke="rgba(255, 226, 194, 0.14)" strokeWidth="3" />
        <circle cx="110" cy="104" r="53" fill="none" stroke="rgba(55, 7, 17, 0.3)" strokeWidth="2" />
        <circle cx="110" cy="45" r="3" fill="rgba(255, 225, 194, 0.28)" />
        <circle cx="169" cy="104" r="3" fill="rgba(55, 7, 17, 0.42)" />
        <circle cx="110" cy="163" r="3" fill="rgba(55, 7, 17, 0.42)" />
        <circle cx="51" cy="104" r="3" fill="rgba(255, 225, 194, 0.18)" />
        <path d="M24 122C24 84 38 49 68 30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" strokeLinecap="round" />
        <path d="M34 126C39 94 53 69 77 44" fill="none" stroke={`url(#${grainId})`} strokeWidth="5" strokeLinecap="round" opacity="0.5" />
        <path d="M184 118C182 134 175 149 164 162" fill="none" stroke="rgba(255, 244, 210, 0.08)" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className={`waxSealLabel ${multiline ? 'multiLine' : ''}`}>
        {textLines.map((line, index) => (
          <span key={`${line}-${index}`}>{line}</span>
        ))}
      </span>
    </span>
  );
}
