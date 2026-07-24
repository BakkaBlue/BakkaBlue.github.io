<template>
  <header class="topbar" :class="{ scrolled: isScrolled }">
    <div class="left">
      <span class="crumb">Cyan</span>
      <span class="sep" aria-hidden="true">/</span>
      <span class="current">{{ pageTitle }}</span>
    </div>

    <div class="actions">
      <button
        class="settings-btn"
        type="button"
        aria-label="主题设置"
        title="主题设置"
        @click="openPanel"
      >
        <span class="gear" aria-hidden="true">⚙</span>
      </button>

      <button
        class="theme-switch"
        type="button"
        role="switch"
        :aria-checked="isDark"
        :aria-label="isDark ? '切换到日间模式' : '切换到夜间模式'"
        :title="isDark ? '切换到日间模式' : '切换到夜间模式'"
        @click="toggleTheme"
      >
        <span class="track" :class="{ dark: isDark }">
          <span class="knob">{{ isDark ? '☾' : '☀' }}</span>
        </span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useAppRoute } from '@/composables/useAppRoute'
import { useAppearance } from '@/composables/useAppearance'

const { pageTitle } = useAppRoute()
const { isDark, toggleTheme, openPanel } = useAppearance()
const isScrolled = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 8
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 48px;
  padding: 10px 2px;
  margin-bottom: 4px;
  background: transparent;
  border-bottom: 1px solid transparent;
  transition:
    background 0.3s var(--ease-out),
    border-color 0.3s var(--ease-out),
    backdrop-filter 0.3s var(--ease-out);
}

.topbar.scrolled {
  background: color-mix(in srgb, var(--bg-base) 86%, transparent);
  backdrop-filter: saturate(160%) blur(14px);
  -webkit-backdrop-filter: saturate(160%) blur(14px);
  border-bottom-color: color-mix(in srgb, var(--border) 70%, transparent);
}

.left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.crumb {
  opacity: 0.8;
}

.sep {
  opacity: 0.45;
}

.current {
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: -0.01em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.settings-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-soft);
  color: var(--text-secondary);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: 0.25s var(--ease-out);
}

.settings-btn:hover {
  background: var(--bg-soft-hover);
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.gear {
  font-size: 0.95rem;
  line-height: 1;
  transform: translateY(-0.5px);
}

.theme-switch {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
}

.track {
  position: relative;
  width: 48px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg-soft);
  display: block;
  transition: background 0.25s var(--ease-out), border-color 0.25s var(--ease-out);
}

.knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.75rem;
  background: var(--bg-card);
  color: var(--text-secondary);
  box-shadow: var(--shadow-soft);
  transition:
    transform 0.35s var(--ease-spring),
    background 0.25s var(--ease-out),
    color 0.25s var(--ease-out);
}

.track.dark {
  background: color-mix(in srgb, var(--accent) 18%, var(--bg-soft));
  border-color: color-mix(in srgb, var(--accent) 30%, var(--border));
}

.track.dark .knob {
  transform: translateX(20px);
  background: var(--accent);
  color: #fff;
}

.theme-switch:hover .track {
  border-color: var(--border-strong);
}

.theme-switch:active .knob {
  transform: scale(0.96);
}

.theme-switch:active .track.dark .knob {
  transform: translateX(20px) scale(0.96);
}

@media (max-width: 960px) {
  .topbar {
    padding-left: 48px;
  }
}
</style>
