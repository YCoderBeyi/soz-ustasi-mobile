export function FiligreeDivider({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 360 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="filigreeGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(241,201,106,0)" />
          <stop offset="20%" stopColor="rgba(241,201,106,0.6)" />
          <stop offset="50%" stopColor="rgba(217,164,65,0.8)" />
          <stop offset="80%" stopColor="rgba(241,201,106,0.6)" />
          <stop offset="100%" stopColor="rgba(241,201,106,0)" />
        </linearGradient>
      </defs>
      <path d="M0 12h360" stroke="url(#filigreeGold)" strokeWidth="1" />
      <circle cx="180" cy="12" r="4" fill="url(#filigreeGold)" />
      <circle cx="180" cy="12" r="8" fill="none" stroke="url(#filigreeGold)" strokeWidth="0.8" />
      <path d="M140 12q0-6 20-6 20 0 20 6" fill="none" stroke="url(#filigreeGold)" strokeWidth="1" opacity="0.6" />
      <path d="M180 12q0-6 20-6 20 0 20 6" fill="none" stroke="url(#filigreeGold)" strokeWidth="1" opacity="0.6" />
      <circle cx="80" cy="12" r="2" fill="url(#filigreeGold)" opacity="0.5" />
      <circle cx="280" cy="12" r="2" fill="url(#filigreeGold)" opacity="0.5" />
    </svg>
  );
}
