const RADIUS = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Ring that fills toward the next multiplier tier; full and gold at the top tier. */
export function ComboRing({ progress, multiplier }: { progress: number; multiplier: number }) {
  const clamped = Math.min(1, Math.max(0, progress));
  return (
    <svg
      className={`comboRing${multiplier > 1 ? ' active' : ''}`}
      viewBox="0 0 36 36"
      role="img"
      aria-label={`Çarpan ${multiplier}, sonraki kademeye ${Math.round(clamped * 100)} yüzde`}
    >
      <circle className="comboRingTrack" cx="18" cy="18" r={RADIUS} />
      <circle
        className="comboRingFill"
        cx="18"
        cy="18"
        r={RADIUS}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * (1 - clamped)}
        transform="rotate(-90 18 18)"
      />
      <text x="18" y="22" textAnchor="middle">×{multiplier}</text>
    </svg>
  );
}
