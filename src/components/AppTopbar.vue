<template>
  <header class="topbar">
    <div class="left">
      <h1>{{ pageTitle }}</h1>
      <p>{{ subtitle }}</p>
    </div>

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
        <span class="txt day">日</span>
        <span class="txt night">夜</span>
      </span>
    </button>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppRoute } from '@/composables/useAppRoute'
import { useTheme } from '@/composables/useTheme'

const { pageTitle, isHome, isSkills, isGithub, isProjects, isBlog, isBlogPost, isContact } =
  useAppRoute()
const { isDark, toggleTheme } = useTheme()

const subtitle = computed(() => {
  if (isHome.value) return '个人主页总览'
  if (isSkills.value) return '能力与工具'
  if (isGithub.value) return '贡献节奏'
  if (isProjects.value) return '可打开的作品'
  if (isBlogPost.value) return '阅读'
  if (isBlog.value) return '笔记与想法'
  if (isContact.value) return '找到我'
  return ''
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
  gap: 16px;
  min-height: var(--topbar-h);
  padding: 14px 4px 16px;
  margin-bottom: 8px;
  background: color-mix(in srgb, var(--bg-base) 82%, transparent);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  border-bottom: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
}

.left h1 {
  font-size: 1.35rem;
  letter-spacing: -0.03em;
  font-weight: 650;
}

.left p {
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 0.86rem;
}

.theme-switch {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.track {
  position: relative;
  width: 76px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-soft);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 0 10px;
}

.txt {
  font-size: 0.72rem;
  color: var(--text-muted);
  z-index: 1;
}

.txt.day { text-align: left; }
.txt.night { text-align: right; }

.knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--accent);
  color: #fff;
  box-shadow: 0 6px 16px var(--accent-glow);
  transition: transform 0.4s var(--ease-spring);
}

.track.dark .knob {
  transform: translateX(40px);
}

.theme-switch:active .knob {
  transform: scale(0.96);
}

.theme-switch:active .track.dark .knob {
  transform: translateX(40px) scale(0.96);
}

@media (max-width: 960px) {
  .topbar {
    padding-left: 52px;
  }
}
</style>
