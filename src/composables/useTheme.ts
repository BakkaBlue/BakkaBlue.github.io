import { ref, computed, onMounted } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'cyren-theme'
const theme = ref<Theme>('light')

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  function applyTheme(t: Theme) {
    theme.value = t
    document.documentElement.dataset.theme = t
  }

  function toggleTheme() {
    applyTheme(isDark.value ? 'light' : 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, theme.value)
    } catch { /* localStorage 不可用时静默失败 */ }
  }

  onMounted(() => {
    // 1. 优先读取 localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
      if (saved === 'light' || saved === 'dark') {
        applyTheme(saved)
        return
      }
    } catch { /* 静默 */ }

    // 2. 回退到系统偏好
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark')
    } else {
      applyTheme('light')
    }

    // 3. 监听系统偏好变化（仅当用户未手动设置时）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (!saved) {
          applyTheme(e.matches ? 'dark' : 'light')
        }
      } catch { /* 静默 */ }
    })
  })

  return { theme, isDark, toggleTheme }
}
