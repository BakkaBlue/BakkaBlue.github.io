import type { AppParams, Particle } from '../../types';
import { createShardGrid } from '../particle';

/** Radial burst with strong upward loft, then shards fall gently. */
export function initBurst(
  particles: Particle[],
  params: AppParams,
  rng: () => number,
): void {
  const shards = createShardGrid(params, rng);
  const cx = params.width / 2;
  const cy = params.height / 2;
  const { force, spin } = params;
  const span = Math.min(params.width, params.height);

  for (const p of shards) {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;
    // faster explosion kick
    const speed =
      (260 + rng() * 380) * force * (0.5 + dist / (span * 0.26));
    const jitter = (rng() - 0.5) * 0.6 * force;
    p.vx = nx * speed + -ny * jitter * 90;
    p.vy = ny * speed + nx * jitter * 90;
    // loft skyward so arcs read before the float-down
    p.vy -= (220 + rng() * 200) * force;
    p.angularVel = (rng() - 0.5) * 14 * spin;
    // staggered life → layered fall
    p.life = params.duration * (0.75 + rng() * 0.35);
    particles.push(p);
  }
}
