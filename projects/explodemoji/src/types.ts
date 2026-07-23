export type StyleId = 'burst' | 'fountain' | 'spiral' | 'shatter';

export interface AppParams {
  emoji: string;
  style: StyleId;
  /** Target shard count; actual count snaps to a square grid (side²). */
  particleCount: number;
  force: number;
  gravity: number;
  drag: number;
  spin: number;
  scaleFrom: number;
  scaleTo: number;
  /** Explosion phase length (seconds), after hold. */
  duration: number;
  fps: number;
  width: number;
  height: number;
  /** CSS color, or empty string / 'transparent' for transparent GIF bg */
  background: string;
  transparent: boolean;
  seed: number;
}

export interface UvPoint {
  u: number;
  v: number;
}

export interface Particle {
  x: number;
  y: number;
  /** Depth: +z toward camera (appears larger). */
  z: number;
  vx: number;
  vy: number;
  vz: number;
  /** Spin in the screen plane (radians). */
  rotation: number;
  angularVel: number;
  /** Tilt for 2.5D tumble. */
  rotX: number;
  rotY: number;
  angularVelX: number;
  angularVelY: number;
  scale: number;
  alpha: number;
  /** Time since explosion started (not including hold). */
  age: number;
  /** Lifetime of explode phase. */
  life: number;
  scaleMul: number;
  /** Irregular polygon in UV space (usually 4 corners, clockwise). */
  uvPoly: UvPoint[];
  /**
   * Polygon vertices in particle-local space at scale=1
   * (relative to particle position = UV centroid in world).
   */
  localPoly: { x: number; y: number }[];
}

export type StyleInit = (
  particles: Particle[],
  params: AppParams,
  rng: () => number,
) => void;

export const STYLE_LABELS: Record<StyleId, string> = {
  burst: 'Burst 径向爆炸',
  fountain: 'Fountain 喷泉',
  spiral: 'Spiral 螺旋',
  shatter: 'Shatter 碎裂',
};

export const STYLE_RECOMMENDED_GRAVITY: Record<StyleId, number> = {
  burst: 780,
  fountain: 920,
  spiral: 560,
  shatter: 1050,
};

/** Intact emoji hold before shards fly (seconds). */
export const HOLD_DURATION = 0.5;

/** Perspective focal length as fraction of min(canvas side). */
export const PERSPECTIVE_FOCAL_FRAC = 1.35;

/** Slider / clamp limits — wide for high-tension effects. */
export const PARAM_LIMITS = {
  particleCount: { min: 4, max: 400, step: 1 },
  force: { min: 0.1, max: 8, step: 0.05 },
  gravity: { min: -800, max: 4000, step: 20 },
  drag: { min: 0, max: 0.15, step: 0.001 },
  spin: { min: 0, max: 10, step: 0.05 },
  scaleFrom: { min: 0.1, max: 4, step: 0.05 },
  scaleTo: { min: 0.05, max: 4, step: 0.05 },
  duration: { min: 0.3, max: 6, step: 0.1 },
  fps: { min: 8, max: 60, step: 1 },
} as const;

export const CANVAS_SIZES = [128, 256, 384, 512, 768, 1024] as const;

export const DEFAULT_PARAMS: AppParams = {
  emoji: '💥',
  style: 'burst',
  particleCount: 49,
  force: 2,
  gravity: 780,
  drag: 0.012,
  spin: 2.2,
  scaleFrom: 1.05,
  scaleTo: 0.5,
  duration: 2.1,
  fps: 24,
  width: 256,
  height: 256,
  background: '#12121a',
  transparent: false,
  seed: 42,
};

/** Params that require particle reset when changed */
export const SIM_KEYS: (keyof AppParams)[] = [
  'emoji',
  'style',
  'particleCount',
  'force',
  'gravity',
  'drag',
  'spin',
  'scaleFrom',
  'scaleTo',
  'duration',
  'width',
  'height',
  'seed',
];

/** Full emoji size as fraction of min(canvas width, height). */
export const EMOJI_SIZE_FRAC = 0.48;

export function cycleDuration(params: AppParams): number {
  return HOLD_DURATION + Math.max(0.2, params.duration);
}
