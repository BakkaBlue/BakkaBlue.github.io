import type { AppParams, Particle } from '../types';
import { HOLD_DURATION, cycleDuration } from '../types';
import { createParticles, stepParticles } from '../particles/simulator';
import { drawFrame, ensureCanvasSize } from './canvas';
import { clamp } from '../util/math';

export interface PreviewController {
  reset: (params: AppParams) => void;
  setImage: (image: ImageBitmap | null, emoji: string) => void;
  setParams: (params: AppParams, resetSim: boolean) => void;
  start: () => void;
  stop: () => void;
  isRunning: () => boolean;
  getParticles: () => Particle[];
}

export function createPreview(
  canvas: HTMLCanvasElement,
  initial: AppParams,
): PreviewController {
  const ctxOrNull = canvas.getContext('2d');
  if (!ctxOrNull) throw new Error('2d context unavailable');
  const ctx: CanvasRenderingContext2D = ctxOrNull;

  let params = { ...initial };
  let particles = createParticles(params);
  let image: ImageBitmap | null = null;
  let emoji = params.emoji;
  let simTime = 0;
  let raf = 0;
  let running = false;
  let lastTs = 0;

  ensureCanvasSize(canvas, ctx, params.width, params.height);

  function reset(p: AppParams): void {
    params = { ...p };
    ensureCanvasSize(canvas, ctx, params.width, params.height);
    particles = createParticles(params);
    simTime = 0;
    lastTs = 0;
  }

  function frame(ts: number): void {
    if (!running) return;
    if (!lastTs) lastTs = ts;
    let dt = (ts - lastTs) / 1000;
    lastTs = ts;
    dt = clamp(dt, 0, 1 / 20);

    const total = cycleDuration(params);
    simTime += dt;
    if (simTime >= total) {
      particles = createParticles(params);
      simTime = 0;
    } else if (simTime >= HOLD_DURATION) {
      stepParticles(particles, params, dt);
    }

    const holding = simTime < HOLD_DURATION;
    drawFrame(ctx, params, particles, image, emoji, { holding });
    raf = requestAnimationFrame(frame);
  }

  return {
    reset,
    setImage(img, em) {
      image = img;
      emoji = em;
    },
    setParams(p, resetSim) {
      params = { ...p };
      ensureCanvasSize(canvas, ctx, params.width, params.height);
      if (resetSim) {
        particles = createParticles(params);
        simTime = 0;
        lastTs = 0;
      }
    },
    start() {
      if (running) return;
      running = true;
      lastTs = 0;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    isRunning: () => running,
    getParticles: () => particles,
  };
}
