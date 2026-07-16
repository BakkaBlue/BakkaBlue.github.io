// ==================== 装备系统 ====================
// 负责穿脱装备、属性汇总计算

import { gameState } from '../state/GameState'
import { ITEMS } from '@/data/items'
import type { EquipmentSlot } from '@/data/items'

/** 穿戴装备，返回被替换的旧装备（如果有） */
export function equipItem(itemId: string): string | null {
  const item = ITEMS[itemId]
  if (!item || !item.slot) return null

  // 检查是否拥有该物品
  const currentQty = gameState.inventory[itemId]
  if (!currentQty || currentQty < 1) return null

  const slot = item.slot as EquipmentSlot
  const oldItemId = gameState.equipment[slot]

  // 脱下旧装备（放回背包）
  if (oldItemId) {
    gameState.inventory[oldItemId] = (gameState.inventory[oldItemId] || 0) + 1
  }

  // 穿新装备（从背包移除）
  gameState.inventory[itemId] -= 1
  if (gameState.inventory[itemId] <= 0) delete gameState.inventory[itemId]

  gameState.equipment[slot] = itemId
  return oldItemId
}

/** 脱掉装备 */
export function unequipSlot(slot: EquipmentSlot): string | null {
  const itemId = gameState.equipment[slot]
  if (!itemId) return null

  // 放回背包
  gameState.inventory[itemId] = (gameState.inventory[itemId] || 0) + 1
  gameState.equipment[slot] = null
  return itemId
}

/** 获取玩家总攻击力 */
export function getPlayerAtk(): number {
  let atk = Math.floor(gameState.skills.combat.level * 0.25) + 1
  for (const itemId of Object.values(gameState.equipment)) {
    if (itemId && ITEMS[itemId]?.atk) {
      atk += ITEMS[itemId].atk!
    }
  }
  return atk
}

/** 获取玩家总防御力 */
export function getPlayerDef(): number {
  let def = Math.floor(gameState.skills.combat.level * 0.25)
  for (const itemId of Object.values(gameState.equipment)) {
    if (itemId && ITEMS[itemId]?.def) {
      def += ITEMS[itemId].def!
    }
  }
  return def
}

/** 检查某个槽位是否装备了物品 */
export function isEquipped(itemId: string): boolean {
  return Object.values(gameState.equipment).includes(itemId)
}
