import { ref, computed, onMounted } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'cyan-theme'
const theme = ref<Theme>('light')
let booted = false

function applyTheme(t: Theme) {
  theme.value = t
  document.documentElement.dataset.theme = t
  document.documentElement.style.colorScheme = t
}

function persist(t: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, t)
  } catch {
    /* ignore */
  }
}

function boot() {
  if (booted) return
  booted = true
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved)
      return
    }
  } catch {
    /* ignore */
  }
  // default: light Apple-like; fall back to system dark when preferred
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark')
  } else {
    applyTheme('light')
  }
}

export function useTheme() {
  boot()

  const isDark = computed(() => theme.value === 'dark')
  const isLight = computed(() => theme.value === 'light')

  function setTheme(t: Theme) {
    applyTheme(t)
    persist(t)
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  onMounted(() => {
    boot()
  })

  return {
    theme,
    isDark,
    isLight,
    setTheme,
    toggleTheme,
  }
}

// apply ASAP when module loads (before paint if imported early)
if (typeof document !== 'undefined') {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.dataset.theme = saved
      document.documentElement.style.colorScheme = saved
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.dataset.theme = 'dark'
      document.documentElement.style.colorScheme = 'dark'
    } else {
      document.documentElement.dataset.theme = 'light'
      document.documentElement.style.colorScheme = 'light'
    }
  } catch {
    document.documentElement.dataset.theme = 'light'
  }
}
