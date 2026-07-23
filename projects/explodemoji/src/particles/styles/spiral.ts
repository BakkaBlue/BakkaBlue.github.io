import type { AppParams, Particle } from '../../types';
import { createShardGrid } from '../particle';

/** Fast spiral whip with upward bias. */
export function initSpiral(
  particles: Particle[],
  params: AppParams,
  rng: () => number,
): void {
  const shards = createShardGrid(params, rng);
  const cx = params.width / 2;
  const cy = params.height / 2;
  const { force, spin } = params;

  for (const p of shards) {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;
    const tx = -ny;
    const ty = nx;
    const radial = (120 + rng() * 140) * force;
    const tangential = (320 + rng() * 280) * force;
    p.vx = nx * radial + tx * tangential;
    p.vy = ny * radial + ty * tangential;
    p.vy -= (180 + rng() * 160) * force;
    p.angularVel = (4 + rng() * 6) * spin * (rng() < 0.5 ? -1 : 1);
    p.life = params.duration * (0.76 + rng() * 0.34);
    particles.push(p);
  }
}
