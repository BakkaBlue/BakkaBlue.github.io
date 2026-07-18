import { computed, ref } from 'vue'
import {
  PRESET_LIST,
  STYLE_PRESETS,
  type StylePreset,
  type StylePresetId,
} from '@/presets/stylePresets'

const STORAGE_KEY = 'cyan-style-preset'
const presetId = ref<StylePresetId>('quiet')
let booted = false

function isPresetId(v: string | null): v is StylePresetId {
  return v === 'quiet' || v === 'glass' || v === 'max'
}

function applyDom(id: StylePresetId) {
  const p = STYLE_PRESETS[id]
  document.documentElement.dataset.style = p.styleAttr
  document.documentElement.classList.toggle('has-custom-cursor', p.cursor)
}

function persist(id: StylePresetId) {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* ignore */
  }
}

function boot() {
  if (booted) return
  booted = true
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isPresetId(saved)) {
      presetId.value = saved
    }
  } catch {
    /* ignore */
  }
  applyDom(presetId.value)
}

export function useStylePreset() {
  boot()

  const preset = computed<StylePreset>(() => STYLE_PRESETS[presetId.value])
  const presets = PRESET_LIST

  function setPreset(id: StylePresetId) {
    if (!STYLE_PRESETS[id]) return
    presetId.value = id
    applyDom(id)
    persist(id)
  }

  return {
    presetId,
    preset,
    presets,
    setPreset,
  }
}
