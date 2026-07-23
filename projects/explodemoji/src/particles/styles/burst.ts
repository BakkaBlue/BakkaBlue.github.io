import type { AppParams, Particle } from '../../types';
import { applySkyBlast, createShardGrid } from '../particle';

/** Full 3D spherical burst — every shard lofted skyward first. */
export function initBurst(
  particles: Particle[],
  params: AppParams,
  rng: () => number,
): void {
  const shards = createShardGrid(params, rng);
  for (const p of shards) {
    applySkyBlast(p, params, rng, {
      speed: 340 + rng() * 260,
      loft: 320 + rng() * 180,
      camBias: 0.4,
      spinScale: 1,
    });
    // slight outward planar push from shard's UV position
    const cx = params.width / 2;
    const cy = params.height / 2;
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const kick = (40 + rng() * 80) * params.force;
    p.vx += (dx / dist) * kick;
    p.vy += (dy / dist) * kick * 0.35;
    particles.push(p);
  }
}
