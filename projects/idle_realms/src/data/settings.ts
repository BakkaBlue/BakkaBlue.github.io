// ==================== 设置系统配置 ====================

export interface GeneralSettings {
  autoSave: boolean
  autoSaveInterval: number    // 秒：30, 60, 120, 300
  showRightPanel: boolean
  reduceMotion: boolean
}

export interface PersonalizeSettings {
  theme: 'default' | 'forest' | 'magic'
  fontSize: number           // 12, 14, 16
}

export interface PlayerSettings {
  name: string
}

export interface GameSettings {
  general: GeneralSettings
  personalize: PersonalizeSettings
  player: PlayerSettings
}

export const DEFAULT_SETTINGS: GameSettings = {
  general: {
    autoSave: true,
    autoSaveInterval: 60,
    showRightPanel: true,
    reduceMotion: false,
  },
  personalize: {
    theme: 'default',
    fontSize: 14,
  },
  player: {
    name: '默认勇士',
  },
}

/** 主题 CSS 变量映射 */
export const THEME_MAP: Record<string, Record<string, string>> = {
  default: {},
  forest: {
    '--gold': '#66bb6a', '--gold-hi': '#81c784', '--gold-dim': '#4b8a4f',
    '--bg-deep': '#0e1410', '--bg-base': '#141d18', '--bg-card': '#1c2820', '--bg-card-hi': '#243329',
    '--border': '#2e4235', '--border-hi': '#3f5c48',
  },
  magic: {
    '--gold': '#b968e0', '--gold-hi': '#d1a3e8', '--gold-dim': '#8e4cb0',
    '--bg-deep': '#120c14', '--bg-base': '#1a121d', '--bg-card': '#251a2a', '--bg-card-hi': '#312338',
    '--border': '#3a2742', '--border-hi': '#4d3660',
  },
}
