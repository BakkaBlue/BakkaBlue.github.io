import type { AppParams, Particle } from '../types';
import { lerp, smoothstep } from '../util/math';
import { mulberry32, hashString } from '../util/random';
import { gridSide } from './particle';
import { styleInits } from './styles';

export function createParticles(params: AppParams): Particle[] {
  const side = gridSide(params.particleCount);
  const seed =
    (params.seed ^
      hashString(params.emoji) ^
      hashString(params.style) ^
      (side * 2654435761)) >>>
    0;
  const rng = mulberry32(seed);
  const particles: Particle[] = [];
  styleInits[params.style](particles, params, rng);
  return particles;
}

/**
 * Explosive while rising / early; soft float once falling (vy > 0).
 * Canvas y grows downward, so vy > 0 means descending.
 */
export function stepParticles(particles: Particle[], params: AppParams, dt: number): void {
  const isSpiral = params.style === 'spiral';

  for (const p of particles) {
    p.age += dt;
    if (p.age >= p.life) {
      p.alpha = 0;
      continue;
    }

    const t = p.age / p.life;
    const falling = p.vy > 12;

    if (isSpiral && !falling) {
      const twist = 110 * params.force * dt;
      const angle = Math.atan2(p.vy, p.vx);
      p.vx += Math.cos(angle + Math.PI / 2) * twist;
      p.vy += Math.sin(angle + Math.PI / 2) * twist;
    }

    if (falling) {
      // 飘落：重力减弱、阻力加大、自旋衰减 + 轻微左右摇摆
      const gMul = 0.28;
      const dragX = Math.min(0.22, params.drag * 4 + 0.018);
      const dragY = Math.min(0.18, params.drag * 3 + 0.012);
      p.vy += params.gravity * gMul * dt;
      p.vx *= 1 - dragX;
      p.vy *= 1 - dragY;
      // soft terminal-ish cap so they don't hammer down
      const fallCap = 90 + params.gravity * 0.04;
      if (p.vy > fallCap) p.vy = fallCap;
      p.angularVel *= Math.max(0, 1 - 2.2 * dt);
      p.vx += Math.sin(p.age * 5.5 + p.x * 0.04) * (18 + 8 * params.force) * dt;
    } else {
      // 爆炸/上冲：更快冲出去；上升时阻力略小，拉高弧线
      p.vy += params.gravity * dt;
      p.vx *= 1 - params.drag * 0.85;
      p.vy *= 1 - params.drag * 0.45;
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rotation += p.angularVel * dt;
    p.scale = lerp(params.scaleFrom, params.scaleTo, smoothstep(t)) * p.scaleMul;
    // 飘落阶段再拉长一点可见时间：后半段更晚淡出
    p.alpha = t < 0.78 ? 1 : 1 - (t - 0.78) / 0.22;
  }
}
