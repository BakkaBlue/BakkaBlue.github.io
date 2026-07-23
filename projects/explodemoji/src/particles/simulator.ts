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
 * 3D explosion: fly skyward (+depth), then soft float fall.
 * Canvas y grows downward → sky is negative vy; +z toward camera.
 */
export function stepParticles(particles: Particle[], params: AppParams, dt: number): void {
  const isSpiral = params.style === 'spiral';
  const span = Math.min(params.width, params.height);
  const zLimit = span * 0.9;

  for (const p of particles) {
    p.age += dt;
    if (p.age >= p.life) {
      p.alpha = 0;
      continue;
    }

    const t = p.age / p.life;
    // still climbing or early blast if moving up or only just cresting
    const falling = p.vy > 18;

    if (isSpiral && !falling) {
      const twist = 100 * params.force * dt;
      // twist in XZ plane for 3D spiral feel
      const ang = Math.atan2(p.vz, p.vx);
      p.vx += Math.cos(ang + Math.PI / 2) * twist;
      p.vz += Math.sin(ang + Math.PI / 2) * twist;
    }

    if (falling) {
      // 飘落：弱重力、强阻力、深度也衰减，左右微晃
      const gMul = 0.32;
      const dragX = Math.min(0.24, params.drag * 4.2 + 0.02);
      const dragY = Math.min(0.2, params.drag * 3.2 + 0.014);
      const dragZ = Math.min(0.2, params.drag * 3.5 + 0.016);
      p.vy += params.gravity * gMul * dt;
      p.vx *= 1 - dragX;
      p.vy *= 1 - dragY;
      p.vz *= 1 - dragZ;
      const fallCap = 85 + params.gravity * 0.035;
      if (p.vy > fallCap) p.vy = fallCap;
      p.angularVel *= Math.max(0, 1 - 2.4 * dt);
      p.angularVelX *= Math.max(0, 1 - 2.0 * dt);
      p.angularVelY *= Math.max(0, 1 - 2.0 * dt);
      p.vx += Math.sin(p.age * 5.2 + p.z * 0.02) * (16 + 7 * params.force) * dt;
      p.vz += Math.cos(p.age * 4.4 + p.x * 0.03) * (12 + 5 * params.force) * dt;
    } else {
      // 爆炸 / 上冲：保留动能，上升阻力小
      p.vy += params.gravity * dt;
      p.vx *= 1 - params.drag * 0.7;
      p.vy *= 1 - params.drag * 0.35;
      p.vz *= 1 - params.drag * 0.55;
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.z += p.vz * dt;
    // soft depth clamp so perspective stays stable
    if (p.z > zLimit) {
      p.z = zLimit;
      p.vz *= -0.15;
    } else if (p.z < -zLimit * 0.7) {
      p.z = -zLimit * 0.7;
      p.vz *= -0.15;
    }

    p.rotation += p.angularVel * dt;
    p.rotX += p.angularVelX * dt;
    p.rotY += p.angularVelY * dt;

    // base size curve × life; perspective applied at draw time
    p.scale = lerp(params.scaleFrom, params.scaleTo, smoothstep(t)) * p.scaleMul;
    p.alpha = t < 0.8 ? 1 : 1 - (t - 0.8) / 0.2;
  }
}
