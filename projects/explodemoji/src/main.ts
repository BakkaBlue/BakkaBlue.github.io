import './style.css';
import { getState, setState, subscribe } from './state';
import { SIM_KEYS, type AppParams } from './types';
import { mountLayout } from './ui/layout';
import { mountControls } from './ui/controls';
import { toast } from './ui/toast';
import { createPreview } from './render/preview';
import { loadEmojiImage } from './emoji/loader';
import { exportGif, downloadBlob, makeGifFilename } from './export/gif';

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('#app missing');

const { panel, canvas, exportBtn, progressEl } = mountLayout(root);
const preview = createPreview(canvas, getState());
const controls = mountControls(panel, (partial) => {
  setState(partial);
});

function needsSimReset(prev: AppParams, next: AppParams): boolean {
  return SIM_KEYS.some((k) => prev[k] !== next[k]);
}

let loadToken = 0;

async function loadCurrentEmoji(emoji: string): Promise<void> {
  const token = ++loadToken;
  const img = await loadEmojiImage(emoji);
  if (token !== loadToken) return;
  preview.setImage(img, emoji);
  if (!img) {
    toast('Twemoji 加载失败，已用系统 emoji 兜底', 'error');
  }
}

subscribe((state, prev) => {
  controls.sync(state);
  const reset = needsSimReset(prev, state);
  preview.setParams(state, reset);
  if (state.emoji !== prev.emoji) {
    void loadCurrentEmoji(state.emoji);
  }
});

// initial sync
controls.sync(getState());
void loadCurrentEmoji(getState().emoji).then(() => {
  preview.start();
});

let exporting = false;

exportBtn.addEventListener('click', async () => {
  if (exporting) return;
  exporting = true;
  exportBtn.disabled = true;
  progressEl.hidden = false;
  progressEl.textContent = '准备中…';

  const params = getState();
  try {
    const img = await loadEmojiImage(params.emoji);
    const blob = await exportGif(params, img, {
      onProgress: ({ frame, total }) => {
        progressEl.textContent = `${frame} / ${total}`;
      },
    });
    downloadBlob(blob, makeGifFilename(params));
    toast('GIF 已下载', 'ok');
  } catch (err) {
    console.error(err);
    toast(err instanceof Error ? err.message : '导出失败', 'error');
  } finally {
    exporting = false;
    exportBtn.disabled = false;
    progressEl.hidden = true;
    progressEl.textContent = '';
  }
});
