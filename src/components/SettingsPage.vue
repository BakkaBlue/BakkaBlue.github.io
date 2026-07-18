<template>
  <section class="settings-page">
    <div class="settings-shell">
      <header class="settings-header">
        <div>
          <p class="kicker">Hidden · /settings</p>
          <h1>主题预设</h1>
          <p class="sub">
            无导航入口。直接访问
            <code>/settings</code>
            即可切换整站气质，选择会保存在本机。
          </p>
        </div>
        <button class="back-btn" type="button" @click="backHome">← 返回主页</button>
      </header>

      <div class="preset-grid">
        <button
          v-for="item in presets"
          :key="item.id"
          type="button"
          class="preset-card"
          :class="{ active: item.id === presetId }"
          @click="setPreset(item.id)"
        >
          <div class="preset-top">
            <span class="preset-tag">{{ item.tagline }}</span>
            <span v-if="item.id === presetId" class="preset-badge">使用中</span>
          </div>
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
          <ul class="flags">
            <li>粒子：{{ densityLabel(item.particleDensity) }}{{ item.particles ? '' : '（关）' }}</li>
            <li>光标特效：{{ item.cursor ? '开' : '关' }}</li>
            <li>噪声层：{{ item.noise ? item.noiseStrength : '关' }}</li>
            <li>指针扰动：{{ item.particlePointer ? '开' : '关' }}</li>
          </ul>
        </button>
      </div>

      <div class="settings-note glass-card">
        <p>
          当前预设：
          <strong>{{ preset.name }}</strong>
        </p>
        <p class="muted">
          日/夜模式仍由主页右上角按钮控制；这里只切换整体风格预设。
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAppRoute } from '@/composables/useAppRoute'
import { useStylePreset } from '@/composables/useStylePreset'
import type { StylePreset } from '@/presets/stylePresets'

const { backHome } = useAppRoute()
const { presetId, preset, presets, setPreset } = useStylePreset()

function densityLabel(d: StylePreset['particleDensity']) {
  if (d === 'sparse') return '稀疏'
  if (d === 'dense') return '密集'
  return '适中'
}
</script>

<style scoped>
.settings-page {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 96px 24px 72px;
}

.settings-shell {
  width: min(100%, 980px);
  margin: 0 auto;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 36px;
}

.kicker {
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}

h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  letter-spacing: -0.04em;
  margin-bottom: 12px;
}

.sub {
  max-width: 48ch;
  color: var(--text-secondary);
  line-height: 1.7;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.92em;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 1px 6px;
}

.back-btn {
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-secondary);
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
  transition: 0.25s ease;
  white-space: nowrap;
}

.back-btn:hover {
  color: var(--text-primary);
  background: var(--glass-bg-hover);
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.preset-card {
  text-align: left;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 22px 20px;
  color: inherit;
  cursor: pointer;
  transition: 0.28s ease;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preset-card:hover {
  border-color: var(--glass-border-hover);
  background: var(--glass-bg-hover);
  transform: translateY(-2px);
}

.preset-card.active {
  border-color: color-mix(in srgb, var(--accent) 55%, var(--glass-border));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 25%, transparent), 0 18px 40px rgba(0, 0, 0, 0.25);
}

.preset-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.preset-tag {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.preset-badge {
  font-size: 0.72rem;
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  border-radius: 999px;
  padding: 3px 8px;
}

.preset-card h2 {
  font-size: 1.2rem;
  letter-spacing: -0.02em;
}

.preset-card p {
  color: var(--text-secondary);
  font-size: 0.94rem;
  line-height: 1.65;
  flex: 1;
}

.flags {
  list-style: none;
  display: grid;
  gap: 6px;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.settings-note {
  padding: 18px 20px;
}

.settings-note p {
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.settings-note .muted {
  color: var(--text-muted);
  margin-bottom: 0;
  font-size: 0.92rem;
}

@media (max-width: 900px) {
  .preset-grid {
    grid-template-columns: 1fr;
  }

  .settings-header {
    flex-direction: column;
  }
}
</style>
