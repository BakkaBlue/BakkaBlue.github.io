import type { AppParams, Particle } from '../../types';
import { applySkyBlast, createShardGrid } from '../particle';

/** Violent 3D shatter: strong loft, wild tumble, deep z scatter. */
export function initShatter(
  particles: Particle[],
  params: AppParams,
  rng: () => number,
): void {
  const shards = createShardGrid(params, rng);
  for (const p of shards) {
    applySkyBlast(p, params, rng, {
      speed: 380 + rng() * 320,
      loft: 360 + rng() * 240,
      camBias: 0.45,
      spinScale: 1.5,
    });
    p.rotation = (rng() - 0.5) * 0.4;
    particles.push(p);
  }
}
