import type { AppParams, Particle } from '../../types';
import { createShardGrid } from '../particle';

/** Violent shatter with strong sky toss, then soft debris rain. */
export function initShatter(
  particles: Particle[],
  params: AppParams,
  rng: () => number,
): void {
  const shards = createShardGrid(params, rng);
  const cx = params.width / 2;
  const cy = params.height / 2;
  const { force, spin } = params;

  for (const p of shards) {
    const dx = p.x - cx + (rng() - 0.5) * 16;
    const dy = p.y - cy + (rng() - 0.5) * 16;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;
    const speed = (200 + rng() * 480) * force;
    p.vx = nx * speed + (rng() - 0.5) * 140 * force;
    p.vy = ny * speed - (160 + rng() * 260) * force;
    p.angularVel = (rng() - 0.5) * 32 * spin;
    p.rotation = (rng() - 0.5) * 0.3;
    p.life = params.duration * (0.72 + rng() * 0.4);
    particles.push(p);
  }
}
