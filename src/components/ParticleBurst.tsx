import { useEffect, useState, type CSSProperties } from 'react';
import '../styles/animations.css';

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  delay: number;
};

export function ParticleBurst({ 
  active, 
  type = 'gold',
  count = 12 
}: { 
  active: boolean; 
  type?: 'gold' | 'hidden' | 'seal';
  count?: number;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const colors = type === 'gold' ? ['#f1c96a', '#d9a441', '#fff'] 
                   : type === 'hidden' ? ['#70d7b1', '#4cc38a', '#fff']
                   : ['#9f2d3e', '#d95562', '#f1c96a'];

      const newParticles = Array.from({ length: count }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
        const speed = 2 + Math.random() * 4;
        return {
          id: Date.now() + i,
          x: 50,
          y: 50,
          size: 4 + Math.random() * 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          delay: Math.random() * 0.1,
        };
      });
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [active, type, count]);

  if (particles.length === 0) return null;

  return (
    <div className="particleContainer" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            '--x': `${p.vx * 20}px`,
            '--y': `${p.vy * 20}px`,
            '--bg': p.color,
            '--size': `${p.size}px`,
            '--delay': `${p.delay}s`,
          } as CSSProperties & Record<`--${string}`, string>}
        />
      ))}
    </div>
  );
}
