import type { AppParams, Particle } from '../../types';
import { applySkyBlast, createShardGrid } from '../particle';

/** Upward fountain with 3D depth scatter. */
export function initFountain(
  particles: Particle[],
  params: AppParams,
  rng: () => number,
): void {
  const shards = createShardGrid(params, rng);
  for (const p of shards) {
    applySkyBlast(p, params, rng, {
      speed: 220 + rng() * 180,
      loft: 420 + rng() * 260,
      camBias: 0.25,
      spinScale: 0.9,
    });
    // squeeze more of the blast into the upper cone
    p.vx *= 0.85;
    p.vz *= 0.9;
    p.vy -= 80 * params.force;
    particles.push(p);
  }
}
