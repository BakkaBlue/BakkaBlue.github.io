<template>
  <nav class="nav-bar" :class="{ scrolled: isScrolled }">
    <div class="nav-inner">
      <a href="#top" class="nav-brand">Cyren</a>
      <div class="nav-links">
        <a v-for="item in links" :key="item.href" :href="item.href" class="nav-link">{{ item.label }}</a>
      </div>
      <button
        class="theme-toggle"
        @click="toggleTheme"
        :aria-label="isDark ? '切换到日间模式' : '切换到夜间模式'"
        :title="isDark ? '切换到日间模式' : '切换到夜间模式'"
      >
        {{ isDark ? '日' : '夜' }}
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
const isScrolled = ref(false)

const links = [
  { label: '技能', href: '#skills' },
  { label: '关于', href: '#about' },
  { label: 'GitHub', href: '#github' },
  { label: '项目', href: '#projects' },
  { label: '联系', href: '#contact' },
]

function onScroll() {
  isScrolled.value = window.scrollY > 24
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
.nav-bar {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: min(calc(100% - 32px), 1080px);
  z-index: 100;
  border-radius: 999px;
  background: transparent;
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid transparent;
  transition:
    background 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease;
}

.nav-bar.scrolled {
  background: color-mix(in srgb, var(--glass-bg) 88%, transparent);
  border-color: var(--glass-border);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 12px 18px 12px 22px;
}

.nav-brand {
  font-weight: 600;
  font-size: 0.98rem;
  letter-spacing: 0.04em;
  color: var(--text-primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: color 0.25s ease, background 0.25s ease;
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.theme-toggle {
  min-width: 42px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-secondary);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
}

.theme-toggle:hover {
  color: var(--text-primary);
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
}

@media (max-width: 760px) {
  .nav-links {
    display: none;
  }

  .nav-bar {
    top: 12px;
    width: calc(100% - 24px);
  }
}
</style>
