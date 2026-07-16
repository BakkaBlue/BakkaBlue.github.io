// ==================== 技能系统 ====================
// 负责采集/加工的开始、进度检测、完成结算

import { gameState } from '../state/GameState'
import { eventBus } from '@/engine/events/EventBus'
import { getSkillAction } from '@/data/skills'
// consume 检查不再需要 ITEMS 的 name，name 由 i18n 提供
import { addXp } from './ExperienceSystem'
import { hasItem, removeItem, addItem } from './InventorySystem'
import type { SkillId } from '@/data/skills'
import i18n from '@/shared/i18n'
const { t } = i18n.global

/** 开始一个技能动作 */
export function startAction(skillId: SkillId, actionId: string): boolean {
  const action = getSkillAction(skillId, actionId)
  if (!action) return false

  // 检查材料（加工类）
  if (action.consume) {
    for (const [itemId, qty] of Object.entries(action.consume)) {
      if (!hasItem(itemId, qty)) {
        eventBus.emit('toast', { message: t('toasts.materialLow', { item: t(`items.${itemId}`) }), type: 'danger' })
        return false
      }
    }
  }

  gameState.currentAction = { skill: skillId, actionId, progress: 0, totalTime: action.time }
  eventBus.emit('action:started', { skillId, actionId })
  return true
}

/** 停止当前技能动作 */
export function stopAction(): boolean {
  if (!gameState.currentAction || gameState.currentAction.skill === 'combat') return false
  gameState.currentAction = null
  eventBus.emit('action:stopped')
  return true
}

/** 完成当前动作的结算 */
export function completeAction(): void {
  const ca = gameState.currentAction
  if (!ca) return

  const action = getSkillAction(ca.skill, ca.actionId)
  if (!action) {
    gameState.currentAction = null
    return
  }

  // 消耗材料
  if (action.consume) {
    for (const [itemId, qty] of Object.entries(action.consume)) {
      removeItem(itemId, qty)
    }
  }

  // 产出物品
  if (action.drops) {
    for (const [itemId, qty] of Object.entries(action.drops)) {
      addItem(itemId, qty)
      eventBus.emit('item:acquired', { itemId, qty, source: 'skill' })
    }
  }

  // 经验
  addXp(ca.skill, action.xp)

  // 统计
  if (ca.skill === 'cooking') {
    gameState.stats.cooks++
  } else if (ca.skill !== 'combat') {
    gameState.stats.gathers++
  }

  // 自动继续（加工类检查材料是否充足）
  if (action.consume) {
    const canContinue = Object.entries(action.consume).every(([itemId, qty]) => hasItem(itemId, qty))
    if (!canContinue) {
      eventBus.emit('toast', { message: t('toasts.materialExhausted'), type: 'danger' })
      gameState.currentAction = null
      return
    }
  }

  // 重置进度，继续同动作
  ca.progress = 0
}

/** 更新非战斗动作进度，返回是否完成了一次 */
export function tickActionProgress(dt: number): boolean {
  const ca = gameState.currentAction
  if (!ca || ca.skill === 'combat') return false

  ca.progress += dt
  if (ca.progress >= ca.totalTime) {
    ca.progress -= ca.totalTime
    completeAction()
    return true
  }
  return false
}
