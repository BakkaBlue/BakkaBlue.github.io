// ==================== 离线引擎 ====================
// 负责计算离线期间的收益，玩家上线时一次性结算

import { gameState } from '../state/GameState'
import { eventBus } from '@/engine/events/EventBus'
import type { OfflineReport, OfflineSkillResult, OfflineCombatResult } from '../state/types'
import { getSkillAction } from '@/data/skills'
import { ENEMIES, type MonsterConfig } from '@/data/monsters'
import { addXp } from '../systems/ExperienceSystem'
import { addItem } from '../systems/InventorySystem'
import { addGold } from '../systems/EconomySystem'
import { getPlayerAtk, getPlayerDef } from '../systems/EquipmentSystem'
import {
  MAX_OFFLINE_HOURS_FREE,
  MAX_OFFLINE_COMBATS,
} from '@/data/formulas'
import type { SkillId } from '@/data/skills'

const MS_PER_HOUR_VAL = 3600_000

/** 计算并结算离线收益 */
export function calculateOfflineProgress(): OfflineReport | null {
  const now = Date.now()
  const elapsed = now - gameState.lastSaveTime

  // 忽略不足 1 秒的"离线"
  if (elapsed < 1000) return null

  const maxOffline = MAX_OFFLINE_HOURS_FREE * MS_PER_HOUR_VAL
  const cappedElapsed = Math.min(elapsed, maxOffline)
  const ca = gameState.currentAction

  const report: OfflineReport = {
    elapsedMs: cappedElapsed,
    elapsedFormatted: formatDuration(cappedElapsed),
    skillResults: [],
    combatResult: null,
    levelUps: [],
  }

  if (!ca) return report

  if (ca.skill === 'combat') {
    report.combatResult = calculateOfflineCombat(cappedElapsed)
  } else {
    report.skillResults = calculateOfflineSkill(ca.skill, ca.actionId, cappedElapsed)
  }

  // 检测升级
  report.levelUps = [] // 由 UI 层根据升级事件收集

  gameState.lastSaveTime = now
  gameState.lastTickTime = now

  eventBus.emit('offline:calculated', report)
  return report
}

/** 计算离线技能收益 */
function calculateOfflineSkill(skillId: SkillId, actionId: string, elapsed: number): OfflineSkillResult[] {
  const action = getSkillAction(skillId, actionId)
  if (!action) return []

  const cycles = Math.floor(elapsed / action.time)
  if (cycles <= 0) return []

  const result: OfflineSkillResult = {
    skillId,
    actionName: action.name,
    cycles,
    items: {},
    totalXp: 0,
  }

  // 如果是消耗类（烹饪），先检查材料能支撑多少次
  let actualCycles = cycles
  if (action.consume) {
    let maxByMaterial = Infinity
    for (const [itemId, qty] of Object.entries(action.consume)) {
      const owned = gameState.inventory[itemId] || 0
      maxByMaterial = Math.min(maxByMaterial, Math.floor(owned / qty))
    }
    actualCycles = Math.min(cycles, maxByMaterial)

    // 消耗材料
    if (action.consume) {
      for (const [itemId, qty] of Object.entries(action.consume)) {
        gameState.inventory[itemId] = (gameState.inventory[itemId] || 0) - qty * actualCycles
        if (gameState.inventory[itemId] <= 0) delete gameState.inventory[itemId]
      }
    }
  }

  // 产出物品
  if (action.drops && actualCycles > 0) {
    for (const [itemId, qty] of Object.entries(action.drops)) {
      const totalQty = qty * actualCycles
      addItem(itemId, totalQty)
      result.items[itemId] = totalQty
    }
  }

  // 经验
  result.totalXp = action.xp * actualCycles
  addXp(skillId, result.totalXp)

  // 统计
  if (skillId === 'cooking') {
    gameState.stats.cooks += actualCycles
  } else {
    gameState.stats.gathers += actualCycles
  }

  // 保留余数进度（上线后继续从剩余时间开始）
  if (gameState.currentAction) {
    gameState.currentAction.progress = elapsed % action.time
  }

  return [result]
}

/** 计算离线战斗收益（简化模拟） */
function calculateOfflineCombat(elapsed: number): OfflineCombatResult | null {
  const enemy = ENEMIES.find(e => e.id === gameState.selectedEnemy)
  if (!enemy) return null

  // 估算每场战斗平均时间（基于玩家属性 vs 怪物属性）
  const avgTurnsPerFight = estimateTurnsPerFight(enemy)
  const avgFightTime = avgTurnsPerFight * 1200 + 1500 // 含间隔
  const maxBattles = Math.min(MAX_OFFLINE_COMBATS, Math.floor(elapsed / avgFightTime))
  if (maxBattles <= 0) return null

  // 估算胜率
  const winRate = estimateWinRate(enemy)

  const wins = Math.floor(maxBattles * winRate)
  let totalGold = 0
  const items: Record<string, number> = {}

  // 批量结算胜利
  for (let i = 0; i < wins; i++) {
    const gold = enemy.goldMin + Math.floor(Math.random() * (enemy.goldMax - enemy.goldMin + 1))
    totalGold += gold

    for (const drop of enemy.drops) {
      if (Math.random() < drop.chance) {
        items[drop.id] = (items[drop.id] || 0) + drop.qty
      }
    }
  }

  addGold(totalGold)
  for (const [itemId, qty] of Object.entries(items)) {
    addItem(itemId, qty)
  }

  const totalXp = wins * enemy.xp
  addXp('combat', totalXp)
  gameState.stats.kills += wins
  gameState.stats.totalGold += totalGold

  return {
    enemyName: enemy.name,
    battles: maxBattles,
    wins,
    totalGold,
    totalXp,
    items,
  }
}

/** 估算每场战斗平均回合数 */
function estimateTurnsPerFight(enemy: MonsterConfig): number {
  const playerDmg = Math.max(1, getPlayerAtk() - enemy.def + 1)
  const turnsToKill = Math.ceil(enemy.hp / playerDmg)
  return Math.max(1, turnsToKill)
}

/** 估算胜率（简化：基于攻防比） */
function estimateWinRate(enemy: MonsterConfig): number {
  const playerAtk = getPlayerAtk()
  const playerDef = getPlayerDef()
  const enemyDmg = Math.max(0, enemy.atk - playerDef + 1)
  const playerDmg = Math.max(1, playerAtk - enemy.def + 1)

  const playerTurnsToKill = Math.ceil(enemy.hp / playerDmg)
  const enemyTurnsToKill = Math.ceil(gameState.maxHp / Math.max(1, enemyDmg))

  if (playerTurnsToKill <= enemyTurnsToKill * 0.5) return 0.95
  if (playerTurnsToKill <= enemyTurnsToKill * 0.8) return 0.80
  if (playerTurnsToKill <= enemyTurnsToKill) return 0.60
  if (playerTurnsToKill <= enemyTurnsToKill * 1.5) return 0.30
  return 0.05
}

/** 格式化时长 */
function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) return `${hours} 小时 ${minutes} 分钟`
  return `${minutes} 分钟`
}
