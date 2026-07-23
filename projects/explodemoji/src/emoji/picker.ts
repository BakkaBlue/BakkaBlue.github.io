import { PRESET_EMOJIS } from '../emoji/presets';

export interface PickerOptions {
  selected: string;
  onSelect: (emoji: string) => void;
}

export function mountPicker(root: HTMLElement, opts: PickerOptions): {
  setSelected: (emoji: string) => void;
} {
  root.innerHTML = '';
  root.classList.add('emoji-picker');

  const inputRow = document.createElement('div');
  inputRow.className = 'emoji-picker__input-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'emoji-picker__input';
  input.placeholder = '粘贴 emoji…';
  input.maxLength = 16;
  input.value = opts.selected;
  input.setAttribute('aria-label', '自定义 emoji');

  const applyBtn = document.createElement('button');
  applyBtn.type = 'button';
  applyBtn.className = 'btn btn--ghost';
  applyBtn.textContent = '应用';

  inputRow.append(input, applyBtn);

  const grid = document.createElement('div');
  grid.className = 'emoji-picker__grid';
  grid.setAttribute('role', 'listbox');
  grid.setAttribute('aria-label', '热门 emoji');

  const buttons = new Map<string, HTMLButtonElement>();

  function highlight(emoji: string): void {
    for (const [e, btn] of buttons) {
      btn.classList.toggle('is-selected', e === emoji);
      btn.setAttribute('aria-selected', e === emoji ? 'true' : 'false');
    }
    input.value = emoji;
  }

  for (const emoji of PRESET_EMOJIS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'emoji-picker__cell';
    btn.textContent = emoji;
    btn.title = emoji;
    btn.setAttribute('role', 'option');
    btn.addEventListener('click', () => {
      highlight(emoji);
      opts.onSelect(emoji);
    });
    buttons.set(emoji, btn);
    grid.appendChild(btn);
  }

  const applyCustom = () => {
    const raw = input.value.trim();
    // take first grapheme cluster roughly via segmenter if available
    let emoji = raw;
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
      const first = [...seg.segment(raw)][0];
      if (first) emoji = first.segment;
    } else if (raw) {
      emoji = [...raw][0] ?? raw;
    }
    if (!emoji) return;
    highlight(emoji);
    opts.onSelect(emoji);
  };

  applyBtn.addEventListener('click', applyCustom);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyCustom();
    }
  });

  root.append(inputRow, grid);
  highlight(opts.selected);

  return {
    setSelected: highlight,
  };
}
