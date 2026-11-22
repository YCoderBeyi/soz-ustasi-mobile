import { useId } from 'react';

type SealState = 'locked' | 'active' | 'completed';

export function LevelWaxSeal({
  className = '',
  state,
  levelNumber,
}: {
  className?: string;
  state: SealState;
  levelNumber: number;
}) {
  const uid = useId().replace(/:/g, '');
  const bodyId = `${uid}-body`;
  const highlightId = `${uid}-highlight`;
  const filterId = `${uid}-filter`;

  const isLocked = state === 'locked';
  const isActive = state === 'active';
  const isCompleted = state === 'completed';

  const burgundyBase = isCompleted ? '#4cc38a' : '#9f2d3e';
  const burgundyDark = isCompleted ? '#2d7a5a' : '#6f1d2b';
  const burgundyDarker = isCompleted ? '#1a523a' : '#351018';
  const waxHighlight = isCompleted ? '#7ae0b0' : '#d95562';

  return (
    <span className={`levelWaxSeal ${className} seal-${state}`}>
      <svg className="levelWaxSealSvg" viewBox="0 0 220 220" role="presentation" aria-hidden="true">
        <defs>
          <radialGradient id={bodyId} cx="34%" cy="28%" r="84%">
            <stop offset="0%" stopColor={waxHighlight} />
            <stop offset="28%" stopColor={burgundyBase} />
            <stop offset="58%" stopColor={burgundyBase} />
            <stop offset="82%" stopColor={burgundyDark} />
            <stop offset="100%" stopColor={burgundyDarker} />
          </radialGradient>
          <radialGradient id={highlightId} cx="32%" cy="28%" r="56%">
            <stop offset="0%" stopColor="rgba(255,244,210,0.58)" />
            <stop offset="32%" stopColor="rgba(255,232,183,0.24)" />
            <stop offset="60%" stopColor="rgba(255,232,183,0.08)" />
            <stop offset="100%" stopColor="rgba(255,232,183,0)" />
          </radialGradient>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.3)" />
          </filter>
        </defs>
        <g filter={isActive ? `url(#${filterId})` : undefined}>
          <path
            d="M109 17C125 17 139 21 151 27C161 31 171 37 178 47C185 56 188 67 190 78C193 91 193 102 191 113C189 124 186 134 182 145C177 157 171 167 161 175C151 183 140 188 129 193C118 197 107 199 95 198C84 197 73 194 62 190C50 186 39 180 31 172C22 164 17 154 13 144C9 134 7 123 6 112C5 100 6 89 9 78C12 67 17 57 24 48C32 38 41 32 52 27C64 22 76 18 109 17Z"
            fill={`url(#${bodyId})`}
          />
          <ellipse cx="83" cy="54" rx="30" ry="20" fill={`url(#${highlightId})`} opacity="0.92" />
        </g>
        {isLocked && (
          <g transform="translate(62 80)" opacity="0.7">
            <rect x="18" y="24" width="28" height="20" rx="4" fill="rgba(255,255,255,0.6)" />
            <path d="M22 24V18a10 10 0 0 1 20 0v6" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="5" strokeLinecap="round" />
            <circle cx="32" cy="36" r="3" fill="rgba(100,100,100,0.8)" />
          </g>
        )}
        {isCompleted && (
          <g transform="translate(60 80)">
            <circle cx="50" cy="30" r="18" fill="rgba(255,255,255,0.25)" />
            <path d="M38 30l8 8 16-16" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {isActive && (
          <g transform="translate(60 78)">
            <circle cx="50" cy="32" r="18" fill="rgba(255,255,255,0.2)" />
            <polygon points="42,22 42,42 60,32" fill="rgba(255,255,255,0.85)" />
          </g>
        )}
        <text
          x="110"
          y="150"
          textAnchor="middle"
          fill="rgba(255,255,255,0.6)"
          fontSize="24"
          fontWeight="900"
          fontFamily="Georgia, serif"
        >
          {levelNumber}
        </text>
      </svg>
    </span>
  );
}
