import type { AppParams, Particle } from '../types';
import { EMOJI_SIZE_FRAC, PERSPECTIVE_FOCAL_FRAC } from '../types';
import { clamp } from '../util/math';

export interface DrawOptions {
  /** When true, draw one intact emoji (pre-explosion hold). */
  holding?: boolean;
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  params: AppParams,
  particles: Particle[],
  image: ImageBitmap | null,
  emojiFallback: string,
  options: DrawOptions = {},
): void {
  const { width, height, background, transparent } = params;

  ctx.clearRect(0, 0, width, height);

  if (!transparent && background && background !== 'transparent') {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }

  const fullSize = Math.min(width, height) * EMOJI_SIZE_FRAC;
  const cx = width / 2;
  const cy = height / 2;
  const focal = Math.min(width, height) * PERSPECTIVE_FOCAL_FRAC;

  if (options.holding) {
    drawIntactEmoji(ctx, cx, cy, fullSize * params.scaleFrom, image, emojiFallback);
    return;
  }

  // Far (small / -z) first → near (large / +z) last for correct occlusion
  const ordered = particles
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => p.alpha > 0.01)
    .sort((a, b) => a.p.z - b.p.z || a.i - b.i);

  for (const { p } of ordered) {
    // perspective: +z toward camera → larger & more foreshortened from center
    const zClamped = clamp(p.z, -focal * 0.55, focal * 0.72);
    const persp = focal / (focal - zClamped);
    const sx = cx + (p.x - cx) * persp;
    const sy = cy + (p.y - cy) * persp;
    const s = p.scale * persp;

    // depth cue: far shards slightly dimmer
    const depthAlpha = clamp(0.55 + (zClamped / focal) * 0.55, 0.45, 1);
    const tiltY = Math.cos(p.rotY);
    const tiltX = Math.cos(p.rotX);
    // foreshorten when tumbling edge-on
    const face = clamp(Math.abs(tiltX * tiltY), 0.22, 1);

    ctx.save();
    ctx.globalAlpha = p.alpha * depthAlpha;
    ctx.translate(sx, sy);
    ctx.rotate(p.rotation);
    // approximate 3D tumble with non-uniform scale
    ctx.scale(s * (0.55 + 0.45 * Math.abs(Math.cos(p.rotY))), s * face);

    const poly = p.localPoly;
    if (poly.length >= 3) {
      ctx.beginPath();
      ctx.moveTo(poly[0].x, poly[0].y);
      for (let i = 1; i < poly.length; i++) {
        ctx.lineTo(poly[i].x, poly[i].y);
      }
      ctx.closePath();
      ctx.clip();
    }

    const midU =
      p.uvPoly.reduce((a, q) => a + q.u, 0) / Math.max(1, p.uvPoly.length);
    const midV =
      p.uvPoly.reduce((a, q) => a + q.v, 0) / Math.max(1, p.uvPoly.length);
    const emojiCenterX = (0.5 - midU) * fullSize;
    const emojiCenterY = (0.5 - midV) * fullSize;

    if (image) {
      ctx.drawImage(
        image,
        emojiCenterX - fullSize / 2,
        emojiCenterY - fullSize / 2,
        fullSize,
        fullSize,
      );
    } else {
      ctx.font = `${Math.max(12, fullSize)}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emojiFallback, emojiCenterX, emojiCenterY);
    }

    ctx.restore();
  }
}

function drawIntactEmoji(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  image: ImageBitmap | null,
  emojiFallback: string,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  if (image) {
    ctx.drawImage(image, -size / 2, -size / 2, size, size);
  } else {
    ctx.font = `${Math.max(12, size)}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emojiFallback, 0, 0);
  }
  ctx.restore();
}

export function ensureCanvasSize(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  void ctx;
}
