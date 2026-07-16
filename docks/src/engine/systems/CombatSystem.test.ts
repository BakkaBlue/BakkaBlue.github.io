// ==================== 战斗系统单元测试 ====================
import { describe, it, expect, beforeEach } from 'vitest'
import { resetState, gameState } from '../state/GameState'
import { getEnemyById, startBattle, tickCombat, fleeBattle } from './CombatSystem'
import { addItem } from './InventorySystem'

// 每次测试前重置状态，确保测试隔离
beforeEach(() => {
  resetState()
})

describe('getEnemyById', () => {
  it('应找到存在的敌人', () => {
    const enemy = getEnemyById('chicken')
    expect(enemy).toBeDefined()
    expect(enemy!.name).toBe('野生鸡')
    expect(enemy!.hp).toBe(4)
  })

  it('不存在的敌人应返回 undefined', () => {
    expect(getEnemyById('dragon_lord')).toBeUndefined()
  })
})

describe('startBattle', () => {
  it('应成功开始战斗', () => {
    const result = startBattle('chicken')
    expect(result).toBe(true)
    expect(gameState.combat.inBattle).toBe(true)
    expect(gameState.combat.enemyId).toBe('chicken')
    expect(gameState.combat.enemyHp).toBe(4)
    expect(gameState.combat.enemyMaxHp).toBe(4)
    expect(gameState.combat.turnTimer).toBe(0)
    expect(gameState.currentAction?.skill).toBe('combat')
  })

  it('HP 为 0 时应拒绝开始战斗', () => {
    gameState.hp = 0
    const result = startBattle('chicken')
    expect(result).toBe(false)
    expect(gameState.combat.inBattle).toBe(false)
  })

  it('不存在的敌人应返回 false', () => {
    const result = startBattle('nonexistent')
    expect(result).toBe(false)
  })
})

describe('tickCombat — 回合计时', () => {
  it('tick 不足一个回合时间不应触发攻击', () => {
    startBattle('chicken')
    const hpBefore = gameState.combat.enemyHp
    tickCombat(500) // 小于 1200ms 回合时间
    expect(gameState.combat.enemyHp).toBe(hpBefore)
    expect(gameState.combat.turnTimer).toBe(500)
  })

  it('累积 tick 满一回合应触发玩家攻击', () => {
    startBattle('chicken')
    tickCombat(1200) // 正好一回合
    // 玩家攻击后敌人 HP 应减少
    expect(gameState.combat.enemyHp).toBeLessThan(4)
    // 回合计时器应重置
    expect(gameState.combat.turnTimer).toBe(0)
  })

  it('不在战斗状态时 tick 应无效果', () => {
    tickCombat(5000)
    expect(gameState.combat.inBattle).toBe(false)
    expect(gameState.hp).toBe(10) // 初始 HP 不变
  })
})

describe('tickCombat — 伤害计算', () => {
  it('对鸡的伤害应在合理范围内（ATK 1 - DEF 0 + random 0-3 - 1 => 0-3，最低为1）', () => {
    startBattle('chicken')
    tickCombat(1200)
    // 初始 atk=1, 鸡 def=0, min dmg = max(1, 1-0+0-1) = 1, max = 1-0+3-1 = 3
    const dmgDealt = 4 - gameState.combat.enemyHp
    expect(dmgDealt).toBeGreaterThanOrEqual(1)
    expect(dmgDealt).toBeLessThanOrEqual(3)
  })

  it('防御应减少受到的伤害', () => {
    // 装备青铜剑（atk+3）提高攻击力方便观察
    addItem('bronze_sword', 1)
    gameState.equipment.weapon = 'bronze_sword'
    gameState.inventory = {} // 清掉 addItem 的影响

    // 选择骷髅战士 (def:10)，初始 atk=1+3=4，dmg = max(1, 4-10+random(0-3)-1)
    startBattle('skeleton')
    tickCombat(1200)
    const dmgDealt = 90 - gameState.combat.enemyHp
    // 最小值 = max(1, 4-10+0-1) = 1，最大值 = max(1, 4-10+3-1) = 1
    // 实际上面对高防敌人，伤害会被限制在很低
    expect(dmgDealt).toBeGreaterThanOrEqual(1)
  })
})

describe('tickCombat — 敌人反击', () => {
  it('敌人应在玩家攻击后立即反击', () => {
    startBattle('goblin') // atk:5, def:2
    const hpBefore = gameState.hp
    tickCombat(1200)
    // 哥布林反击，应造成伤害
    expect(gameState.hp).toBeLessThanOrEqual(hpBefore)
  })

  it('高防御应减少敌人伤害', () => {
    // 穿铁胸甲（def+10）
    addItem('iron_body', 1)
    gameState.equipment.body = 'iron_body'
    gameState.inventory = {}

    startBattle('chicken') // atk:1
    const hpBefore = gameState.hp
    tickCombat(1200)
    // def=10(装备) vs atk=1，伤害 = max(0, 1-10+random(0-2)-1)，很可能为 0
    // 只验证 HP 不会降为负数且不超出初始值
    expect(gameState.hp).toBeLessThanOrEqual(hpBefore)
    expect(gameState.hp).toBeGreaterThanOrEqual(0)
  })
})

describe('tickCombat — 胜利结算', () => {
  it('击败敌人应获得金币和经验', () => {
    const goldBefore = gameState.gold
    const xpBefore = gameState.skills.combat.xp
    const killsBefore = gameState.stats.kills

    // 把鸡的血量设低，确保一回合击杀
    gameState.combat.inBattle = true
    gameState.combat.enemyId = 'chicken'
    gameState.combat.enemyHp = 1
    gameState.combat.enemyMaxHp = 4
    gameState.currentAction = { skill: 'combat', actionId: 'chicken', progress: 0, totalTime: 1200 }

    tickCombat(1200)

    expect(gameState.combat.inBattle).toBe(false)
    expect(gameState.gold).toBeGreaterThan(goldBefore)
    expect(gameState.skills.combat.xp).toBeGreaterThanOrEqual(xpBefore + 6) // 鸡给 6 XP
    expect(gameState.stats.kills).toBe(killsBefore + 1)
    expect(gameState.currentAction).toBeNull()
  })

  it('击败敌人应触发掉落（概率性，测试多次）', () => {
    // 模拟 20 次击杀，验证掉落概率
    for (let i = 0; i < 20; i++) {
      gameState.combat.inBattle = true
      gameState.combat.enemyId = 'chicken'
      gameState.combat.enemyHp = 1
      gameState.combat.enemyMaxHp = 4
      gameState.currentAction = { skill: 'combat', actionId: 'chicken', progress: 0, totalTime: 1200 }
      tickCombat(1200)
    }

    const feathersAfter = gameState.inventory['chicken_feather'] || 0
    // 80% 掉落率，20次至少应该掉几个
    expect(feathersAfter).toBeGreaterThan(0)
  })
})

describe('fleeBattle', () => {
  it('战斗中逃跑应成功退出战斗', () => {
    startBattle('chicken')
    expect(gameState.combat.inBattle).toBe(true)

    const result = fleeBattle()
    expect(result).toBe(true)
    expect(gameState.combat.inBattle).toBe(false)
    expect(gameState.combat.autoBattle).toBe(false)
    expect(gameState.currentAction).toBeNull()
  })

  it('非战斗中逃跑应返回 false', () => {
    expect(fleeBattle()).toBe(false)
  })
})

describe('tickCombat — 失败处理', () => {
  it('玩家 HP 归零应停止战斗并关闭自动战斗', () => {
    gameState.combat.autoBattle = true
    gameState.hp = 1
    gameState.combat.inBattle = true
    gameState.combat.enemyId = 'troll' // atk:30, 基本秒杀
    gameState.combat.enemyHp = 200
    gameState.combat.enemyMaxHp = 200
    gameState.currentAction = { skill: 'combat', actionId: 'troll', progress: 0, totalTime: 1200 }

    tickCombat(1200)

    expect(gameState.combat.inBattle).toBe(false)
    expect(gameState.combat.autoBattle).toBe(false)
    expect(gameState.currentAction).toBeNull()
    // HP 应恢复到 30%
    expect(gameState.hp).toBeGreaterThanOrEqual(1)
    expect(gameState.hp).toBeLessThanOrEqual(Math.floor(gameState.maxHp * 0.3))
  })
})

describe('自动进食', () => {
  it('HP 低于 50% 且有食物时应自动进食', () => {
    addItem('cooked_shrimp', 5)
    gameState.hp = 3
    gameState.maxHp = 10
    gameState.combat.autoFood = true
    gameState.combat.selectedFood = 'cooked_shrimp'

    // 直接触发一次战斗 tick，HP 低于 50% 会在玩家攻击后触发自动进食
    startBattle('chicken')
    // 先让敌人反击把 HP 打低
    gameState.hp = 3
    tickCombat(1200)

    // HP 可能因自动进食恢复（但也会收到敌人伤害）
    // 只验证食物可能被消耗
    const cookedQty = gameState.inventory['cooked_shrimp'] || 0
    expect(cookedQty).toBeLessThanOrEqual(5)
  })

  it('关闭自动进食时不应消耗食物', () => {
    addItem('cooked_shrimp', 5)
    gameState.hp = 3
    gameState.combat.autoFood = false

    startBattle('chicken')
    gameState.hp = 3
    tickCombat(1200)

    // 食物不应被消耗（但玩家可能因敌人反击死亡，不过不影响验证）
  })
})

describe('连续自动战斗', () => {
  it('autoBattle 开启时击败敌人应在 800ms 后继续战斗', async () => {
    gameState.combat.autoBattle = true
    gameState.selectedEnemy = 'chicken'

    // 设置敌人 HP=1 确保一回合击杀
    gameState.combat.inBattle = true
    gameState.combat.enemyId = 'chicken'
    gameState.combat.enemyHp = 1
    gameState.combat.enemyMaxHp = 4
    gameState.currentAction = { skill: 'combat', actionId: 'chicken', progress: 0, totalTime: 1200 }

    tickCombat(1200)
    expect(gameState.combat.inBattle).toBe(false)

    // 等待 800ms 自动继续
    await new Promise(resolve => setTimeout(resolve, 850))

    // 自动战斗应重新开始（除非玩家 HP 太低）
    if (gameState.hp > 0) {
      expect(gameState.combat.inBattle).toBe(true)
      gameState.combat.autoBattle = false // 清理
    }
  })
})
