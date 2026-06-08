import { useId } from 'react';

export function TugraSeal({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const goldGrad = `${uid}-gold`;
  const goldShine = `${uid}-shine`;
  const innerGlow = `${uid}-inner-glow`;
  const shadowId = `${uid}-shadow`;

  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Tuğra Mührü"
    >
      <defs>
        <radialGradient id={goldGrad} cx="42%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#fff5d6" />
          <stop offset="22%" stopColor="#f1c96a" />
          <stop offset="48%" stopColor="#d9a441" />
          <stop offset="74%" stopColor="#b8862c" />
          <stop offset="100%" stopColor="#6b4e15" />
        </radialGradient>
        <radialGradient id={goldShine} cx="28%" cy="24%" r="48%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id={innerGlow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(241,201,106,0.35)" />
          <stop offset="70%" stopColor="rgba(241,201,106,0.05)" />
          <stop offset="100%" stopColor="rgba(241,201,106,0)" />
        </radialGradient>
        <filter id={shadowId}>
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(0,0,0,0.45)" />
          <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor="rgba(217,164,65,0.25)" />
        </filter>
      </defs>
      <g filter={`url(#${shadowId})`}>
        <circle cx="120" cy="120" r="98" fill={`url(#${goldGrad})`} />
        <circle cx="120" cy="120" r="98" fill={`url(#${goldShine})`} />
        <circle cx="120" cy="120" r="88" fill="none" stroke="rgba(107,78,21,0.3)" strokeWidth="2" />
        <circle cx="120" cy="120" r="78" fill={`url(#${innerGlow})`} />
      </g>
      <g filter={`url(#${shadowId})`}>
        <path
          d="M160 72c-8-4-18-6-28-6-14 0-26 4-36 10-6 4-10 8-12 12-2 4-2 8 0 10 2 2 6 2 10 0 4-2 8-6 14-10 6-4 14-8 24-10 10-2 18-2 24 0 6 2 10 6 10 10 0 4-2 8-8 10-6 2-14 4-24 4-10 0-20-2-28-6-6-2-10-2-12 0-2 2 0 6 4 10 4 4 10 8 18 10 8 2 16 4 26 4 10 0 20-2 28-6 8-4 12-10 12-16 0-6-4-12-12-16z"
          fill="#6b4e15"
        />
        <path
          d="M120 78c-12 0-22 4-30 10-6 4-10 10-10 14 0 4 4 6 8 6s10-2 16-4c6-2 14-4 22-4 8 0 14 2 18 4 4 2 6 4 6 6 0 2-2 4-6 4-4 0-10-2-16-2-8 0-16 2-24 6-6 2-10 6-10 10 0 4 4 6 10 6 6 0 14-2 22-4 8-2 16-2 22 0 6 2 10 6 10 10 0 4-4 8-10 12-6 4-14 6-24 6-10 0-18-2-24-6-6-4-10-8-10-12 0-2 2-4 4-6 2-2 4-4 4-6 0-4-4-8-10-10-6-2-12-2-16 0-4 2-6 6-6 10 0 8 6 16 16 24 10 8 24 12 42 12 16 0 30-4 40-12 10-8 16-18 16-28 0-10-6-20-18-28-12-8-28-12-46-12z"
          fill="#8a6622"
          opacity="0.6"
        />
        <path
          d="M110 140c-4 0-8-2-10-6-2-4 0-8 4-12 4-4 10-8 18-10 8-2 16-2 22 0 6 2 10 6 10 10 0 4-2 8-8 10-6 2-14 4-22 4-8 0-14-2-18-4"
          fill="none"
          stroke="#6b4e15"
          strokeWidth="2"
        />
        <path
          d="M105 148c0-4 4-8 10-10 6-2 14-4 22-4 8 0 14 2 18 4 4 2 6 6 6 10"
          fill="none"
          stroke="#6b4e15"
          strokeWidth="2"
        />
      </g>
      <g>
        <text
          x="120"
          y="128"
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(107,78,21,0.85)"
          fontFamily="Georgia, serif"
          fontSize="32"
          fontWeight="900"
          letterSpacing="4"
          style={{ textShadow: '0 0 8px rgba(241,201,106,0.3)' }}
        >
          S
        </text>
        <text
          x="120"
          y="128"
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,245,214,0.92)"
          fontFamily="Georgia, serif"
          fontSize="31"
          fontWeight="900"
          letterSpacing="4"
        >
          S
        </text>
      </g>
    </svg>
  );
}
