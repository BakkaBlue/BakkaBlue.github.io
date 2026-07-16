// ==================== 战斗系统 ====================
// 负责战斗回合、伤害计算、掉落结算

import { gameState } from '../state/GameState'
import { eventBus } from '@/engine/events/EventBus'
import { ENEMIES, type MonsterConfig } from '@/data/monsters'
import { ITEMS } from '@/data/items'
import { addXp } from './ExperienceSystem'
import { addItem } from './InventorySystem'
import { addGold } from './EconomySystem'
import { getPlayerAtk, getPlayerDef } from './EquipmentSystem'
import { eatFood } from './FoodSystem'
import { hasItem } from './InventorySystem'
import { onSlayerKill } from './SlayerSystem'
import { COMBAT_TURN_MS } from '@/data/formulas'
import i18n from '@/shared/i18n'
const { t } = i18n.global

/** 根据 ID 查找怪物 */
export function getEnemyById(id: string): MonsterConfig | undefined {
  return ENEMIES.find(e => e.id === id)
}

/** 开始战斗 */
export function startBattle(enemyId: string): boolean {
  const enemy = getEnemyById(enemyId)
  if (!enemy) return false

  if (gameState.hp < 1) {
    eventBus.emit('toast', { message: t('toasts.hpLow'), type: 'danger' })
    return false
  }

  gameState.combat.inBattle = true
  gameState.combat.enemyId = enemyId
  gameState.combat.enemyHp = enemy.hp
  gameState.combat.enemyMaxHp = enemy.hp
  gameState.combat.turnTimer = 0

  gameState.currentAction = {
    skill: 'combat',
    actionId: enemyId,
    progress: 0,
    totalTime: COMBAT_TURN_MS,
  }

  eventBus.emit('combat:started', { enemyId, enemyName: enemy.name })
  return true
}

/** 每 tick 更新战斗（由 GameEngine 调用） */
export function tickCombat(dt: number): void {
  if (!gameState.combat.inBattle) return

  const enemy = getEnemyById(gameState.combat.enemyId!)
  if (!enemy) {
    gameState.combat.inBattle = false
    return
  }

  gameState.combat.turnTimer += dt
  gameState.currentAction!.progress = gameState.combat.turnTimer

  if (gameState.combat.turnTimer < COMBAT_TURN_MS) return

  // 回合触发
  gameState.combat.turnTimer = 0
  gameState.currentAction!.progress = 0

  executePlayerAttack(enemy)
}

/** 玩家攻击 */
function executePlayerAttack(enemy: MonsterConfig): void {
  const rawDmg = getPlayerAtk() - enemy.def + Math.floor(Math.random() * 4) - 1
  const dmg = Math.max(1, rawDmg)
  gameState.combat.enemyHp -= dmg

  eventBus.emit('combat:hit', { target: 'enemy', damage: dmg })

  if (gameState.combat.enemyHp <= 0) {
    gameState.combat.enemyHp = 0
    onEnemyDefeated(enemy)
    return
  }

  // 自动进食
  tryAutoEat()

  // 敌人反击（延迟，但逻辑上立即结算）
  executeEnemyAttack(enemy)
}

/** 敌人攻击 */
function executeEnemyAttack(enemy: MonsterConfig): void {
  const rawDmg = enemy.atk - getPlayerDef() + Math.floor(Math.random() * 3) - 1
  const dmg = Math.max(0, rawDmg)
  gameState.hp -= dmg

  eventBus.emit('combat:hit', { target: 'player', damage: dmg })

  if (gameState.hp <= 0) {
    gameState.hp = 0
    onPlayerDefeated(enemy)
  }
}

/** 自动进食 */
function tryAutoEat(): void {
  if (!gameState.combat.autoFood) return
  if (gameState.hp >= gameState.maxHp * 0.5) return

  const foodId = gameState.combat.selectedFood
  if (hasItem(foodId, 1) && ITEMS[foodId]?.heal) {
    eatFood(foodId)
  }
}

/** 胜利结算 */
function onEnemyDefeated(enemy: MonsterConfig): void {
  gameState.combat.inBattle = false
  gameState.currentAction = null

  const goldEarned = enemy.goldMin + Math.floor(Math.random() * (enemy.goldMax - enemy.goldMin + 1))
  addGold(goldEarned)
  gameState.stats.kills++
  addXp('combat', enemy.xp)

  eventBus.emit('combat:victory', { enemyId: enemy.id, enemyName: enemy.name, gold: goldEarned, xp: enemy.xp })

  // 屠杀者任务击杀计数
  onSlayerKill(enemy.id)

  // 掉落
  for (const drop of enemy.drops) {
    if (Math.random() < drop.chance) {
      addItem(drop.id, drop.qty)
      eventBus.emit('item:acquired', { itemId: drop.id, qty: drop.qty, source: 'combat' })
    }
  }

  // 自动继续战斗
  if (gameState.combat.autoBattle && gameState.hp > 0) {
    setTimeout(() => {
      if (gameState.combat.autoBattle && !gameState.combat.inBattle) {
        startBattle(gameState.selectedEnemy)
      }
    }, 800)
  }
}

/** 失败处理 */
function onPlayerDefeated(enemy: MonsterConfig): void {
  gameState.combat.inBattle = false
  gameState.combat.autoBattle = false
  gameState.currentAction = null

  eventBus.emit('combat:defeat', { enemyId: enemy.id, enemyName: enemy.name })

  // 恢复到 30% HP
  gameState.hp = Math.max(1, Math.floor(gameState.maxHp * 0.3))
}

/** 逃跑 */
export function fleeBattle(): boolean {
  if (!gameState.combat.inBattle) return false

  const enemy = gameState.combat.enemyId
    ? ENEMIES.find(e => e.id === gameState.combat.enemyId)
    : null

  gameState.combat.inBattle = false
  gameState.combat.autoBattle = false
  gameState.currentAction = null

  eventBus.emit('combat:fled', { enemyName: enemy?.name ?? '未知' })
  return true
}
