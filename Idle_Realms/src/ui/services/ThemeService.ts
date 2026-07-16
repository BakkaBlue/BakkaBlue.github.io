// ==================== Theme Service ====================

import defaultVars from '@/assets/themes/default.json'
import forestVars from '@/assets/themes/forest.json'
import magicVars from '@/assets/themes/magic.json'

export type ThemeVariables = Record<string, string>

/** Registry of known themes and their CSS variable overrides. */
const BUILTIN_THEMES: Record<string, ThemeVariables> = {
  default: defaultVars as ThemeVariables,
  forest: forestVars as ThemeVariables,
  magic: magicVars as ThemeVariables,
}

/**
 * Manages applying CSS custom-property themes to the document root.
 *
 * Usage:
 * ```ts
 * import { themeService } from '@/ui/services/ThemeService'
 * themeService.applyTheme('forest')
 * ```
 */
export class ThemeService {
  private currentTheme = 'default'

  /** Return the merged CSS variables for a given theme name. */
  getThemeVars(name: string): ThemeVariables {
    const base = { ...BUILTIN_THEMES.default }
    if (name !== 'default' && BUILTIN_THEMES[name]) {
      Object.assign(base, BUILTIN_THEMES[name])
    }
    return base
  }

  /**
   * Apply a named theme's CSS variables to `document.documentElement`.
   * Non-default themes are merged on top of the default palette so that
   * only the variables the theme explicitly overrides change.
   */
  applyTheme(name: string): void {
    this.currentTheme = name
    const vars = this.getThemeVars(name)
    for (const [key, value] of Object.entries(vars)) {
      document.documentElement.style.setProperty(key, value)
    }
  }

  /** Return the name of the currently active theme. */
  getCurrentTheme(): string {
    return this.currentTheme
  }

  /** Return all known theme names. */
  getAvailableThemes(): string[] {
    return Object.keys(BUILTIN_THEMES)
  }

  /**
   * Register or override a theme at runtime.
   * Useful for user-created themes or dynamic remote themes.
   */
  registerTheme(name: string, variables: ThemeVariables): void {
    BUILTIN_THEMES[name] = variables
  }
}

/** Singleton instance used across the app. */
export const themeService = new ThemeService()
