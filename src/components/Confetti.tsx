const COLORS = ['#f1c96a', '#d9a441', '#e8a87c', '#4cc38a', '#8ed4e8', '#d95562', '#fff9ef', '#c49b5a'];
const SHAPES = ['◆', '●', '▲', '✦'];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function Confetti({ count = 50 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => {
    const color = COLORS[i % COLORS.length];
    const shape = SHAPES[i % SHAPES.length];
    const left = `${randomBetween(5, 95)}%`;
    const delay = `${randomBetween(0, 1.2)}s`;
    const duration = `${randomBetween(1.8, 3.2)}s`;
    const size = `${randomBetween(8, 16)}px`;
    const rotation = `${randomBetween(-180, 180)}deg`;
    const sway = `${randomBetween(-40, 40)}px`;

    return { color, shape, left, delay, duration, size, rotation, sway, key: i };
  });

  return (
    <div className="confettiOverlay" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.key}
          className="confettiPiece"
          style={{
            left: p.left,
            color: p.color,
            fontSize: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            '--sway': p.sway,
            '--rotation': p.rotation,
          } as React.CSSProperties}
        >
          {p.shape}
        </span>
      ))}
    </div>
  );
}
