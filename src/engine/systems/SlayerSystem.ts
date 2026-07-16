// ==================== 屠杀者系统 ====================
// 负责任务接取、击杀计数、完成结算、奖励购买

import { gameState } from '../state/GameState'
import { eventBus } from '@/engine/events/EventBus'
import { addXp } from './ExperienceSystem'
import { addItem } from './InventorySystem'
import { addGold } from './EconomySystem'
import { ENEMIES } from '@/data/monsters'
import i18n from '@/shared/i18n'
const { t } = i18n.global
import {
  SLAYER_MASTERS,
  SLAYER_REWARDS,
  type SlayerMaster,
  type SlayerReward,
} from '@/data/slayer'

// ==================== 导师 ====================

/** 获取当前可用的导师（按战斗等级解锁） */
export function getAvailableMasters(): SlayerMaster[] {
  return SLAYER_MASTERS.filter(m => gameState.skills.combat.level >= m.combatReq)
}

/** 获取已解锁但未达到等级的导师 */
export function getLockedMasters(): SlayerMaster[] {
  return SLAYER_MASTERS.filter(m => gameState.skills.combat.level < m.combatReq)
}

// ==================== 任务管理 ====================

/** 从导师处随机接取一个新任务 */
export function acceptTask(masterId: string): boolean {
  if (gameState.slayer.activeTask) {
    eventBus.emit('toast', { message: t('toasts.alreadyHasTask'), type: 'danger' })
    return false
  }

  const master = SLAYER_MASTERS.find(m => m.id === masterId)
  if (!master) return false
  if (gameState.skills.combat.level < master.combatReq) return false

  // 加权随机选择任务模板
  const template = weightedPick(master.taskPool)
  if (!template) return false

  // 随机生成击杀数量
  const killCount = template.minCount + Math.floor(Math.random() * (template.maxCount - template.minCount + 1))
  const enemy = ENEMIES.find(e => e.id === template.enemyId)

  gameState.slayer.activeTask = {
    masterId: master.id,
    enemyId: template.enemyId,
    requiredKills: killCount,
    currentKills: 0,
    xpReward: template.xpReward,
    pointReward: template.pointReward,
    specialDrops: template.specialDrops ? [...template.specialDrops] : [],
    enemyName: enemy?.name ?? template.enemyId,
  }

  eventBus.emit('slayer:task-accepted', {
    enemyName: enemy?.name,
    requiredKills: killCount,
    masterName: master.name,
  })

  return true
}

/** 跳过当前任务（消耗金币重抽） */
export function skipTask(): boolean {
  if (!gameState.slayer.activeTask) return false

  const cost = getSkipCost()
  if (gameState.gold < cost) {
    eventBus.emit('toast', { message: t('toasts.taskSkipCost', { cost }), type: 'danger' })
    return false
  }

  gameState.gold -= cost
  const masterId = gameState.slayer.activeTask.masterId
  gameState.slayer.activeTask = null

  eventBus.emit('toast', { message: `消耗 ${cost} 金币跳过了当前任务`, type: '' })
  return acceptTask(masterId)
}

/** 计算跳过任务的金币消耗（随屠杀者等级增长） */
export function getSkipCost(): number {
  const level = gameState.skills.slayer.level
  return 50 + level * 20
}

/** 放弃当前任务（不消耗金币，但没有奖励） */
export function abandonTask(): boolean {
  if (!gameState.slayer.activeTask) return false
  gameState.slayer.activeTask = null
  eventBus.emit('slayer:task-abandoned')
  return true
}

// ==================== 击杀计数 ====================

/** 记录一次击杀（由 CombatSystem 在胜利时调用） */
export function onSlayerKill(enemyId: string): void {
  const task = gameState.slayer.activeTask
  if (!task) return
  if (task.enemyId !== enemyId) return

  task.currentKills++

  // 检查特殊掉落
  if (task.specialDrops) {
    for (const drop of task.specialDrops) {
      // 双倍掉率检查（如果已购买该奖励）
      const chance = gameState.slayer.purchasedRewards.includes('double_drops')
        ? drop.chance * 2
        : drop.chance
      if (Math.random() < chance) {
        addItem(drop.itemId, drop.qty)
        eventBus.emit('item:acquired', { itemId: drop.itemId, qty: drop.qty, source: 'slayer' })
      }
    }
  }

  // 检查任务完成
  if (task.currentKills >= task.requiredKills) {
    completeTask()
  }
}

/** 完成任务结算 */
function completeTask(): void {
  const task = gameState.slayer.activeTask!
  const goldBonus = Math.floor(task.xpReward * 2) // 金币奖励 = XP × 2

  // 屠杀者腰包加成
  const hasPouch = gameState.slayer.purchasedRewards.includes('slayer_pouch')
  const finalGold = hasPouch ? Math.floor(goldBonus * 1.2) : goldBonus

  addGold(finalGold)
  addXp('slayer', task.xpReward)
  gameState.slayer.points += task.pointReward
  gameState.slayer.tasksCompleted++

  eventBus.emit('slayer:task-completed', {
    enemyName: task.enemyName,
    kills: task.requiredKills,
    xp: task.xpReward,
    points: task.pointReward,
    gold: finalGold,
  })

  gameState.slayer.activeTask = null

  // 自动重抽（如果已购买）
  if (gameState.slayer.purchasedRewards.includes('auto_reroll')) {
    const availableMasters = getAvailableMasters()
    if (availableMasters.length > 0) {
      const lastMaster = availableMasters[availableMasters.length - 1]
      acceptTask(lastMaster.id)
    }
  }
}

// ==================== 奖励商店 ====================

/** 获取可购买的奖励列表 */
export function getAvailableRewards(): SlayerReward[] {
  return SLAYER_REWARDS.filter(r =>
    gameState.skills.slayer.level >= r.levelReq &&
    !gameState.slayer.purchasedRewards.includes(r.id)
  )
}

/** 获取已购买的奖励 */
export function getPurchasedRewards(): SlayerReward[] {
  return SLAYER_REWARDS.filter(r => gameState.slayer.purchasedRewards.includes(r.id))
}

/** 购买奖励 */
export function purchaseReward(rewardId: string): boolean {
  const reward = SLAYER_REWARDS.find(r => r.id === rewardId)
  if (!reward) return false
  if (gameState.slayer.purchasedRewards.includes(rewardId)) return false
  if (gameState.slayer.points < reward.cost) return false
  if (gameState.skills.slayer.level < reward.levelReq) return false

  gameState.slayer.points -= reward.cost
  gameState.slayer.purchasedRewards.push(rewardId)

  eventBus.emit('slayer:reward-purchased', { rewardName: reward.name })

  // 如果是可解锁物品，直接发放
  if (reward.type === 'unlock') {
    addItem(reward.id, 1)
  }

  return true
}

// ==================== 工具函数 ====================

/** 加权随机选择 */
function weightedPick<T extends { weight: number }>(items: T[]): T | null {
  if (items.length === 0) return null
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  let r = Math.random() * totalWeight
  for (const item of items) {
    r -= item.weight
    if (r <= 0) return item
  }
  return items[items.length - 1]
}
