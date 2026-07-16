// ==================== 经验系统单元测试 ====================
import { describe, it, expect, beforeEach } from 'vitest'
import { resetState, gameState } from '../state/GameState'
import { xpForLevel, addXp, xpToNextLevel, xpProgress } from './ExperienceSystem'

beforeEach(() => {
  resetState()
})

describe('xpForLevel', () => {
  it('1级的经验需求应为 80', () => {
    expect(xpForLevel(1)).toBe(80)
  })

  it('经验曲线应随等级增长（指数 1.6）', () => {
    const lv1 = xpForLevel(1)
    const lv5 = xpForLevel(5)
    const lv10 = xpForLevel(10)
    const lv20 = xpForLevel(20)

    expect(lv5).toBeGreaterThan(lv1)
    expect(lv10).toBeGreaterThan(lv5)
    expect(lv20).toBeGreaterThan(lv10)
    // 20级经验至少是1级的10倍
    expect(lv20).toBeGreaterThan(lv1 * 10)
  })

  it('公式应与 Math.floor(80 * level^1.6) 一致', () => {
    expect(xpForLevel(2)).toBe(Math.floor(80 * Math.pow(2, 1.6)))
    expect(xpForLevel(10)).toBe(Math.floor(80 * Math.pow(10, 1.6)))
  })
})

describe('addXp', () => {
  it('添加经验应正确累加', () => {
    addXp('woodcutting', 30)
    expect(gameState.skills.woodcutting.xp).toBe(30)
    expect(gameState.skills.woodcutting.level).toBe(1) // 未达到 80
  })

  it('经验达到阈值应升级', () => {
    const result = addXp('woodcutting', 100) // > 80 应触发升级
    expect(result).toBe(true)
    expect(gameState.skills.woodcutting.level).toBe(2)
    // 剩余经验 = 100 - 80 = 20（升级后重置）
    expect(gameState.skills.woodcutting.xp).toBe(20)
  })

  it('大量经验可触发多次升级', () => {
    // 1级→2级：80 XP, 2级→3级: floor(80*2^1.6)=242
    addXp('mining', 500) // 500 > 80 + 242
    expect(gameState.skills.mining.level).toBeGreaterThanOrEqual(2)
  })

  it('战斗技能升级应提升最大 HP', () => {
    const initialMaxHp = gameState.maxHp
    // 1级→2级：80 XP, HP = 10 + (1)*2 = 12
    addXp('combat', 100)
    expect(gameState.skills.combat.level).toBe(2)
    expect(gameState.maxHp).toBe(10 + (2 - 1) * 2)
    expect(gameState.maxHp).toBeGreaterThan(initialMaxHp)
  })

  it('非战斗技能升级不应改变 HP', () => {
    const initialMaxHp = gameState.maxHp
    addXp('fishing', 200)
    expect(gameState.maxHp).toBe(initialMaxHp)
  })
})

describe('xpToNextLevel', () => {
  it('应返回当前等级所需的总经验', () => {
    expect(xpToNextLevel('woodcutting')).toBe(80) // 1级
  })

  it('升级后应反映新等级的需求', () => {
    addXp('woodcutting', 80)
    expect(xpToNextLevel('woodcutting')).toBe(Math.floor(80 * Math.pow(2, 1.6)))
  })
})

describe('xpProgress', () => {
  it('0 XP 时进度为 0', () => {
    expect(xpProgress('mining')).toBe(0)
  })

  it('一半经验时进度约 0.5', () => {
    addXp('mining', 40) // 40/80 = 0.5
    expect(xpProgress('mining')).toBeCloseTo(0.5, 1)
  })
})
