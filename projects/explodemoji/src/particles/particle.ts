import type { AppParams, Particle, UvPoint } from '../types';
import { EMOJI_SIZE_FRAC } from '../types';
import { clamp, TAU } from '../util/math';

export function makeParticle(
  partial: Partial<Particle> &
    Pick<Particle, 'x' | 'y' | 'vx' | 'vy' | 'uvPoly' | 'localPoly'>,
): Particle {
  return {
    z: 0,
    vz: 0,
    rotation: 0,
    angularVel: 0,
    rotX: 0,
    rotY: 0,
    angularVelX: 0,
    angularVelY: 0,
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

/** Random unit vector on a sphere. */
export function randomUnit3(rng: () => number): { x: number; y: number; z: number } {
  const z = rng() * 2 - 1;
  const t = rng() * TAU;
  const r = Math.sqrt(Math.max(0, 1 - z * z));
  return { x: r * Math.cos(t), y: r * Math.sin(t), z };
}

/**
 * 3D blast: spherical kick + mandatory sky loft so every shard goes up first.
 * World Y is canvas-down; sky loft is negative vy.
 */
export function applySkyBlast(
  p: Particle,
  params: AppParams,
  rng: () => number,
  opts: {
    /** Base radial speed multiplier. */
    speed: number;
    /** Extra upward (sky) speed, always applied. */
    loft: number;
    /** Bias of sphere sample toward camera (+z). 0–1. */
    camBias?: number;
    /** Extra planar spin scale. */
    spinScale?: number;
  },
): void {
  const { force, spin } = params;
  const dir = randomUnit3(rng);
  // Prefer directions that aren't straight into the ground plane first
  let dy = dir.y;
  let dz = dir.z;
  const camBias = opts.camBias ?? 0.35;
  dz = dz * (1 - camBias) + camBias * (0.35 + rng() * 0.65);
  // Normalize xz + adjusted y roughly
  const len = Math.hypot(dir.x, dy, dz) || 1;
  const nx = dir.x / len;
  const ny = dy / len;
  const nz = dz / len;

  const speed = opts.speed * force * (0.75 + rng() * 0.55);
  p.vx = nx * speed;
  p.vy = ny * speed;
  p.vz = nz * speed;

  // All shards bounce skyward first
  const loft = opts.loft * force * (0.85 + rng() * 0.4);
  p.vy -= loft;

  const spinScale = opts.spinScale ?? 1;
  p.angularVel = (rng() - 0.5) * 16 * spin * spinScale;
  p.angularVelX = (rng() - 0.5) * 10 * spin * spinScale;
  p.angularVelY = (rng() - 0.5) * 10 * spin * spinScale;
  p.rotX = (rng() - 0.5) * 0.2;
  p.rotY = (rng() - 0.5) * 0.2;
  p.life = params.duration * (0.78 + rng() * 0.35);
}

/**
 * Build irregular shards that tile one emoji at the canvas center (z=0 plane).
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

  const pts: UvPoint[][] = [];
  const jitter = 0.38 / side;

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
      if (c > 0 && c < side) u = clamp(u, 0.02, 0.98);
      if (r > 0 && r < side) v = clamp(v, 0.02, 0.98);
      row.push({ u, v });
    }
    pts.push(row);
  }

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
      let uvPoly: UvPoint[] = [
        { ...pts[row][col] },
        { ...pts[row][col + 1] },
        { ...pts[row + 1][col + 1] },
        { ...pts[row + 1][col] },
      ];

      if (rng() < 0.3) {
        const k = Math.floor(rng() * 4);
        const prev = uvPoly[(k + 3) % 4];
        const next = uvPoly[(k + 1) % 4];
        uvPoly[k] = {
          u: (prev.u + next.u) * 0.5 + (rng() - 0.5) * jitter * 0.5,
          v: (prev.v + next.v) * 0.5 + (rng() - 0.5) * jitter * 0.5,
        };
        const merged = uvPoly.filter((_, i) => i !== k);
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
          z: 0,
          vx: 0,
          vy: 0,
          vz: 0,
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
