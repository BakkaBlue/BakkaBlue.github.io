export type ThemeMode = 'system' | 'light' | 'dark'
export type FontChoice = 'auto' | 'sans' | 'serif'
export type RadiusChoice = 'auto' | 0 | 0.3 | 0.5 | 0.75 | 1
export type DensityChoice = 'compact' | 'cozy' | 'comfortable' | 'spacious'

export interface AppearanceSettings {
  themeMode: ThemeMode
  colorPreset: string
  font: FontChoice
  radius: RadiusChoice
  density: DensityChoice
}

export interface AppearanceProfile {
  id: string
  name: string
  settings: AppearanceSettings
  updatedAt: number
}

export interface AppearanceStore {
  version: 1
  activeProfileId: string
  profiles: AppearanceProfile[]
}

/** CSS variables that a color preset may override (light + dark). */
export type ThemeTokens = Record<string, string>

export interface ColorPreset {
  id: string
  label: string
  /** Preview swatch for the picker (CSS background). */
  swatch: string
  light: ThemeTokens
  dark: ThemeTokens
}

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  themeMode: 'system',
  colorPreset: 'default',
  font: 'auto',
  radius: 'auto',
  density: 'comfortable',
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'default',
    label: '默认',
    swatch: 'linear-gradient(135deg, #8e8e93 0%, #d1d1d6 50%, #f5f5f7 100%)',
    light: {},
    dark: {},
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    swatch: 'linear-gradient(135deg, #d4a574 0%, #f5e6d3 55%, #fffaf3 100%)',
    light: {
      '--accent': '#c96442',
      '--accent-hover': '#b55738',
      '--accent-soft': 'rgba(201, 100, 66, 0.12)',
      '--accent-glow': 'rgba(201, 100, 66, 0.18)',
      '--accent-2': '#d4a574',
      '--bg-base': '#faf6f1',
      '--bg-elevated': '#fffdf9',
      '--bg-card': '#fffdf9',
      '--bg-card-hover': '#f7f0e8',
      '--bg-sidebar': 'rgba(255, 253, 249, 0.82)',
      '--bg-soft': 'rgba(201, 100, 66, 0.06)',
      '--bg-soft-hover': 'rgba(201, 100, 66, 0.1)',
      '--border': 'rgba(120, 80, 50, 0.1)',
      '--border-strong': 'rgba(120, 80, 50, 0.16)',
      '--text-primary': '#2c1810',
      '--text-secondary': '#6b4f3f',
      '--text-muted': '#9a7b68',
    },
    dark: {
      '--accent': '#e8a87c',
      '--accent-hover': '#f0b892',
      '--accent-soft': 'rgba(232, 168, 124, 0.16)',
      '--accent-glow': 'rgba(232, 168, 124, 0.22)',
      '--accent-2': '#c9845a',
      '--bg-base': '#1a1410',
      '--bg-elevated': '#241c16',
      '--bg-card': '#241c16',
      '--bg-card-hover': '#2e241c',
      '--bg-sidebar': 'rgba(36, 28, 22, 0.9)',
      '--bg-soft': 'rgba(255, 220, 180, 0.06)',
      '--bg-soft-hover': 'rgba(255, 220, 180, 0.1)',
      '--border': 'rgba(255, 210, 170, 0.1)',
      '--border-strong': 'rgba(255, 210, 170, 0.16)',
      '--text-primary': '#f5ebe0',
      '--text-secondary': '#c4a990',
      '--text-muted': '#8a7060',
    },
  },
  {
    id: 'simple-lg',
    label: '超大字体简易',
    swatch: 'linear-gradient(135deg, #4a4a4a 0%, #b0b0b0 50%, #f0f0f0 100%)',
    light: {
      '--accent': '#111111',
      '--accent-hover': '#333333',
      '--accent-soft': 'rgba(0, 0, 0, 0.08)',
      '--accent-glow': 'rgba(0, 0, 0, 0.12)',
      '--accent-2': '#555555',
      '--text-primary': '#111111',
      '--text-secondary': '#444444',
      '--text-muted': '#777777',
    },
    dark: {
      '--accent': '#f5f5f5',
      '--accent-hover': '#ffffff',
      '--accent-soft': 'rgba(255, 255, 255, 0.12)',
      '--accent-glow': 'rgba(255, 255, 255, 0.18)',
      '--accent-2': '#c0c0c0',
      '--text-primary': '#f5f5f5',
      '--text-secondary': '#c8c8c8',
      '--text-muted': '#888888',
    },
  },
  {
    id: 'midnight',
    label: '暗夜',
    swatch: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #4a4a6a 100%)',
    light: {
      '--accent': '#5b5fc7',
      '--accent-hover': '#4a4eb0',
      '--accent-soft': 'rgba(91, 95, 199, 0.12)',
      '--accent-glow': 'rgba(91, 95, 199, 0.18)',
      '--accent-2': '#7c83db',
      '--bg-base': '#eef0f7',
      '--bg-elevated': '#ffffff',
      '--bg-card': '#ffffff',
      '--bg-card-hover': '#f4f5fb',
      '--bg-sidebar': 'rgba(255, 255, 255, 0.85)',
      '--bg-soft': 'rgba(40, 45, 90, 0.05)',
      '--bg-soft-hover': 'rgba(40, 45, 90, 0.08)',
      '--border': 'rgba(40, 45, 90, 0.1)',
      '--border-strong': 'rgba(40, 45, 90, 0.16)',
      '--text-primary': '#1a1a2e',
      '--text-secondary': '#4a4a6a',
      '--text-muted': '#7a7a9a',
    },
    dark: {
      '--accent': '#8b8fff',
      '--accent-hover': '#a0a3ff',
      '--accent-soft': 'rgba(139, 143, 255, 0.16)',
      '--accent-glow': 'rgba(139, 143, 255, 0.24)',
      '--accent-2': '#6c70e0',
      '--bg-base': '#05050a',
      '--bg-elevated': '#0e0e18',
      '--bg-card': '#12121c',
      '--bg-card-hover': '#1a1a28',
      '--bg-sidebar': 'rgba(14, 14, 24, 0.92)',
      '--bg-soft': 'rgba(160, 165, 255, 0.06)',
      '--bg-soft-hover': 'rgba(160, 165, 255, 0.1)',
      '--border': 'rgba(160, 165, 255, 0.1)',
      '--border-strong': 'rgba(160, 165, 255, 0.16)',
      '--text-primary': '#e8e8f0',
      '--text-secondary': '#a0a0b8',
      '--text-muted': '#6a6a80',
    },
  },
  {
    id: 'rose',
    label: '玫瑰花园',
    swatch: 'linear-gradient(135deg, #e91e63 0%, #f48fb1 55%, #fce4ec 100%)',
    light: {
      '--accent': '#e91e63',
      '--accent-hover': '#d81b60',
      '--accent-soft': 'rgba(233, 30, 99, 0.12)',
      '--accent-glow': 'rgba(233, 30, 99, 0.2)',
      '--accent-2': '#f48fb1',
      '--bg-base': '#fdf2f6',
      '--bg-elevated': '#fff8fb',
      '--bg-card': '#fff8fb',
      '--bg-card-hover': '#fceef4',
      '--bg-sidebar': 'rgba(255, 248, 251, 0.88)',
      '--bg-soft': 'rgba(233, 30, 99, 0.06)',
      '--bg-soft-hover': 'rgba(233, 30, 99, 0.1)',
      '--border': 'rgba(180, 40, 90, 0.1)',
      '--border-strong': 'rgba(180, 40, 90, 0.16)',
      '--text-primary': '#3d1020',
      '--text-secondary': '#8a4060',
      '--text-muted': '#b07090',
    },
    dark: {
      '--accent': '#ff6b9d',
      '--accent-hover': '#ff85ae',
      '--accent-soft': 'rgba(255, 107, 157, 0.16)',
      '--accent-glow': 'rgba(255, 107, 157, 0.24)',
      '--accent-2': '#e91e63',
      '--bg-base': '#14080e',
      '--bg-elevated': '#1e1018',
      '--bg-card': '#1e1018',
      '--bg-card-hover': '#2a1622',
      '--bg-sidebar': 'rgba(30, 16, 24, 0.92)',
      '--bg-soft': 'rgba(255, 140, 180, 0.07)',
      '--bg-soft-hover': 'rgba(255, 140, 180, 0.12)',
      '--border': 'rgba(255, 140, 180, 0.12)',
      '--border-strong': 'rgba(255, 140, 180, 0.18)',
      '--text-primary': '#fce4ec',
      '--text-secondary': '#d0a0b5',
      '--text-muted': '#906070',
    },
  },
  {
    id: 'lake',
    label: '湖光',
    swatch: 'linear-gradient(135deg, #00bfa5 0%, #64ffda 55%, #e0f7f4 100%)',
    light: {
      '--accent': '#00897b',
      '--accent-hover': '#00796b',
      '--accent-soft': 'rgba(0, 137, 123, 0.12)',
      '--accent-glow': 'rgba(0, 137, 123, 0.18)',
      '--accent-2': '#26a69a',
      '--bg-base': '#f0faf8',
      '--bg-elevated': '#f7fffd',
      '--bg-card': '#f7fffd',
      '--bg-card-hover': '#e8f7f4',
      '--bg-sidebar': 'rgba(247, 255, 253, 0.88)',
      '--bg-soft': 'rgba(0, 120, 110, 0.06)',
      '--bg-soft-hover': 'rgba(0, 120, 110, 0.1)',
      '--border': 'rgba(0, 100, 90, 0.1)',
      '--border-strong': 'rgba(0, 100, 90, 0.16)',
      '--text-primary': '#0d2e2a',
      '--text-secondary': '#3d6b64',
      '--text-muted': '#6a9a92',
    },
    dark: {
      '--accent': '#1de9b6',
      '--accent-hover': '#64ffda',
      '--accent-soft': 'rgba(29, 233, 182, 0.14)',
      '--accent-glow': 'rgba(29, 233, 182, 0.22)',
      '--accent-2': '#00bfa5',
      '--bg-base': '#061412',
      '--bg-elevated': '#0c1f1c',
      '--bg-card': '#0c1f1c',
      '--bg-card-hover': '#14302b',
      '--bg-sidebar': 'rgba(12, 31, 28, 0.92)',
      '--bg-soft': 'rgba(100, 255, 218, 0.06)',
      '--bg-soft-hover': 'rgba(100, 255, 218, 0.1)',
      '--border': 'rgba(100, 255, 218, 0.1)',
      '--border-strong': 'rgba(100, 255, 218, 0.16)',
      '--text-primary': '#e0f7f4',
      '--text-secondary': '#90c8c0',
      '--text-muted': '#5a9088',
    },
  },
  {
    id: 'sunset',
    label: '日落霞光',
    swatch: 'linear-gradient(135deg, #ff6e40 0%, #ffab91 55%, #fff3e0 100%)',
    light: {
      '--accent': '#e64a19',
      '--accent-hover': '#d84315',
      '--accent-soft': 'rgba(230, 74, 25, 0.12)',
      '--accent-glow': 'rgba(230, 74, 25, 0.2)',
      '--accent-2': '#ff8a65',
      '--bg-base': '#fff5ee',
      '--bg-elevated': '#fffaf6',
      '--bg-card': '#fffaf6',
      '--bg-card-hover': '#ffefe4',
      '--bg-sidebar': 'rgba(255, 250, 246, 0.88)',
      '--bg-soft': 'rgba(230, 74, 25, 0.06)',
      '--bg-soft-hover': 'rgba(230, 74, 25, 0.1)',
      '--border': 'rgba(180, 70, 30, 0.1)',
      '--border-strong': 'rgba(180, 70, 30, 0.16)',
      '--text-primary': '#3d1a0a',
      '--text-secondary': '#8a5040',
      '--text-muted': '#b08070',
    },
    dark: {
      '--accent': '#ff8a65',
      '--accent-hover': '#ffab91',
      '--accent-soft': 'rgba(255, 138, 101, 0.16)',
      '--accent-glow': 'rgba(255, 138, 101, 0.24)',
      '--accent-2': '#ff6e40',
      '--bg-base': '#140a06',
      '--bg-elevated': '#1e120c',
      '--bg-card': '#1e120c',
      '--bg-card-hover': '#2a1a12',
      '--bg-sidebar': 'rgba(30, 18, 12, 0.92)',
      '--bg-soft': 'rgba(255, 160, 120, 0.07)',
      '--bg-soft-hover': 'rgba(255, 160, 120, 0.12)',
      '--border': 'rgba(255, 160, 120, 0.12)',
      '--border-strong': 'rgba(255, 160, 120, 0.18)',
      '--text-primary': '#fff3e0',
      '--text-secondary': '#d0a890',
      '--text-muted': '#907060',
    },
  },
  {
    id: 'forest',
    label: '森林低语',
    swatch: 'linear-gradient(135deg, #2e7d32 0%, #81c784 55%, #e8f5e9 100%)',
    light: {
      '--accent': '#2e7d32',
      '--accent-hover': '#1b5e20',
      '--accent-soft': 'rgba(46, 125, 50, 0.12)',
      '--accent-glow': 'rgba(46, 125, 50, 0.18)',
      '--accent-2': '#66bb6a',
      '--bg-base': '#f1f7f1',
      '--bg-elevated': '#f7fbf7',
      '--bg-card': '#f7fbf7',
      '--bg-card-hover': '#eaf3ea',
      '--bg-sidebar': 'rgba(247, 251, 247, 0.88)',
      '--bg-soft': 'rgba(46, 125, 50, 0.06)',
      '--bg-soft-hover': 'rgba(46, 125, 50, 0.1)',
      '--border': 'rgba(40, 90, 45, 0.1)',
      '--border-strong': 'rgba(40, 90, 45, 0.16)',
      '--text-primary': '#1a2e1a',
      '--text-secondary': '#4a6b4a',
      '--text-muted': '#7a9a7a',
    },
    dark: {
      '--accent': '#66bb6a',
      '--accent-hover': '#81c784',
      '--accent-soft': 'rgba(102, 187, 106, 0.16)',
      '--accent-glow': 'rgba(102, 187, 106, 0.22)',
      '--accent-2': '#43a047',
      '--bg-base': '#0a120a',
      '--bg-elevated': '#121c12',
      '--bg-card': '#121c12',
      '--bg-card-hover': '#1a281a',
      '--bg-sidebar': 'rgba(18, 28, 18, 0.92)',
      '--bg-soft': 'rgba(130, 200, 130, 0.06)',
      '--bg-soft-hover': 'rgba(130, 200, 130, 0.1)',
      '--border': 'rgba(130, 200, 130, 0.1)',
      '--border-strong': 'rgba(130, 200, 130, 0.16)',
      '--text-primary': '#e8f5e9',
      '--text-secondary': '#a0c8a0',
      '--text-muted': '#608060',
    },
  },
  {
    id: 'sea',
    label: '海风',
    swatch: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 55%, #e3f2fd 100%)',
    light: {
      '--accent': '#1565c0',
      '--accent-hover': '#0d47a1',
      '--accent-soft': 'rgba(21, 101, 192, 0.12)',
      '--accent-glow': 'rgba(21, 101, 192, 0.18)',
      '--accent-2': '#42a5f5',
      '--bg-base': '#f0f6fc',
      '--bg-elevated': '#f7fbff',
      '--bg-card': '#f7fbff',
      '--bg-card-hover': '#e8f1fa',
      '--bg-sidebar': 'rgba(247, 251, 255, 0.88)',
      '--bg-soft': 'rgba(21, 101, 192, 0.06)',
      '--bg-soft-hover': 'rgba(21, 101, 192, 0.1)',
      '--border': 'rgba(30, 80, 140, 0.1)',
      '--border-strong': 'rgba(30, 80, 140, 0.16)',
      '--text-primary': '#0d2137',
      '--text-secondary': '#3d5a7a',
      '--text-muted': '#6a8aaa',
    },
    dark: {
      '--accent': '#42a5f5',
      '--accent-hover': '#64b5f6',
      '--accent-soft': 'rgba(66, 165, 245, 0.16)',
      '--accent-glow': 'rgba(66, 165, 245, 0.24)',
      '--accent-2': '#1e88e5',
      '--bg-base': '#060c14',
      '--bg-elevated': '#0c1622',
      '--bg-card': '#0c1622',
      '--bg-card-hover': '#142030',
      '--bg-sidebar': 'rgba(12, 22, 34, 0.92)',
      '--bg-soft': 'rgba(100, 180, 255, 0.06)',
      '--bg-soft-hover': 'rgba(100, 180, 255, 0.1)',
      '--border': 'rgba(100, 180, 255, 0.1)',
      '--border-strong': 'rgba(100, 180, 255, 0.16)',
      '--text-primary': '#e3f2fd',
      '--text-secondary': '#90b8d8',
      '--text-muted': '#5a809a',
    },
  },
  {
    id: 'lavender',
    label: '薰衣草梦',
    swatch: 'linear-gradient(135deg, #7e57c2 0%, #b39ddb 55%, #ede7f6 100%)',
    light: {
      '--accent': '#7e57c2',
      '--accent-hover': '#6a45b0',
      '--accent-soft': 'rgba(126, 87, 194, 0.12)',
      '--accent-glow': 'rgba(126, 87, 194, 0.2)',
      '--accent-2': '#b39ddb',
      '--bg-base': '#f6f2fb',
      '--bg-elevated': '#fbf8ff',
      '--bg-card': '#fbf8ff',
      '--bg-card-hover': '#f0eaf8',
      '--bg-sidebar': 'rgba(251, 248, 255, 0.88)',
      '--bg-soft': 'rgba(126, 87, 194, 0.06)',
      '--bg-soft-hover': 'rgba(126, 87, 194, 0.1)',
      '--border': 'rgba(90, 60, 150, 0.1)',
      '--border-strong': 'rgba(90, 60, 150, 0.16)',
      '--text-primary': '#24183a',
      '--text-secondary': '#5a4a7a',
      '--text-muted': '#8a7aaa',
    },
    dark: {
      '--accent': '#b39ddb',
      '--accent-hover': '#cec0eb',
      '--accent-soft': 'rgba(179, 157, 219, 0.16)',
      '--accent-glow': 'rgba(179, 157, 219, 0.24)',
      '--accent-2': '#9575cd',
      '--bg-base': '#100c18',
      '--bg-elevated': '#181222',
      '--bg-card': '#181222',
      '--bg-card-hover': '#221a30',
      '--bg-sidebar': 'rgba(24, 18, 34, 0.92)',
      '--bg-soft': 'rgba(180, 160, 230, 0.07)',
      '--bg-soft-hover': 'rgba(180, 160, 230, 0.12)',
      '--border': 'rgba(180, 160, 230, 0.12)',
      '--border-strong': 'rgba(180, 160, 230, 0.18)',
      '--text-primary': '#ede7f6',
      '--text-secondary': '#b8a8d0',
      '--text-muted': '#786890',
    },
  },
]

export const FONT_OPTIONS: { id: FontChoice; label: string; sample: string }[] = [
  { id: 'auto', label: 'Auto', sample: 'Aa' },
  { id: 'sans', label: 'Sans', sample: 'Aa' },
  { id: 'serif', label: 'Serif', sample: 'Aa' },
]

export const RADIUS_OPTIONS: { id: RadiusChoice; label: string }[] = [
  { id: 'auto', label: 'Auto' },
  { id: 0, label: '0' },
  { id: 0.3, label: '0.3' },
  { id: 0.5, label: '0.5' },
  { id: 0.75, label: '0.75' },
  { id: 1, label: '1.0' },
]

export const DENSITY_OPTIONS: { id: DensityChoice; label: string }[] = [
  { id: 'compact', label: '紧凑' },
  { id: 'cozy', label: '适中' },
  { id: 'comfortable', label: '舒适' },
  { id: 'spacious', label: '宽敞' },
]

export const DENSITY_SCALE: Record<DensityChoice, number> = {
  compact: 0.88,
  cozy: 0.96,
  comfortable: 1,
  spacious: 1.14,
}

export const FONT_STACKS: Record<FontChoice, string> = {
  auto:
    "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif",
  sans:
    "Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif",
  serif:
    "'Noto Serif SC', 'Songti SC', 'Source Han Serif SC', Georgia, 'Times New Roman', serif",
}

/** Base radii (px) used when radius multiplier is applied. */
export const BASE_RADII = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
} as const

export function getPreset(id: string): ColorPreset {
  return COLOR_PRESETS.find((p) => p.id === id) ?? COLOR_PRESETS[0]
}

export function createProfile(name: string, settings: AppearanceSettings = DEFAULT_APPEARANCE): AppearanceProfile {
  return {
    id: `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    settings: { ...settings },
    updatedAt: Date.now(),
  }
}
