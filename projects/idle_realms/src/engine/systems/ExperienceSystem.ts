// ==================== 经验系统 ====================
// 负责经验获取、升级检测

import { gameState } from '../state/GameState'
import { eventBus } from '@/engine/events/EventBus'
import { XP_BASE, XP_EXPONENT, HP_PER_LEVEL, HP_BASE } from '@/data/formulas'
import { getBuffValue } from './TownSystem'
import type { SkillId } from '@/data/skills'

/** 计算升到指定等级所需的总经验 */
export function xpForLevel(level: number): number {
  return Math.floor(XP_BASE * Math.pow(level, XP_EXPONENT))
}

/** 添加经验，自动处理升级 */
export function addXp(skillId: SkillId, amount: number): boolean {
  const s = gameState.skills[skillId]
  if (!s) return false

  // Buff 加成（智者卷轴等）
  const multiplier = getBuffValue('exp_mult')
  const finalAmount = Math.floor(amount * multiplier)

  s.xp += finalAmount
  let leveledUp = false

  while (s.xp >= xpForLevel(s.level)) {
    s.xp -= xpForLevel(s.level)
    s.level++
    leveledUp = true

    // 升级时更新最大 HP（仅战斗技能）
    if (skillId === 'combat') {
      gameState.maxHp = HP_BASE + (s.level - 1) * HP_PER_LEVEL
      gameState.hp = Math.min(gameState.hp + HP_PER_LEVEL, gameState.maxHp)
    }

    eventBus.emit('skill:levelup', { skillId, newLevel: s.level })
  }

  return leveledUp
}

/** 获取当前技能升级所需经验 */
export function xpToNextLevel(skillId: SkillId): number {
  const s = gameState.skills[skillId]
  if (!s) return 0
  return xpForLevel(s.level)
}

/** 获取当前技能经验进度（0-1） */
export function xpProgress(skillId: SkillId): number {
  const s = gameState.skills[skillId]
  if (!s) return 0
  return s.xp / xpForLevel(s.level)
}
