// ==================== 屠杀者系统单元测试 ====================
import { describe, it, expect, beforeEach } from 'vitest'
import { resetState, gameState } from '../state/GameState'
import {
  getAvailableMasters,
  getLockedMasters,
  acceptTask,
  skipTask,
  abandonTask,
  getSkipCost,
  onSlayerKill,
  getAvailableRewards,
  purchaseReward,
} from './SlayerSystem'

beforeEach(() => {
  resetState()
})

describe('getAvailableMasters', () => {
  it('1级战斗等级应只能看到新手导师', () => {
    const masters = getAvailableMasters()
    expect(masters.length).toBe(1)
    expect(masters[0].id).toBe('novice')
  })

  it('战斗等级提高后应解锁更多导师', () => {
    gameState.skills.combat.level = 20
    const masters = getAvailableMasters()
    expect(masters.length).toBeGreaterThanOrEqual(2)
  })

  it('40级应解锁全部导师', () => {
    gameState.skills.combat.level = 50
    const masters = getAvailableMasters()
    expect(masters.length).toBe(3)
    expect(getLockedMasters().length).toBe(0)
  })
})

describe('acceptTask', () => {
  it('应从新手导师处成功接取任务', () => {
    const result = acceptTask('novice')
    expect(result).toBe(true)
    expect(gameState.slayer.activeTask).not.toBeNull()
    const task = gameState.slayer.activeTask!
    expect(task.currentKills).toBe(0)
    expect(task.requiredKills).toBeGreaterThan(0)
    expect(['chicken', 'cow', 'goblin']).toContain(task.enemyId)
  })

  it('已有任务时应拒绝接取新任务', () => {
    acceptTask('novice')
    const result = acceptTask('novice')
    expect(result).toBe(false)
  })

  it('战斗等级不足时应拒绝', () => {
    const result = acceptTask('elite') // 需要战斗40级
    expect(result).toBe(false)
  })

  it('不存在的导师应返回 false', () => {
    const result = acceptTask('nonexistent_master')
    expect(result).toBe(false)
  })

  it('随机任务应生成合理的击杀数范围', () => {
    for (let i = 0; i < 10; i++) {
      gameState.slayer.activeTask = null
      acceptTask('novice')
      const task = gameState.slayer.activeTask!
      expect(task.requiredKills).toBeGreaterThanOrEqual(5)  // 新手池最小 5
      expect(task.requiredKills).toBeLessThanOrEqual(30)    // 新手池最大 30
    }
  })
})

describe('skipTask', () => {
  it('跳过任务应消耗金币并重新分配', () => {
    acceptTask('novice')
    gameState.gold = 500 // 确保足够支付跳过费用
    const beforeGold = gameState.gold
    const result = skipTask()
    expect(result).toBe(true)
    expect(gameState.gold).toBeLessThan(beforeGold)
    // 跳过后应自动接了新任务
    expect(gameState.slayer.activeTask).not.toBeNull()
  })

  it('金币不足时应拒绝跳过', () => {
    acceptTask('novice')
    gameState.gold = 0
    const result = skipTask()
    expect(result).toBe(false)
    expect(gameState.slayer.activeTask).not.toBeNull()
  })
})

describe('abandonTask', () => {
  it('放弃任务应清除当前任务', () => {
    acceptTask('novice')
    abandonTask()
    expect(gameState.slayer.activeTask).toBeNull()
  })

  it('无任务时放弃应返回 false', () => {
    expect(abandonTask()).toBe(false)
  })
})

describe('getSkipCost', () => {
  it('1级跳过费用为 70', () => {
    expect(getSkipCost()).toBe(70)
  })

  it('等级提升后跳过费用增加', () => {
    const cost1 = getSkipCost()
    gameState.skills.slayer.level = 10
    expect(getSkipCost()).toBeGreaterThan(cost1)
  })
})

describe('onSlayerKill', () => {
  it('击杀任务目标应增加计数', () => {
    acceptTask('novice')
    const task = gameState.slayer.activeTask!
    const enemyId = task.enemyId
    task.requiredKills = 5
    task.currentKills = 0

    onSlayerKill(enemyId)
    expect(task.currentKills).toBe(1)
  })

  it('击杀非任务目标不应增加计数', () => {
    acceptTask('novice')
    const task = gameState.slayer.activeTask!
    const before = task.currentKills

    // 击杀一个不在任务里的怪物
    onSlayerKill('dragon_lord')
    expect(task.currentKills).toBe(before)
  })

  it('无任务时不应报错', () => {
    expect(() => onSlayerKill('chicken')).not.toThrow()
  })

  it('完成任务应发放奖励并清除任务', () => {
    acceptTask('novice')
    const task = gameState.slayer.activeTask!
    task.requiredKills = 1
    task.currentKills = 0

    const pointsBefore = gameState.slayer.points
    const xpBefore = gameState.skills.slayer.xp
    const completedBefore = gameState.slayer.tasksCompleted

    onSlayerKill(task.enemyId)

    // 任务应已完成
    expect(gameState.slayer.activeTask).toBeNull()
    expect(gameState.slayer.points).toBeGreaterThan(pointsBefore)
    expect(gameState.slayer.tasksCompleted).toBe(completedBefore + 1)
    // 应该有 XP 增长
    expect(gameState.skills.slayer.xp).toBeGreaterThanOrEqual(xpBefore)
  })
})

describe('奖励商店', () => {
  it('新手应看到可购买的奖励', () => {
    const rewards = getAvailableRewards()
    expect(rewards.length).toBeGreaterThan(0)
    expect(rewards.some(r => r.id === 'slayer_ring')).toBe(true)
  })

  it('点数不足时应拒绝购买', () => {
    gameState.slayer.points = 0
    const result = purchaseReward('slayer_ring') // 需要30点
    expect(result).toBe(false)
  })

  it('点数足够时应成功购买', () => {
    gameState.slayer.points = 50
    const result = purchaseReward('slayer_ring')
    expect(result).toBe(true)
    expect(gameState.slayer.points).toBe(20) // 50 - 30
    expect(gameState.slayer.purchasedRewards).toContain('slayer_ring')
  })

  it('不能重复购买', () => {
    gameState.slayer.points = 100
    purchaseReward('slayer_ring')
    const result = purchaseReward('slayer_ring')
    expect(result).toBe(false)
  })

  it('unlock 类型奖励应直接发放物品', () => {
    gameState.slayer.points = 50
    purchaseReward('slayer_ring')
    expect(gameState.inventory['slayer_ring']).toBe(1)
  })

  it('permanent 类型奖励应在已购列表中', () => {
    gameState.slayer.points = 100
    gameState.skills.slayer.level = 5 // bigger_tasks 需要 Lv.5
    purchaseReward('bigger_tasks')
    expect(gameState.slayer.purchasedRewards).toContain('bigger_tasks')
    expect(gameState.inventory['bigger_tasks']).toBeUndefined() // 不发放物品
  })
})
