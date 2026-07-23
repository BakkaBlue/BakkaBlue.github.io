const TWEMOJI_BASE =
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72';

const cache = new Map<string, ImageBitmap | null>();
const inflight = new Map<string, Promise<ImageBitmap | null>>();

/** Convert emoji grapheme to Twemoji filename codepoint path. */
export function emojiToCodepoint(emoji: string): string {
  const cps: string[] = [];
  for (const ch of emoji) {
    const cp = ch.codePointAt(0);
    if (cp === undefined) continue;
    // skip variation selector-16 (fe0f) — Twemoji paths usually omit it
    if (cp === 0xfe0f) continue;
    cps.push(cp.toString(16));
  }
  return cps.join('-');
}

export function twemojiUrl(emoji: string): string {
  return `${TWEMOJI_BASE}/${emojiToCodepoint(emoji)}.png`;
}

export async function loadEmojiImage(emoji: string): Promise<ImageBitmap | null> {
  const key = emoji;
  if (cache.has(key)) return cache.get(key)!;
  if (inflight.has(key)) return inflight.get(key)!;

  const promise = (async () => {
    try {
      const res = await fetch(twemojiUrl(emoji), { mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);
      cache.set(key, bitmap);
      return bitmap;
    } catch {
      cache.set(key, null);
      return null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
}

export function getCachedEmojiImage(emoji: string): ImageBitmap | null | undefined {
  return cache.get(emoji);
}
