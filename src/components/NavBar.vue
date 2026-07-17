<template>
  <nav class="nav-bar" :class="{ scrolled: isScrolled }">
    <div class="nav-inner">
      <span class="nav-brand">Cyren</span>
      <button
        class="theme-toggle"
        @click="toggleTheme"
        :aria-label="isDark ? '切换到日间模式' : '切换到夜间模式'"
        :title="isDark ? '切换到日间模式' : '切换到夜间模式'"
      >
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

function onScroll() {
  isScrolled.value = window.scrollY > 100
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
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.nav-bar.scrolled {
  background: var(--glass-bg);
  border-color: var(--glass-border);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.nav-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.theme-toggle {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 8px 14px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease;
  line-height: 1;
}

.theme-toggle:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
}

@media (max-width: 480px) {
  .nav-bar {
    top: 8px;
    left: 8px;
    right: 8px;
    border-radius: 14px;
  }
  .nav-inner {
    padding: 10px 16px;
  }
}
</style>
