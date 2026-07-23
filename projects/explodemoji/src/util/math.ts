export const TAU = Math.PI * 2;

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function smoothstep(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

export function polar(angle: number, speed: number): { x: number; y: number } {
  return {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  };
}
