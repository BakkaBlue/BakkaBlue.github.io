<template>
  <Teleport to="body">
    <Transition name="settings-fade">
      <div
        v-if="panelOpen"
        class="settings-scrim"
        @click.self="closePanel"
      >
        <aside
          ref="panelRef"
          class="settings-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="theme-settings-title"
          tabindex="-1"
          @keydown.esc.stop.prevent="closePanel"
        >
          <header class="panel-head">
            <div>
              <h2 id="theme-settings-title">主题设置</h2>
              <p>调整外观和布局以适应您的偏好。每个用户配置可独立持久化。</p>
            </div>
            <button class="icon-btn" type="button" aria-label="关闭" @click="closePanel">✕</button>
          </header>

          <div class="panel-scroll">
            <!-- Profiles -->
            <section class="block">
              <div class="block-label">
                <span>用户配置</span>
                <span class="hint">按用户持久化</span>
              </div>
              <div class="profile-row">
                <button
                  v-for="p in profiles"
                  :key="p.id"
                  type="button"
                  class="profile-chip"
                  :class="{ active: p.id === activeProfile.id }"
                  @click="switchProfile(p.id)"
                >
                  <span class="avatar">{{ p.name.slice(0, 1) }}</span>
                  <span class="pname">{{ p.name }}</span>
                </button>
                <button type="button" class="profile-add" title="新增用户配置" @click="onAddProfile">
                  +
                </button>
              </div>
              <div class="profile-edit">
                <input
                  v-model="editName"
                  type="text"
                  maxlength="24"
                  :placeholder="activeProfile.name"
                  @change="commitRename"
                  @keydown.enter.prevent="commitRename"
                />
                <button type="button" class="ghost-btn" @click="onDuplicate">复制</button>
                <button
                  type="button"
                  class="ghost-btn danger"
                  :disabled="profiles.length <= 1"
                  @click="onRemove"
                >
                  删除
                </button>
              </div>
            </section>

            <!-- Theme mode -->
            <section class="block">
              <div class="block-label">
                <span>主题</span>
              </div>
              <div class="mode-grid">
                <button
                  v-for="opt in themeModes"
                  :key="opt.id"
                  type="button"
                  class="mode-card"
                  :class="[opt.id, { active: settings.themeMode === opt.id }]"
                  @click="setThemeMode(opt.id)"
                >
                  <span class="mode-preview" :aria-hidden="true">
                    <span class="mode-bar"></span>
                    <span class="mode-lines">
                      <i></i><i></i><i></i>
                    </span>
                    <span class="mode-dot"></span>
                  </span>
                  <span class="mode-name">{{ opt.label }}</span>
                </button>
              </div>
            </section>

            <!-- Color presets -->
            <section class="block">
              <div class="block-label">
                <span>颜色预设</span>
              </div>
              <div class="swatch-grid">
                <button
                  v-for="preset in colorPresets"
                  :key="preset.id"
                  type="button"
                  class="swatch"
                  :class="{ active: settings.colorPreset === preset.id }"
                  :title="preset.label"
                  :aria-label="preset.label"
                  :aria-pressed="settings.colorPreset === preset.id"
                  @click="setColorPreset(preset.id)"
                >
                  <span class="swatch-face" :style="{ background: preset.swatch }"></span>
                  <span class="swatch-label">{{ preset.label }}</span>
                </button>
              </div>
            </section>

            <!-- Font -->
            <section class="block">
              <div class="block-label">
                <span>字体</span>
              </div>
              <div class="option-row">
                <button
                  v-for="opt in fontOptions"
                  :key="opt.id"
                  type="button"
                  class="pill"
                  :class="{ active: settings.font === opt.id, serif: opt.id === 'serif' }"
                  @click="setFont(opt.id)"
                >
                  <span class="pill-sample">{{ opt.sample }}</span>
                  <span class="pill-label">{{ opt.label }}</span>
                </button>
              </div>
            </section>

            <!-- Radius -->
            <section class="block">
              <div class="block-label">
                <span>圆角</span>
              </div>
              <div class="option-row radius-row">
                <button
                  v-for="opt in radiusOptions"
                  :key="String(opt.id)"
                  type="button"
                  class="radius-opt"
                  :class="{ active: settings.radius === opt.id }"
                  :title="opt.label"
                  @click="setRadius(opt.id)"
                >
                  <span
                    class="radius-shape"
                    :style="{ borderRadius: radiusPreview(opt.id) }"
                  ></span>
                  <span class="radius-label">{{ opt.label }}</span>
                </button>
              </div>
            </section>

            <!-- Density -->
            <section class="block">
              <div class="block-label">
                <span>密度</span>
              </div>
              <div class="option-row density-row">
                <button
                  v-for="opt in densityOptions"
                  :key="opt.id"
                  type="button"
                  class="density-opt"
                  :class="{ active: settings.density === opt.id }"
                  @click="setDensity(opt.id)"
                >
                  <span class="density-lines" :data-density="opt.id" aria-hidden="true">
                    <i></i><i></i><i></i>
                  </span>
                  <span class="density-label">{{ opt.label }}</span>
                </button>
              </div>
            </section>
          </div>

          <footer class="panel-foot">
            <button type="button" class="reset-btn" @click="resetAppearance">重置</button>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'
import {
  DENSITY_OPTIONS,
  FONT_OPTIONS,
  RADIUS_OPTIONS,
  type RadiusChoice,
  type ThemeMode,
} from '@/data/appearancePresets'
import { useAppearance } from '@/composables/useAppearance'

const {
  panelOpen,
  settings,
  profiles,
  activeProfile,
  colorPresets,
  closePanel,
  setThemeMode,
  setColorPreset,
  setFont,
  setRadius,
  setDensity,
  resetAppearance,
  switchProfile,
  renameProfile,
  addProfile,
  duplicateActiveProfile,
  removeProfile,
} = useAppearance()

const themeModes: { id: ThemeMode; label: string }[] = [
  { id: 'system', label: '系统' },
  { id: 'light', label: '浅色' },
  { id: 'dark', label: '深色' },
]

const fontOptions = FONT_OPTIONS
const radiusOptions = RADIUS_OPTIONS
const densityOptions = DENSITY_OPTIONS

const editName = ref('')
const panelRef = ref<HTMLElement | null>(null)

watch(
  () => activeProfile.value?.id,
  () => {
    editName.value = activeProfile.value?.name ?? ''
  },
  { immediate: true },
)

watch(panelOpen, async (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    editName.value = activeProfile.value?.name ?? ''
    await nextTick()
    panelRef.value?.focus()
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

function commitRename() {
  renameProfile(activeProfile.value.id, editName.value)
  editName.value = activeProfile.value.name
}

function onAddProfile() {
  const p = addProfile()
  editName.value = p.name
}

function onDuplicate() {
  const p = duplicateActiveProfile()
  editName.value = p.name
}

function onRemove() {
  if (profiles.value.length <= 1) return
  if (!confirm(`删除用户配置「${activeProfile.value.name}」？此操作不可撤销。`)) return
  removeProfile(activeProfile.value.id)
  editName.value = activeProfile.value.name
}

function radiusPreview(choice: RadiusChoice): string {
  if (choice === 'auto') return '12px'
  if (choice === 0) return '2px'
  return `${Math.round(choice * 16)}px`
}
</script>

<style scoped>
.settings-scrim {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.36);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.settings-panel {
  width: min(420px, 100vw);
  height: 100%;
  display: flex;
  flex-direction: column;
  background: color-mix(in srgb, var(--bg-elevated) 96%, transparent);
  border-left: 1px solid var(--border);
  box-shadow: var(--shadow);
  color: var(--text-primary);
  backdrop-filter: saturate(160%) blur(18px);
  -webkit-backdrop-filter: saturate(160%) blur(18px);
  outline: none;
}

.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 22px 22px 14px;
  border-bottom: 1px solid var(--border);
}

.panel-head h2 {
  font-size: 1.15rem;
  font-weight: 650;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.panel-head p {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.45;
  max-width: 30ch;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-soft);
  color: var(--text-secondary);
  cursor: pointer;
  flex-shrink: 0;
  transition: 0.2s var(--ease-out);
}

.icon-btn:hover {
  background: var(--bg-soft-hover);
  color: var(--text-primary);
}

.panel-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px 18px 24px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.block-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--text-primary);
}

.block-label .hint {
  margin-left: auto;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--bg-soft);
  padding: 2px 8px;
  border-radius: 999px;
}

/* Profiles */
.profile-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.profile-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px 0 6px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg-soft);
  color: var(--text-secondary);
  cursor: pointer;
  transition: 0.2s var(--ease-out);
}

.profile-chip:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.profile-chip.active {
  border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
  background: var(--accent-soft);
  color: var(--accent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 25%, transparent);
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(180deg, var(--accent), color-mix(in srgb, var(--accent) 65%, #000));
}

.pname {
  font-size: 0.82rem;
  font-weight: 500;
  max-width: 9ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-add {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px dashed var(--border-strong);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  transition: 0.2s var(--ease-out);
}

.profile-add:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-soft);
}

.profile-edit {
  display: flex;
  gap: 8px;
  align-items: center;
}

.profile-edit input {
  flex: 1;
  min-width: 0;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-soft);
  color: var(--text-primary);
  font: inherit;
  font-size: 0.84rem;
  outline: none;
}

.profile-edit input:focus {
  border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.ghost-btn {
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-soft);
  color: var(--text-secondary);
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.2s var(--ease-out);
}

.ghost-btn:hover:not(:disabled) {
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.ghost-btn.danger:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--danger) 50%, var(--border));
  color: var(--danger);
  background: color-mix(in srgb, var(--danger) 10%, transparent);
}

.ghost-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Theme mode cards */
.mode-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.mode-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border-radius: 14px;
  border: 1.5px solid var(--border);
  background: var(--bg-soft);
  cursor: pointer;
  color: var(--text-secondary);
  transition: 0.2s var(--ease-out);
}

.mode-card:hover {
  border-color: var(--border-strong);
}

.mode-card.active {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent);
  color: var(--text-primary);
}

.mode-preview {
  position: relative;
  height: 56px;
  border-radius: 10px;
  border: 1px solid var(--border);
  overflow: hidden;
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 6px;
  padding: 6px;
}

.mode-card.system .mode-preview {
  background: linear-gradient(90deg, #1c1c1e 50%, #f5f5f7 50%);
}

.mode-card.light .mode-preview {
  background: #f5f5f7;
}

.mode-card.dark .mode-preview {
  background: #1c1c1e;
}

.mode-bar {
  border-radius: 4px;
  background: color-mix(in srgb, currentColor 18%, transparent);
}

.mode-card.system .mode-bar {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(0, 0, 0, 0.08));
}

.mode-card.light .mode-bar {
  background: rgba(0, 0, 0, 0.08);
}

.mode-card.dark .mode-bar {
  background: rgba(255, 255, 255, 0.1);
}

.mode-lines {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-top: 2px;
}

.mode-lines i {
  display: block;
  height: 5px;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 22%, transparent);
}

.mode-card.light .mode-lines i {
  background: rgba(0, 0, 0, 0.12);
}

.mode-card.dark .mode-lines i {
  background: rgba(255, 255, 255, 0.16);
}

.mode-card.system .mode-lines i {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.12));
}

.mode-lines i:nth-child(2) {
  width: 70%;
}

.mode-lines i:nth-child(3) {
  width: 48%;
}

.mode-dot {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent);
}

.mode-name {
  font-size: 0.78rem;
  font-weight: 500;
  text-align: center;
}

/* Color swatches */
.swatch-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: var(--text-muted);
  padding: 0;
}

.swatch-face {
  width: 100%;
  aspect-ratio: 1.5 / 1;
  border-radius: 12px;
  border: 2px solid transparent;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
  transition: 0.2s var(--ease-out);
}

.swatch:hover .swatch-face {
  transform: translateY(-1px);
}

.swatch.active .swatch-face {
  border-color: var(--accent);
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent),
    inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.swatch-label {
  font-size: 0.7rem;
  line-height: 1.2;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.swatch.active .swatch-label {
  color: var(--text-primary);
  font-weight: 600;
}

/* Font / shared pills */
.option-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 64px;
  padding: 10px 8px;
  border-radius: 14px;
  border: 1.5px solid var(--border);
  background: var(--bg-soft);
  color: var(--text-secondary);
  cursor: pointer;
  transition: 0.2s var(--ease-out);
}

.pill:hover {
  border-color: var(--border-strong);
}

.pill.active {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent);
  color: var(--text-primary);
  background: var(--accent-soft);
}

.pill-sample {
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1;
}

.pill.serif .pill-sample {
  font-family: 'Noto Serif SC', Georgia, serif;
}

.pill-label {
  font-size: 0.72rem;
}

/* Radius */
.radius-row {
  grid-template-columns: repeat(6, 1fr);
}

.radius-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 4px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  background: var(--bg-soft);
  color: var(--text-muted);
  cursor: pointer;
  transition: 0.2s var(--ease-out);
}

.radius-opt:hover {
  border-color: var(--border-strong);
}

.radius-opt.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--text-primary);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent);
}

.radius-shape {
  width: 28px;
  height: 22px;
  border: 2px solid currentColor;
  opacity: 0.75;
}

.radius-label {
  font-size: 0.68rem;
}

/* Density */
.density-row {
  grid-template-columns: repeat(4, 1fr);
}

.density-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 6px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  background: var(--bg-soft);
  color: var(--text-muted);
  cursor: pointer;
  transition: 0.2s var(--ease-out);
}

.density-opt:hover {
  border-color: var(--border-strong);
}

.density-opt.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--text-primary);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent);
}

.density-lines {
  display: flex;
  flex-direction: column;
  width: 28px;
  gap: 4px;
}

.density-lines i {
  display: block;
  height: 3px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.7;
}

.density-lines[data-density='compact'] {
  gap: 2px;
}

.density-lines[data-density='cozy'] {
  gap: 3px;
}

.density-lines[data-density='comfortable'] {
  gap: 5px;
}

.density-lines[data-density='spacious'] {
  gap: 7px;
}

.density-label {
  font-size: 0.7rem;
}

.panel-foot {
  padding: 14px 18px 18px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
}

.reset-btn {
  min-height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg-soft);
  color: var(--text-secondary);
  font-size: 0.84rem;
  cursor: pointer;
  transition: 0.2s var(--ease-out);
}

.reset-btn:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
  background: var(--bg-soft-hover);
}

/* transitions */
.settings-fade-enter-active,
.settings-fade-leave-active {
  transition: opacity 0.22s var(--ease-out);
}

.settings-fade-enter-active .settings-panel,
.settings-fade-leave-active .settings-panel {
  transition: transform 0.28s var(--ease-out);
}

.settings-fade-enter-from,
.settings-fade-leave-to {
  opacity: 0;
}

.settings-fade-enter-from .settings-panel,
.settings-fade-leave-to .settings-panel {
  transform: translateX(18px);
}

@media (max-width: 520px) {
  .settings-panel {
    width: 100vw;
  }

  .swatch-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .radius-row {
    grid-template-columns: repeat(3, 1fr);
  }

  .density-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
