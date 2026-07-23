import type { AppParams, Particle, UvPoint } from '../types';
import { EMOJI_SIZE_FRAC } from '../types';
import { clamp } from '../util/math';

export function makeParticle(
  partial: Partial<Particle> &
    Pick<Particle, 'x' | 'y' | 'vx' | 'vy' | 'uvPoly' | 'localPoly'>,
): Particle {
  return {
    rotation: 0,
    angularVel: 0,
    scale: 1,
    alpha: 1,
    age: 0,
    life: 1.5,
    scaleMul: 1,
    ...partial,
  };
}

/** Square grid side length from requested shard count. */
export function gridSide(particleCount: number): number {
  return clamp(Math.round(Math.sqrt(Math.max(4, particleCount))), 2, 20);
}

export function emojiDisplaySize(params: AppParams): number {
  return Math.min(params.width, params.height) * EMOJI_SIZE_FRAC;
}

/**
 * Build irregular shards that tile one emoji at the canvas center.
 * Grid corner points are jittered so cells become uneven quads (not neat squares).
 */
export function createShardGrid(
  params: AppParams,
  rng: () => number,
): Particle[] {
  const side = gridSide(params.particleCount);
  const { width, height, duration } = params;
  const cx = width / 2;
  const cy = height / 2;
  const size = emojiDisplaySize(params);

  // (side+1)² shared UV corners; edges stay on the border, interior is jittered.
  const pts: UvPoint[][] = [];
  const jitter = 0.38 / side; // strong irregularity, still non-crossing for most seeds

  for (let r = 0; r <= side; r++) {
    const row: UvPoint[] = [];
    for (let c = 0; c <= side; c++) {
      let u = c / side;
      let v = r / side;
      if (c > 0 && c < side) {
        u += (rng() - 0.5) * 2 * jitter;
      }
      if (r > 0 && r < side) {
        v += (rng() - 0.5) * 2 * jitter;
      }
      // keep interior points away from borders enough to reduce inverted quads
      if (c > 0 && c < side) u = clamp(u, 0.02, 0.98);
      if (r > 0 && r < side) v = clamp(v, 0.02, 0.98);
      row.push({ u, v });
    }
    pts.push(row);
  }

  // Extra chaos: randomly push some interior corners harder
  for (let r = 1; r < side; r++) {
    for (let c = 1; c < side; c++) {
      if (rng() < 0.45) {
        const boost = jitter * (0.6 + rng() * 1.2);
        pts[r][c].u = clamp(pts[r][c].u + (rng() - 0.5) * 2 * boost, 0.02, 0.98);
        pts[r][c].v = clamp(pts[r][c].v + (rng() - 0.5) * 2 * boost, 0.02, 0.98);
      }
    }
  }

  const particles: Particle[] = [];

  for (let row = 0; row < side; row++) {
    for (let col = 0; col < side; col++) {
      // corners clockwise: TL, TR, BR, BL
      let uvPoly: UvPoint[] = [
        { ...pts[row][col] },
        { ...pts[row][col + 1] },
        { ...pts[row + 1][col + 1] },
        { ...pts[row + 1][col] },
      ];

      // ~30% cells: collapse one corner toward diagonal → triangle-ish shard
      if (rng() < 0.3) {
        const k = Math.floor(rng() * 4);
        const prev = uvPoly[(k + 3) % 4];
        const next = uvPoly[(k + 1) % 4];
        uvPoly[k] = {
          u: (prev.u + next.u) * 0.5 + (rng() - 0.5) * jitter * 0.5,
          v: (prev.v + next.v) * 0.5 + (rng() - 0.5) * jitter * 0.5,
        };
        // drop near-duplicate by merging k into a 3-point poly
        const merged = uvPoly.filter((_, i) => i !== k);
        // keep 4 points with k replaced is fine for fill; prefer triangle:
        uvPoly = [merged[0], merged[1], merged[2]];
      }

      let cu = 0;
      let cv = 0;
      for (const p of uvPoly) {
        cu += p.u;
        cv += p.v;
      }
      cu /= uvPoly.length;
      cv /= uvPoly.length;

      const worldX = cx + (cu - 0.5) * size;
      const worldY = cy + (cv - 0.5) * size;

      const localPoly = uvPoly.map((p) => ({
        x: (p.u - cu) * size,
        y: (p.v - cv) * size,
      }));

      particles.push(
        makeParticle({
          x: worldX,
          y: worldY,
          vx: 0,
          vy: 0,
          rotation: 0,
          angularVel: 0,
          life: duration * (0.85 + rng() * 0.15),
          scaleMul: 1,
          uvPoly,
          localPoly,
        }),
      );
    }
  }

  return particles;
}
