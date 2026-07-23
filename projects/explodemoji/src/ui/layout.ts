export function mountLayout(root: HTMLElement): {
  panel: HTMLElement;
  previewWrap: HTMLElement;
  canvas: HTMLCanvasElement;
  exportBtn: HTMLButtonElement;
  progressEl: HTMLElement;
} {
  root.innerHTML = `
    <div class="app">
      <header class="app__header">
        <div class="brand">
          <span class="brand__mark" aria-hidden="true">💥</span>
          <div>
            <h1 class="brand__title">explodemoji</h1>
            <p class="brand__sub">选 emoji · 调爆炸 · 导出 GIF</p>
          </div>
        </div>
      </header>
      <main class="app__main">
        <aside class="panel" id="panel"></aside>
        <section class="preview-pane">
          <div class="preview-wrap" id="preview-wrap">
            <canvas id="preview-canvas" width="256" height="256" aria-label="爆炸预览"></canvas>
          </div>
          <div class="preview-actions">
            <button type="button" class="btn btn--primary" id="export-btn">导出 GIF</button>
            <span class="progress" id="export-progress" hidden></span>
          </div>
        </section>
      </main>
      <footer class="app__footer">
        <span>纯前端 · Twemoji · 静态可部署</span>
      </footer>
    </div>
  `;

  const panel = root.querySelector('#panel') as HTMLElement;
  const previewWrap = root.querySelector('#preview-wrap') as HTMLElement;
  const canvas = root.querySelector('#preview-canvas') as HTMLCanvasElement;
  const exportBtn = root.querySelector('#export-btn') as HTMLButtonElement;
  const progressEl = root.querySelector('#export-progress') as HTMLElement;

  return { panel, previewWrap, canvas, exportBtn, progressEl };
}
