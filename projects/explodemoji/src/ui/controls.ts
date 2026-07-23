import type { AppParams, StyleId } from '../types';
import {
  STYLE_LABELS,
  STYLE_RECOMMENDED_GRAVITY,
  DEFAULT_PARAMS,
  PARAM_LIMITS,
  CANVAS_SIZES,
} from '../types';
import { mountPicker } from '../emoji/picker';

export interface ControlsApi {
  sync: (params: AppParams) => void;
}

type OnChange = (partial: Partial<AppParams>) => void;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function field(
  label: string,
  control: HTMLElement,
  hint?: string,
): HTMLElement {
  const wrap = el('label', 'field');
  const lab = el('span', 'field__label', label);
  wrap.append(lab, control);
  if (hint) wrap.append(el('span', 'field__hint', hint));
  return wrap;
}

function range(
  min: number,
  max: number,
  step: number,
  value: number,
  onInput: (v: number) => void,
): { root: HTMLElement; input: HTMLInputElement; valueEl: HTMLElement } {
  const root = el('div', 'range');
  const input = el('input') as HTMLInputElement;
  input.type = 'range';
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(value);
  const valueEl = el('span', 'range__value', formatNum(value));
  input.addEventListener('input', () => {
    const v = Number(input.value);
    valueEl.textContent = formatNum(v);
    onInput(v);
  });
  root.append(input, valueEl);
  return { root, input, valueEl };
}

function formatNum(v: number): string {
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(v < 1 ? 3 : 2).replace(/\.?0+$/, '');
}

export function mountControls(panel: HTMLElement, onChange: OnChange): ControlsApi {
  panel.innerHTML = '';
  panel.classList.add('controls');

  // —— Emoji ——
  const emojiSec = el('section', 'controls__section');
  emojiSec.append(el('h2', 'controls__h', 'Emoji'));
  const pickerHost = el('div');
  emojiSec.append(pickerHost);
  let picker = mountPicker(pickerHost, {
    selected: DEFAULT_PARAMS.emoji,
    onSelect: (emoji) => onChange({ emoji }),
  });

  // —— Style ——
  const styleSec = el('section', 'controls__section');
  styleSec.append(el('h2', 'controls__h', '爆炸样式'));
  const styleRow = el('div', 'style-grid');
  const styleButtons = new Map<StyleId, HTMLButtonElement>();
  (Object.keys(STYLE_LABELS) as StyleId[]).forEach((id) => {
    const btn = el('button', 'style-chip', STYLE_LABELS[id]) as HTMLButtonElement;
    btn.type = 'button';
    btn.dataset.style = id;
    btn.addEventListener('click', () => {
      onChange({ style: id, gravity: STYLE_RECOMMENDED_GRAVITY[id] });
    });
    styleButtons.set(id, btn);
    styleRow.appendChild(btn);
  });
  styleSec.append(styleRow);
  styleSec.append(
    el('p', 'field__hint', '切换样式会应用推荐重力，其它参数保持不变。'),
  );

  // —— Ranges ——
  const simSec = el('section', 'controls__section');
  simSec.append(el('h2', 'controls__h', '模拟参数'));

  const refs: Record<string, { input: HTMLInputElement; valueEl: HTMLElement }> = {};

  const bindRange = (
    parent: HTMLElement,
    key: keyof AppParams,
    label: string,
    min: number,
    max: number,
    step: number,
    def: number,
  ) => {
    const r = range(min, max, step, def, (v) => onChange({ [key]: v } as Partial<AppParams>));
    refs[key] = r;
    parent.append(field(label, r.root));
  };

  const L = PARAM_LIMITS;
  bindRange(
    simSec,
    'particleCount',
    '碎片数量',
    L.particleCount.min,
    L.particleCount.max,
    L.particleCount.step,
    DEFAULT_PARAMS.particleCount,
  );
  simSec.append(
    el(
      'p',
      'field__hint',
      '就近取整为 N×N 不规则碎块（最多约 20×20）；先定格 0.5s 再爆炸。',
    ),
  );
  bindRange(simSec, 'force', '力度', L.force.min, L.force.max, L.force.step, DEFAULT_PARAMS.force);
  simSec.append(el('p', 'field__hint', '推高力度 / 旋转可做出更爆的甩碎感。'));
  bindRange(
    simSec,
    'gravity',
    '重力',
    L.gravity.min,
    L.gravity.max,
    L.gravity.step,
    DEFAULT_PARAMS.gravity,
  );
  simSec.append(el('p', 'field__hint', '可为负：碎片向上飘散。'));
  bindRange(simSec, 'drag', '阻力', L.drag.min, L.drag.max, L.drag.step, DEFAULT_PARAMS.drag);
  bindRange(simSec, 'spin', '旋转', L.spin.min, L.spin.max, L.spin.step, DEFAULT_PARAMS.spin);
  bindRange(
    simSec,
    'scaleFrom',
    '缩放起',
    L.scaleFrom.min,
    L.scaleFrom.max,
    L.scaleFrom.step,
    DEFAULT_PARAMS.scaleFrom,
  );
  bindRange(
    simSec,
    'scaleTo',
    '缩放止',
    L.scaleTo.min,
    L.scaleTo.max,
    L.scaleTo.step,
    DEFAULT_PARAMS.scaleTo,
  );
  bindRange(
    simSec,
    'duration',
    '爆炸时长 (秒)',
    L.duration.min,
    L.duration.max,
    L.duration.step,
    DEFAULT_PARAMS.duration,
  );
  simSec.append(el('p', 'field__hint', '不含开场定格 0.5s；总时长 = 0.5 + 爆炸时长。'));

  // —— Export ——
  const expSec = el('section', 'controls__section');
  expSec.append(el('h2', 'controls__h', '导出 / 画布'));

  bindRange(expSec, 'fps', '导出 FPS', L.fps.min, L.fps.max, L.fps.step, DEFAULT_PARAMS.fps);

  const sizeSelect = el('select', 'select') as HTMLSelectElement;
  for (const s of CANVAS_SIZES) {
    const opt = el('option', undefined, `${s} × ${s}`) as HTMLOptionElement;
    opt.value = String(s);
    if (s === DEFAULT_PARAMS.width) opt.selected = true;
    sizeSelect.appendChild(opt);
  }
  sizeSelect.addEventListener('change', () => {
    const n = Number(sizeSelect.value);
    onChange({ width: n, height: n });
  });
  expSec.append(field('画布尺寸', sizeSelect));

  const colorInput = el('input') as HTMLInputElement;
  colorInput.type = 'color';
  colorInput.value = DEFAULT_PARAMS.background;
  colorInput.className = 'color-input';

  const transparentChk = el('input') as HTMLInputElement;
  transparentChk.type = 'checkbox';
  transparentChk.checked = DEFAULT_PARAMS.transparent;

  const bgRow = el('div', 'bg-row');
  bgRow.append(colorInput, transparentChk, el('span', undefined, '透明背景'));

  colorInput.addEventListener('input', () => {
    onChange({ background: colorInput.value, transparent: false });
    transparentChk.checked = false;
  });
  transparentChk.addEventListener('change', () => {
    onChange({ transparent: transparentChk.checked });
  });
  expSec.append(field('背景', bgRow, '透明 GIF 兼容性因查看器而异'));

  // —— Actions ——
  const actSec = el('section', 'controls__section controls__section--actions');
  const resetBtn = el('button', 'btn btn--ghost', '重置默认') as HTMLButtonElement;
  resetBtn.type = 'button';
  resetBtn.addEventListener('click', () => {
    onChange({ ...DEFAULT_PARAMS });
  });
  actSec.append(resetBtn);

  panel.append(emojiSec, styleSec, simSec, expSec, actSec);

  return {
    sync(params: AppParams) {
      picker.setSelected(params.emoji);
      for (const [id, btn] of styleButtons) {
        btn.classList.toggle('is-selected', id === params.style);
      }
      const setRange = (key: keyof AppParams) => {
        const r = refs[key];
        if (!r) return;
        const v = params[key] as number;
        r.input.value = String(v);
        r.valueEl.textContent = formatNum(v);
      };
      (
        [
          'particleCount',
          'force',
          'gravity',
          'drag',
          'spin',
          'scaleFrom',
          'scaleTo',
          'duration',
          'fps',
        ] as const
      ).forEach(setRange);

      sizeSelect.value = String(params.width);
      if (!params.transparent && params.background.startsWith('#')) {
        colorInput.value = params.background.slice(0, 7);
      }
      transparentChk.checked = params.transparent;
    },
  };
}
