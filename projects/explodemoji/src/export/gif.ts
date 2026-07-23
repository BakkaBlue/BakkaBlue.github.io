import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import type { AppParams } from '../types';
import { HOLD_DURATION, cycleDuration } from '../types';
import { createParticles, stepParticles } from '../particles/simulator';
import { drawFrame } from '../render/canvas';
import { emojiToCodepoint } from '../emoji/loader';

export interface ExportProgress {
  frame: number;
  total: number;
}

export interface ExportOptions {
  onProgress?: (p: ExportProgress) => void;
  signal?: AbortSignal;
}

/** gifenc `delay` is milliseconds; the encoder converts to GIF centiseconds. */
export async function exportGif(
  params: AppParams,
  image: ImageBitmap | null,
  options: ExportOptions = {},
): Promise<Blob> {
  const { onProgress, signal } = options;
  const fps = Math.max(5, Math.min(60, Math.round(params.fps)));
  const totalSec = cycleDuration(params);
  const totalFrames = Math.max(1, Math.round(totalSec * fps));
  const dt = 1 / fps;
  const delayMs = Math.round(1000 / fps);

  const canvas = document.createElement('canvas');
  canvas.width = params.width;
  canvas.height = params.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2d context unavailable');

  const particles = createParticles(params);
  const gif = GIFEncoder();

  const transparent = params.transparent;
  const keyRgb: [number, number, number] = [255, 0, 255];

  let simTime = 0;

  for (let i = 0; i < totalFrames; i++) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    if (transparent) {
      ctx.fillStyle = `rgb(${keyRgb[0]},${keyRgb[1]},${keyRgb[2]})`;
      ctx.fillRect(0, 0, params.width, params.height);
    }

    const holding = simTime < HOLD_DURATION;
    drawFrame(ctx, params, particles, image, params.emoji, { holding });

    const { data, width, height } = ctx.getImageData(0, 0, params.width, params.height);

    if (transparent) {
      for (let p = 0; p < data.length; p += 4) {
        const a = data[p + 3];
        const r = data[p];
        const g = data[p + 1];
        const b = data[p + 2];
        const isKey =
          Math.abs(r - keyRgb[0]) < 8 &&
          Math.abs(g - keyRgb[1]) < 8 &&
          Math.abs(b - keyRgb[2]) < 8;
        if (a < 16 || isKey) {
          data[p] = keyRgb[0];
          data[p + 1] = keyRgb[1];
          data[p + 2] = keyRgb[2];
          data[p + 3] = 255;
        }
      }
    }

    const palette = transparent
      ? quantize(data, 256, { format: 'rgb565' })
      : quantize(data, 256);
    const index = applyPalette(data, palette);

    let transparentIndex: number | undefined;
    if (transparent) {
      transparentIndex = findNearestPaletteIndex(palette, keyRgb);
    }

    gif.writeFrame(index, width, height, {
      palette,
      delay: delayMs,
      transparent: transparentIndex !== undefined,
      transparentIndex: transparentIndex ?? 0,
      dispose: 2,
    });

    simTime += dt;
    if (simTime >= HOLD_DURATION) {
      stepParticles(particles, params, dt);
    }

    onProgress?.({ frame: i + 1, total: totalFrames });

    if (i % 4 === 3) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  gif.finish();
  const bytes = gif.bytes();
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy], { type: 'image/gif' });
}

function findNearestPaletteIndex(
  palette: number[][] | Uint8Array[] | ArrayLike<number>[],
  rgb: [number, number, number],
): number {
  let best = 0;
  let bestDist = Infinity;
  const len = palette.length;
  for (let i = 0; i < len; i++) {
    const c = palette[i] as ArrayLike<number>;
    const dr = (c[0] as number) - rgb[0];
    const dg = (c[1] as number) - rgb[1];
    const db = (c[2] as number) - rgb[2];
    const d = dr * dr + dg * dg + db * db;
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function makeGifFilename(params: AppParams): string {
  const cp = emojiToCodepoint(params.emoji) || 'emoji';
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `explodemoji-${cp}-${params.style}-${ts}.gif`;
}
