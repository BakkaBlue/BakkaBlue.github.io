import type { AppParams, Particle } from '../../types';
import { createShardGrid } from '../particle';

/** Fast upward fountain; descent handled as float in the simulator. */
export function initFountain(
  particles: Particle[],
  params: AppParams,
  rng: () => number,
): void {
  const shards = createShardGrid(params, rng);
  const { force, spin } = params;

  for (const p of shards) {
    const angle = -Math.PI / 2 + (rng() - 0.5) * 1.05;
    const speed = (420 + rng() * 420) * force;
    p.vx = Math.cos(angle) * speed + (rng() - 0.5) * 120 * force;
    p.vy = Math.sin(angle) * speed;
    // extra sky loft
    p.vy -= (80 + rng() * 100) * force;
    p.angularVel = (rng() - 0.5) * 12 * spin;
    p.life = params.duration * (0.78 + rng() * 0.32);
    particles.push(p);
  }
}
