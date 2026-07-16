// ==================== 城镇系统 ====================

import { gameState } from '../state/GameState'
import { eventBus } from '@/engine/events/EventBus'
import { BUILDINGS, type BuildingConfig } from '@/data/buildings'
import { FACILITIES } from '@/data/facilities'
import { TOWN_SHOP_ITEMS } from '@/data/town-shop'
import { hasItem, removeItem, addItem } from './InventorySystem'
import type { ActiveBuff } from '../state/types'
import i18n from '@/shared/i18n'
const { t } = i18n.global

// ==================== 建筑（全局加成） ====================

export function getBuildingLevel(buildingId: string): number {
  return gameState.town.buildings[buildingId] ?? 0
}

export function getUpgradeCost(buildingId: string): Record<string, number> {
  const b = BUILDINGS[buildingId]
  if (!b) return {}
  const lvl = getBuildingLevel(buildingId)
  const cost: Record<string, number> = {}
  for (const [res, baseQty] of Object.entries(b.cost)) {
    cost[res] = Math.floor(baseQty * Math.pow(b.costMultiplier, lvl))
  }
  return cost
}

export function canUpgrade(buildingId: string): boolean {
  const cost = getUpgradeCost(buildingId)
  if (cost.gold && gameState.gold < cost.gold) return false
  for (const [res, qty] of Object.entries(cost)) {
    if (res === 'gold') continue
    if (!hasItem(res, qty)) return false
  }
  return true
}

export function upgradeBuilding(buildingId: string): boolean {
  const b = BUILDINGS[buildingId]
  if (!b) return false
  const cost = getUpgradeCost(buildingId)
  if (cost.gold && gameState.gold < cost.gold) { eventBus.emit('toast', { message: t('toasts.goldInsufficient'), type: 'danger' }); return false }
  for (const [res, qty] of Object.entries(cost)) {
    if (res === 'gold') continue
    if (!hasItem(res, qty)) { eventBus.emit('toast', { message: t('toasts.resourceInsufficient', { item: t(`items.${res}`) }), type: 'danger' }); return false }
  }
  if (cost.gold) gameState.gold -= cost.gold
  for (const [res, qty] of Object.entries(cost)) { if (res === 'gold') continue; removeItem(res, qty) }
  gameState.town.buildings[buildingId] = (gameState.town.buildings[buildingId] ?? 0) + 1
  eventBus.emit('town:upgraded', { buildingId, buildingName: b.name, newLevel: gameState.town.buildings[buildingId] })
  return true
}

export function getAllBuildings(): (BuildingConfig & { level: number })[] {
  return Object.values(BUILDINGS).map(b => ({ ...b, level: getBuildingLevel(b.id) }))
}

// ==================== 设施（被动产出城镇资源） ====================

export function getFacilityLevel(facilityId: string): number {
  return gameState.town.facilities[facilityId] ?? 0
}

export function getFacilityCost(facilityId: string): number {
  const f = FACILITIES[facilityId]
  if (!f) return 0
  return Math.floor(f.baseCost * Math.pow(f.costMultiplier, getFacilityLevel(facilityId)))
}

export function upgradeFacility(facilityId: string): boolean {
  const f = FACILITIES[facilityId]
  if (!f) return false
  const cost = getFacilityCost(facilityId)
  if (gameState.gold < cost) { eventBus.emit('toast', { message: t('toasts.goldInsufficient'), type: 'danger' }); return false }
  gameState.gold -= cost
  gameState.town.facilities[facilityId] = (gameState.town.facilities[facilityId] ?? 0) + 1
  eventBus.emit('town:facility-upgraded', { facilityId, name: f.name, newLevel: gameState.town.facilities[facilityId] })
  return true
}

/** 计算设施当前产出速率（每秒） */
export function getFacilityRate(facilityId: string): number {
  const f = FACILITIES[facilityId]
  if (!f) return 0
  const lvl = getFacilityLevel(facilityId)
  return f.baseRate * lvl   // 0级不产出
}

/** 每 tick 更新所有设施产出（由 GameEngine 调用） */
export function tickFacilities(dt: number): void {
  for (const f of Object.values(FACILITIES)) {
    const lvl = getFacilityLevel(f.id)
    if (lvl <= 0) continue
    const rate = (f.baseRate * lvl) / 1000 // 转换为毫秒速率
    gameState.town.storage[f.resourceId] = (gameState.town.storage[f.resourceId] ?? 0) + rate * dt
  }
}

// ==================== 军需商店 ====================

export function getTownShopItems() {
  return TOWN_SHOP_ITEMS
}

export function canBuyTownItem(itemId: string): boolean {
  const item = TOWN_SHOP_ITEMS.find(i => i.id === itemId)
  if (!item) return false
  for (const [res, qty] of Object.entries(item.cost)) {
    if ((gameState.town.storage[res] ?? 0) < qty) return false
  }
  return true
}

export function buyTownItem(itemId: string): boolean {
  const item = TOWN_SHOP_ITEMS.find(i => i.id === itemId)
  if (!item) return false
  for (const [res, qty] of Object.entries(item.cost)) {
    if ((gameState.town.storage[res] ?? 0) < qty) {
      eventBus.emit('toast', { message: t('toasts.townResourceInsufficient'), type: 'danger' })
      return false
    }
  }
  for (const [res, qty] of Object.entries(item.cost)) {
    gameState.town.storage[res] -= qty
  }
  if (item.type === 'buff' && item.buffKey) {
    gameState.buffs.push({
      id: item.id,
      name: item.name,
      icon: item.icon,
      key: item.buffKey,
      value: item.buffValue ?? 1,
      expires: Date.now() + (item.buffDuration ?? 0),
    })
    eventBus.emit('toast', { message: t('toasts.usedBuff', { item: t(`townShop.${item.id}.name`) }), type: 'success' })
  } else if (item.type === 'item' && item.itemId) {
    addItem(item.itemId, 1)
    eventBus.emit('toast', { message: t('toasts.redeemed', { item: t(`items.${item.itemId}`) }), type: 'success' })
  }
  return true
}

// ==================== Buff 系统 ====================

/** 获取当前生效的某个 Buff 总倍率（叠加相乘） */
export function getBuffValue(key: string): number {
  let val = 1
  for (const b of gameState.buffs) {
    if (b.key === key && b.expires > Date.now()) val *= b.value
  }
  return val
}

/** 清理过期 Buff（由 GameEngine 调用） */
export function cleanExpiredBuffs(): void {
  const now = Date.now()
  gameState.buffs = gameState.buffs.filter(b => b.expires > now)
}

/** 获取当前活跃 Buff 列表（含剩余时间） */
export function getActiveBuffs(): (ActiveBuff & { remaining: number })[] {
  const now = Date.now()
  return gameState.buffs
    .filter(b => b.expires > now)
    .map(b => ({ ...b, remaining: Math.ceil((b.expires - now) / 1000) }))
}
