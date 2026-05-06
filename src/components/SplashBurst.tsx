import type { CSSProperties } from 'react';
import { useMemo } from 'react';

const PARTICLES_PER_SIDE = 16;

interface Particle {
  side: 'left' | 'right';
  dx: number;
  dy: number;
  size: number;
  durationMs: number;
  delayMs: number;
  hue: number;
}

function makeParticles(): Particle[] {
  const out: Particle[] = [];
  for (const side of ['left', 'right'] as const) {
    const dirX = side === 'left' ? -1 : 1;
    for (let i = 0; i < PARTICLES_PER_SIDE; i++) {
      // Cone biased outward from the side; angle is measured from the horizontal outward axis.
      const angleDeg = (Math.random() - 0.5) * 130;
      const rad = (angleDeg * Math.PI) / 180;
      const distance = 70 + Math.random() * 110;
      out.push({
        side,
        dx: dirX * Math.cos(rad) * distance,
        dy: Math.sin(rad) * distance,
        size: 4 + Math.random() * 7,
        durationMs: 650 + Math.random() * 550,
        delayMs: Math.random() * 140,
        hue: Math.random() < 0.55 ? 145 : 45,
      });
    }
  }
  return out;
}

export function SplashBurst() {
  const particles = useMemo(makeParticles, []);
  return (
    <div className="splash-burst" aria-hidden>
      {particles.map((p, i) => {
        const style: CSSProperties = {
          ['--dx' as string]: `${p.dx.toFixed(1)}px`,
          ['--dy' as string]: `${p.dy.toFixed(1)}px`,
          ['--size' as string]: `${p.size.toFixed(1)}px`,
          ['--dur' as string]: `${p.durationMs}ms`,
          ['--delay' as string]: `${p.delayMs}ms`,
          ['--hue' as string]: `${p.hue}`,
          [p.side]: '0',
        };
        return <span key={i} className={`splash-particle ${p.side}`} style={style} />;
      })}
    </div>
  );
}
