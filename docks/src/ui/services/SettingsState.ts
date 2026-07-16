// ==================== 设置状态管理 ====================

import { reactive, watch } from 'vue'
import { DEFAULT_SETTINGS, type GameSettings } from '@/data/settings'
import { themeService } from '@/ui/services/ThemeService'

const STORAGE_KEY = 'idleRealms_settings'

function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return { ...DEFAULT_SETTINGS }
}

export const gameSettings = reactive<GameSettings>(loadSettings())

// 自动持久化 + 旧字段迁移
watch(gameSettings, (val) => {
  // 迁移旧字段 showCombatLog → showRightPanel
  if ((val.general as any).showCombatLog !== undefined) {
    val.general.showRightPanel = (val.general as any).showCombatLog
    delete (val.general as any).showCombatLog
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

// 减少动画变化时重新应用
watch(() => gameSettings.general.reduceMotion, () => applyTheme())

// 应用主题 + 字体 + 动画
export function applyTheme(): void {
  // 主题由 ThemeService 管理
  themeService.applyTheme(gameSettings.personalize.theme)

  // 字体大小
  document.documentElement.style.setProperty('--font-size', gameSettings.personalize.fontSize + 'px')

  // 减少动态效果
  if (gameSettings.general.reduceMotion) {
    document.documentElement.classList.add('reduce-motion')
  } else {
    document.documentElement.classList.remove('reduce-motion')
  }
}

// 重置设置
export function resetSettings(): void {
  Object.assign(gameSettings, JSON.parse(JSON.stringify(DEFAULT_SETTINGS)))
  applyTheme()
}
