/**
 * Backward-compatible theme API.
 * Appearance (multi-profile) lives in useAppearance — this re-exports
 * the subset of helpers used by existing components.
 */
import { computed } from 'vue'
import { useAppearance } from './useAppearance'

export type Theme = 'dark' | 'light'

export function useTheme() {
  const {
    isDark,
    isLight,
    resolvedTheme,
    setTheme,
    toggleTheme,
    settings,
    setThemeMode,
  } = useAppearance()

  return {
    theme: resolvedTheme,
    isDark,
    isLight,
    setTheme,
    toggleTheme,
    /** Full appearance mode including `system`. */
    themeMode: computed(() => settings.value.themeMode),
    setThemeMode,
  }
}
