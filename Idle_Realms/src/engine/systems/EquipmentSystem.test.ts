// ==================== 装备系统单元测试 ====================
import { describe, it, expect, beforeEach } from 'vitest'
import { resetState, gameState } from '../state/GameState'
import { equipItem, unequipSlot, getPlayerAtk, getPlayerDef, isEquipped } from './EquipmentSystem'
import { addItem, hasItem } from './InventorySystem'

beforeEach(() => {
  resetState()
})

describe('getPlayerAtk / getPlayerDef', () => {
  it('1级玩家基础攻击力应为 1', () => {
    expect(getPlayerAtk()).toBe(1)
  })

  it('1级玩家基础防御力应为 0', () => {
    expect(getPlayerDef()).toBe(0)
  })

  it('装备武器应增加攻击力', () => {
    addItem('bronze_sword', 1) // atk:3
    equipItem('bronze_sword')
    expect(getPlayerAtk()).toBe(1 + 3) // 基础1 + 青铜剑3
  })

  it('装备防具应增加防御力', () => {
    addItem('bronze_body', 1) // def:4
    equipItem('bronze_body')
    expect(getPlayerDef()).toBe(0 + 4)
  })

  it('战斗等级提升应增加基础攻击和防御', () => {
    gameState.skills.combat.level = 5
    // 每4级+1，5级 => floor(5*0.25)=1
    expect(getPlayerAtk()).toBe(1 + 1)
    expect(getPlayerDef()).toBe(0 + 1)
  })
})

describe('equipItem', () => {
  it('应成功装备武器', () => {
    addItem('bronze_sword', 1)
    const old = equipItem('bronze_sword')
    expect(old).toBeNull() // 之前该槽位为空
    expect(gameState.equipment.weapon).toBe('bronze_sword')
    expect(hasItem('bronze_sword', 1)).toBe(false) // 从背包移除
  })

  it('装备已占用的槽位应替换旧装备并放回背包', () => {
    addItem('bronze_sword', 1)
    addItem('iron_sword', 1)
    equipItem('bronze_sword')
    const old = equipItem('iron_sword')
    expect(old).toBe('bronze_sword')
    expect(gameState.equipment.weapon).toBe('iron_sword')
    expect(hasItem('bronze_sword', 1)).toBe(true) // 旧装备回到背包
  })

  it('不拥有装备时应返回 null', () => {
    const result = equipItem('mithril_sword') // 背包中没有
    expect(result).toBeNull()
    expect(gameState.equipment.weapon).toBeNull()
  })
})

describe('unequipSlot', () => {
  it('应成功脱下装备并放回背包', () => {
    addItem('bronze_sword', 1)
    equipItem('bronze_sword')
    const unequipped = unequipSlot('weapon')
    expect(unequipped).toBe('bronze_sword')
    expect(gameState.equipment.weapon).toBeNull()
    expect(hasItem('bronze_sword', 1)).toBe(true)
  })

  it('空槽位脱下应返回 null', () => {
    expect(unequipSlot('helmet')).toBeNull()
  })
})

describe('isEquipped', () => {
  it('装备中的物品应返回 true', () => {
    addItem('bronze_sword', 1)
    equipItem('bronze_sword')
    expect(isEquipped('bronze_sword')).toBe(true)
  })

  it('未装备的物品应返回 false', () => {
    addItem('bronze_sword', 1)
    expect(isEquipped('bronze_sword')).toBe(false)
  })
})
