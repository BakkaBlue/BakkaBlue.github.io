import { computed, reactive, ref, watch } from 'vue'
import {
  BASE_RADII,
  COLOR_PRESETS,
  DEFAULT_APPEARANCE,
  DENSITY_SCALE,
  FONT_STACKS,
  createProfile,
  getPreset,
  type AppearanceProfile,
  type AppearanceSettings,
  type AppearanceStore,
  type DensityChoice,
  type FontChoice,
  type RadiusChoice,
  type ThemeMode,
} from '@/data/appearancePresets'

export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'cyan-appearance'
const LEGACY_THEME_KEY = 'cyan-theme'

const panelOpen = ref(false)
const store = reactive<AppearanceStore>(loadStore())
let mediaQuery: MediaQueryList | null = null
let mediaHandler: ((e: MediaQueryListEvent) => void) | null = null
let booted = false

function cloneSettings(s: AppearanceSettings): AppearanceSettings {
  return {
    themeMode: s.themeMode,
    colorPreset: s.colorPreset,
    font: s.font,
    radius: s.radius,
    density: s.density,
  }
}

function safeParse(raw: string | null): unknown {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function migrateLegacyTheme(): ThemeMode | null {
  try {
    const legacy = localStorage.getItem(LEGACY_THEME_KEY)
    if (legacy === 'dark' || legacy === 'light') return legacy
  } catch {
    /* ignore */
  }
  return null
}

function normalizeSettings(input: Partial<AppearanceSettings> | null | undefined): AppearanceSettings {
  const base = cloneSettings(DEFAULT_APPEARANCE)
  if (!input || typeof input !== 'object') return base

  if (input.themeMode === 'system' || input.themeMode === 'light' || input.themeMode === 'dark') {
    base.themeMode = input.themeMode
  }
  if (typeof input.colorPreset === 'string' && COLOR_PRESETS.some((p) => p.id === input.colorPreset)) {
    base.colorPreset = input.colorPreset
  }
  if (input.font === 'auto' || input.font === 'sans' || input.font === 'serif') {
    base.font = input.font
  }
  if (
    input.radius === 'auto' ||
    input.radius === 0 ||
    input.radius === 0.3 ||
    input.radius === 0.5 ||
    input.radius === 0.75 ||
    input.radius === 1
  ) {
    base.radius = input.radius
  }
  if (
    input.density === 'compact' ||
    input.density === 'cozy' ||
    input.density === 'comfortable' ||
    input.density === 'spacious'
  ) {
    base.density = input.density
  }
  return base
}

function loadStore(): AppearanceStore {
  const parsed = safeParse(
    typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null,
  ) as Partial<AppearanceStore> | null

  if (parsed && parsed.version === 1 && Array.isArray(parsed.profiles) && parsed.profiles.length) {
    const profiles = parsed.profiles
      .filter((p): p is AppearanceProfile => !!p && typeof p === 'object' && typeof p.id === 'string')
      .map((p) => ({
        id: p.id,
        name: typeof p.name === 'string' && p.name.trim() ? p.name.trim().slice(0, 24) : '访客',
        settings: normalizeSettings(p.settings),
        updatedAt: typeof p.updatedAt === 'number' ? p.updatedAt : Date.now(),
      }))

    if (profiles.length) {
      const active =
        profiles.find((p) => p.id === parsed.activeProfileId)?.id ?? profiles[0].id
      return { version: 1, activeProfileId: active, profiles }
    }
  }

  // Fresh store — honor legacy cyan-theme if present
  const legacy = migrateLegacyTheme()
  const settings = cloneSettings(DEFAULT_APPEARANCE)
  if (legacy) settings.themeMode = legacy
  const profile = createProfile('默认用户', settings)
  return { version: 1, activeProfileId: profile.id, profiles: [profile] }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    // keep legacy key in sync for any external readers
    const resolved = resolveTheme(activeSettings().themeMode)
    localStorage.setItem(LEGACY_THEME_KEY, resolved)
  } catch {
    /* ignore quota / private mode */
  }
}

function activeSettings(): AppearanceSettings {
  const p = store.profiles.find((x) => x.id === store.activeProfileId)
  return p?.settings ?? DEFAULT_APPEARANCE
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'light' || mode === 'dark') return mode
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function radiusMultiplier(choice: RadiusChoice): number {
  if (choice === 'auto') return 1
  return choice
}

function clearPresetOverrides(root: HTMLElement) {
  // Clear only tokens that presets may set so base CSS can re-assert defaults.
  const keys = new Set<string>()
  for (const preset of COLOR_PRESETS) {
    Object.keys(preset.light).forEach((k) => keys.add(k))
    Object.keys(preset.dark).forEach((k) => keys.add(k))
  }
  for (const key of keys) {
    root.style.removeProperty(key)
  }
}

function applyAppearance(settings: AppearanceSettings = activeSettings()) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const resolved = resolveTheme(settings.themeMode)

  root.dataset.theme = resolved
  root.dataset.themeMode = settings.themeMode
  root.dataset.colorPreset = settings.colorPreset
  root.dataset.font = settings.font
  root.dataset.density = settings.density
  root.style.colorScheme = resolved

  // Color preset overrides
  clearPresetOverrides(root)
  const preset = getPreset(settings.colorPreset)
  const tokens = resolved === 'dark' ? preset.dark : preset.light
  for (const [key, value] of Object.entries(tokens)) {
    root.style.setProperty(key, value)
  }

  // Font
  root.style.setProperty('--font-family', FONT_STACKS[settings.font])

  // Radius scale
  const mult = radiusMultiplier(settings.radius)
  root.style.setProperty('--radius-sm', `${Math.round(BASE_RADII.sm * mult)}px`)
  root.style.setProperty('--radius-md', `${Math.round(BASE_RADII.md * mult)}px`)
  root.style.setProperty('--radius-lg', `${Math.round(BASE_RADII.lg * mult)}px`)
  root.style.setProperty('--radius-xl', `${Math.round(BASE_RADII.xl * mult)}px`)
  root.style.setProperty('--radius-scale', String(mult))

  // Density
  const densityScale = DENSITY_SCALE[settings.density]
  root.style.setProperty('--density-scale', String(densityScale))
  root.style.setProperty('--section-padding', `${Math.round(8 * densityScale)}px 0 ${Math.round(24 * densityScale)}px`)
  root.style.setProperty('--ui-gap', `${Math.round(12 * densityScale)}px`)
  root.style.setProperty('--content-pad-x', `${Math.round(28 * densityScale)}px`)

  // simple-lg bumps base type a bit
  if (settings.colorPreset === 'simple-lg') {
    root.style.setProperty('--type-scale', '1.08')
  } else {
    root.style.setProperty('--type-scale', '1')
  }
}

function bindSystemListener(mode: ThemeMode) {
  if (typeof window === 'undefined') return
  if (mediaQuery && mediaHandler) {
    mediaQuery.removeEventListener('change', mediaHandler)
    mediaQuery = null
    mediaHandler = null
  }
  if (mode !== 'system') return
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaHandler = () => applyAppearance()
  mediaQuery.addEventListener('change', mediaHandler)
}

function touchActiveProfile() {
  const p = store.profiles.find((x) => x.id === store.activeProfileId)
  if (p) p.updatedAt = Date.now()
}

function updateSettings(partial: Partial<AppearanceSettings>) {
  const p = store.profiles.find((x) => x.id === store.activeProfileId)
  if (!p) return
  Object.assign(p.settings, normalizeSettings({ ...p.settings, ...partial }))
  touchActiveProfile()
  applyAppearance(p.settings)
  bindSystemListener(p.settings.themeMode)
  persist()
}

function boot() {
  if (booted) return
  booted = true
  applyAppearance()
  bindSystemListener(activeSettings().themeMode)
}

// Deep-watch not needed — all mutations go through helpers. Still re-apply on store swap.
watch(
  () => store.activeProfileId,
  () => {
    applyAppearance()
    bindSystemListener(activeSettings().themeMode)
    persist()
  },
)

export function useAppearance() {
  boot()

  const settings = computed(() => activeSettings())
  const profiles = computed(() => store.profiles)
  const activeProfile = computed(
    () => store.profiles.find((p) => p.id === store.activeProfileId) ?? store.profiles[0],
  )
  const resolvedTheme = computed(() => resolveTheme(settings.value.themeMode))
  const isDark = computed(() => resolvedTheme.value === 'dark')
  const isLight = computed(() => resolvedTheme.value === 'light')

  function openPanel() {
    panelOpen.value = true
  }
  function closePanel() {
    panelOpen.value = false
  }
  function togglePanel() {
    panelOpen.value = !panelOpen.value
  }

  function setThemeMode(mode: ThemeMode) {
    updateSettings({ themeMode: mode })
  }
  function setColorPreset(id: string) {
    updateSettings({ colorPreset: id })
  }
  function setFont(font: FontChoice) {
    updateSettings({ font })
  }
  function setRadius(radius: RadiusChoice) {
    updateSettings({ radius })
  }
  function setDensity(density: DensityChoice) {
    updateSettings({ density })
  }

  function resetAppearance() {
    updateSettings(cloneSettings(DEFAULT_APPEARANCE))
  }

  function switchProfile(id: string) {
    if (!store.profiles.some((p) => p.id === id)) return
    store.activeProfileId = id
  }

  function renameProfile(id: string, name: string) {
    const p = store.profiles.find((x) => x.id === id)
    if (!p) return
    const next = name.trim().slice(0, 24)
    if (!next) return
    p.name = next
    p.updatedAt = Date.now()
    persist()
  }

  function addProfile(name = `用户 ${store.profiles.length + 1}`) {
    const profile = createProfile(name, cloneSettings(DEFAULT_APPEARANCE))
    store.profiles.push(profile)
    store.activeProfileId = profile.id
    applyAppearance(profile.settings)
    bindSystemListener(profile.settings.themeMode)
    persist()
    return profile
  }

  function duplicateActiveProfile(name?: string) {
    const cur = activeProfile.value
    const profile = createProfile(name ?? `${cur.name} 副本`, cloneSettings(cur.settings))
    store.profiles.push(profile)
    store.activeProfileId = profile.id
    applyAppearance(profile.settings)
    bindSystemListener(profile.settings.themeMode)
    persist()
    return profile
  }

  function removeProfile(id: string) {
    if (store.profiles.length <= 1) return false
    const idx = store.profiles.findIndex((p) => p.id === id)
    if (idx < 0) return false
    store.profiles.splice(idx, 1)
    if (store.activeProfileId === id) {
      store.activeProfileId = store.profiles[0].id
    }
    applyAppearance()
    bindSystemListener(activeSettings().themeMode)
    persist()
    return true
  }

  // Backward-compatible helpers used by AppTopbar
  function setTheme(t: ResolvedTheme) {
    setThemeMode(t)
  }
  function toggleTheme() {
    setThemeMode(isDark.value ? 'light' : 'dark')
  }

  return {
    panelOpen,
    store,
    settings,
    profiles,
    activeProfile,
    resolvedTheme,
    isDark,
    isLight,
    colorPresets: COLOR_PRESETS,
    openPanel,
    closePanel,
    togglePanel,
    setThemeMode,
    setColorPreset,
    setFont,
    setRadius,
    setDensity,
    resetAppearance,
    switchProfile,
    renameProfile,
    addProfile,
    duplicateActiveProfile,
    removeProfile,
    setTheme,
    toggleTheme,
    applyAppearance,
  }
}

// Eager early apply (module load) — reduces FOUC when imported from main.ts
if (typeof document !== 'undefined') {
  try {
    applyAppearance(activeSettings())
  } catch {
    /* ignore */
  }
}
