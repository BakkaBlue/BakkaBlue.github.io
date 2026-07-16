// ==================== 经济系统 ====================
// 负责金币收支

import { gameState } from '../state/GameState'
import { getBuffValue } from './TownSystem'

/** 增加金币（自动应用 Buff 加成） */
export function addGold(amount: number): void {
  const multiplier = getBuffValue('gold_mult')
  const finalAmount = Math.floor(amount * multiplier)
  gameState.gold += finalAmount
  gameState.stats.totalGold += finalAmount
}

/** 扣除金币，返回是否成功 */
export function spendGold(amount: number): boolean {
  if (gameState.gold < amount) return false
  gameState.gold -= amount
  return true
}

/** 检查金币是否足够 */
export function hasGold(amount: number): boolean {
  return gameState.gold >= amount
}
