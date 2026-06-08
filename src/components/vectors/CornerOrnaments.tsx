export function CornerOrnaments({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cornerGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(241,201,106,0.4)" />
          <stop offset="50%" stopColor="rgba(217,164,65,0.6)" />
          <stop offset="100%" stopColor="rgba(241,201,106,0.2)" />
        </linearGradient>
      </defs>
      <path d="M0 0h80v2H2v78H0V0Z" fill="url(#cornerGold)" />
      <circle cx="40" cy="40" r="6" fill="none" stroke="url(#cornerGold)" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="12" fill="none" stroke="url(#cornerGold)" strokeWidth="1" opacity="0.5" />
      <path d="M0 800h80v-2H2v-78H0v80Z" fill="url(#cornerGold)" />
      <circle cx="40" cy="760" r="6" fill="none" stroke="url(#cornerGold)" strokeWidth="1.5" />
      <circle cx="40" cy="760" r="12" fill="none" stroke="url(#cornerGold)" strokeWidth="1" opacity="0.5" />
      <path d="M400 0h-80v2h78v78h2V0Z" fill="url(#cornerGold)" />
      <circle cx="360" cy="40" r="6" fill="none" stroke="url(#cornerGold)" strokeWidth="1.5" />
      <circle cx="360" cy="40" r="12" fill="none" stroke="url(#cornerGold)" strokeWidth="1" opacity="0.5" />
      <path d="M400 800h-80v-2h78v-78h2v80Z" fill="url(#cornerGold)" />
      <circle cx="360" cy="760" r="6" fill="none" stroke="url(#cornerGold)" strokeWidth="1.5" />
      <circle cx="360" cy="760" r="12" fill="none" stroke="url(#cornerGold)" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
