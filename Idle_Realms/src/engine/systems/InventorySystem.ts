// ==================== 背包系统 ====================
// 负责物品增删查

import { gameState } from '../state/GameState'

/** 添加物品 */
export function addItem(itemId: string, qty: number = 1): void {
  gameState.inventory[itemId] = (gameState.inventory[itemId] || 0) + qty
}

/** 移除物品，返回是否成功 */
export function removeItem(itemId: string, qty: number = 1): boolean {
  const current = gameState.inventory[itemId]
  if (!current || current < qty) return false
  gameState.inventory[itemId] -= qty
  if (gameState.inventory[itemId] <= 0) {
    delete gameState.inventory[itemId]
  }
  return true
}

/** 检查物品是否足够 */
export function hasItem(itemId: string, qty: number = 1): boolean {
  return (gameState.inventory[itemId] || 0) >= qty
}

/** 获取物品数量 */
export function getItemQty(itemId: string): number {
  return gameState.inventory[itemId] || 0
}
