// ==================== 食物系统 ====================
// 负责食物恢复、Buff 管理

import { gameState } from '../state/GameState'
import { eventBus } from '@/engine/events/EventBus'
import { ITEMS } from '@/data/items'
import { hasItem, removeItem } from './InventorySystem'

/** 使用食物恢复 HP */
export function eatFood(foodId: string): boolean {
  const item = ITEMS[foodId]
  if (!item || !item.heal) return false
  if (!hasItem(foodId, 1)) return false

  removeItem(foodId, 1)
  const healAmount = Math.min(item.heal, gameState.maxHp - gameState.hp)
  gameState.hp += healAmount

  eventBus.emit('food:eaten', { foodId, healAmount })
  return true
}
