// ==================== UI 状态独立模块 ====================
// 与游戏状态分离，不参与存档
// 组件可直接读取

import { reactive } from 'vue'
import { ViewType } from '@/engine/state/types'
import type { SkillId } from '@/data/skills'

/** 全局 UI 状态（不持久化） */
export const uiState = reactive({
  currentView: ViewType.SkillGrid as ViewType,
  currentCategory: 'noncombat' as 'noncombat' | 'combat',
  favorites: [] as SkillId[],
  detailSkillId: null as SkillId | null,
})

/** 重置为默认 UI 状态（退出游戏时调用） */
export function resetUIState(): void {
  uiState.currentView = ViewType.SkillGrid
  uiState.currentCategory = 'noncombat'
  uiState.favorites = []
  uiState.detailSkillId = null
}
