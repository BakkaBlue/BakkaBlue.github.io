<template>
  <nav class="nav-bar" :class="{ scrolled: isScrolled }">
    <div class="nav-inner">
      <a href="#top" class="nav-brand">
        <span class="brand-mark" aria-hidden="true"></span>
        Cyren
      </a>
      <div class="nav-links">
        <a v-for="item in links" :key="item.href" :href="item.href" class="nav-link">{{ item.label }}</a>
      </div>
      <button
        class="theme-toggle"
        @click="toggleTheme"
        :aria-label="isDark ? '切换到日间模式' : '切换到夜间模式'"
        :title="isDark ? '切换到日间模式' : '切换到夜间模式'"
      >
        <span class="theme-toggle__glow" aria-hidden="true"></span>
        {{ isDark ? '☀️' : '🌙' }}
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
  { label: '项目', href: '#projects' },
  { label: '联系', href: '#contact' },
]

function onScroll() {
  isScrolled.value = window.scrollY > 40
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
  top: 16px;
  left: 16px;
  right: 16px;
  z-index: 100;
  border-radius: 20px;
  background: transparent;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid transparent;
  transition: background var(--transition-speed) ease, border-color var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
}

.nav-bar.scrolled {
  background: color-mix(in srgb, var(--glass-bg) 90%, transparent);
  border-color: var(--glass-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255,255,255,0.03) inset;
}

.nav-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.nav-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.brand-mark {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 var(--accent-glow);
  animation: brand-pulse 2s ease-out infinite;
}

@keyframes brand-pulse {
  0% { box-shadow: 0 0 0 0 var(--accent-glow); }
  70% { box-shadow: 0 0 0 12px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

.nav-links {
  display: flex;
  gap: 6px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  padding: 8px 12px;
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 0.92rem;
  transition: color 0.2s ease, background 0.2s ease;
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.06);
}

.theme-toggle {
  position: relative;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 8px 14px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background var(--transition-speed) ease, border-color var(--transition-speed) ease, transform 0.2s ease;
  line-height: 1;
  overflow: hidden;
}

.theme-toggle__glow {
  position: absolute;
  inset: -40%;
  background: radial-gradient(circle, var(--accent-glow), transparent 60%);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.theme-toggle:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  transform: translateY(-1px) scale(1.03);
}

.theme-toggle:hover .theme-toggle__glow {
  opacity: 1;
}

@media (max-width: 720px) {
  .nav-links {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-bar {
    top: 8px;
    left: 8px;
    right: 8px;
    border-radius: 14px;
  }
  .nav-inner {
    padding: 10px 14px;
  }
}
</style>
