import type { AppParams, Particle } from '../../types';
import { applySkyBlast, createShardGrid } from '../particle';

/** Spiral whip in the horizontal plane + sky loft + depth. */
export function initSpiral(
  particles: Particle[],
  params: AppParams,
  rng: () => number,
): void {
  const shards = createShardGrid(params, rng);
  const cx = params.width / 2;
  const cy = params.height / 2;

  for (const p of shards) {
    applySkyBlast(p, params, rng, {
      speed: 200 + rng() * 160,
      loft: 280 + rng() * 160,
      camBias: 0.5,
      spinScale: 1.2,
    });

    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const tx = -dy / dist;
    const ty = dx / dist;
    const tangential = (240 + rng() * 200) * params.force;
    p.vx += tx * tangential;
    // mix a bit of screen-y into spiral so it isn't pure horizontal
    p.vx += tx * tangential * 0.15;
    p.vz += ty * tangential * 0.35;
    p.angularVelY += (3 + rng() * 4) * params.spin * (rng() < 0.5 ? -1 : 1);
    particles.push(p);
  }
}
