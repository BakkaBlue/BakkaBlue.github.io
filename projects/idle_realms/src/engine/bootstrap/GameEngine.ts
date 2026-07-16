// ==================== 游戏主引擎 ====================
// 负责主循环、协调各子系统

import { gameState } from '../state/GameState'
import { eventBus } from '@/engine/events/EventBus'
import { tickActionProgress } from '../systems/SkillSystem'
import { tickCombat } from '../systems/CombatSystem'
import { tickFacilities, cleanExpiredBuffs } from '../systems/TownSystem'
import { tickFarming } from '../systems/FarmingSystem'
import { autoSave } from '../services/SaveSystem'
import { calculateOfflineProgress } from './OfflineEngine'
import {
  TICK_INTERVAL_MS,
  AUTO_SAVE_INTERVAL_MS,
  REGEN_CHANCE_PER_TICK,
  REGEN_AMOUNT,
} from '@/data/formulas'

let gameLoopId: ReturnType<typeof setInterval> | null = null
let saveIntervalId: ReturnType<typeof setInterval> | null = null
let lastTickTime = Date.now()

/** 启动游戏（初始化后调用） */
export function startEngine(): void {
  // 先结算离线收益
  const report = calculateOfflineProgress()
  if (report) {
    eventBus.emit('offline:show', report)
  }

  // 启动主循环（100ms tick）
  lastTickTime = Date.now()
  gameLoopId = setInterval(tick, TICK_INTERVAL_MS)

  // 启动自动保存（60s）
  saveIntervalId = setInterval(() => {
    autoSave()
    eventBus.emit('save:completed')
  }, AUTO_SAVE_INTERVAL_MS)

  eventBus.emit('engine:started')
}

/** 停止引擎 */
export function stopEngine(): void {
  if (gameLoopId !== null) {
    clearInterval(gameLoopId)
    gameLoopId = null
  }
  if (saveIntervalId !== null) {
    clearInterval(saveIntervalId)
    saveIntervalId = null
  }
  autoSave()
  eventBus.emit('engine:stopped')
}

/** 是否正在运行 */
export function isRunning(): boolean {
  return gameLoopId !== null
}

// ----- 主 tick -----

function tick(): void {
  const now = Date.now()
  const dt = now - lastTickTime
  lastTickTime = now

  // 非正常的时间跳跃（如系统休眠），限制 dt 以防止进度跳跃
  const clampedDt = Math.min(dt, 30_000) // 最多 30 秒一跳

  if (gameState.currentAction) {
    if (gameState.currentAction.skill === 'combat') {
      tickCombat(clampedDt)
    } else {
      tickActionProgress(clampedDt)
    }
  } else {
    // 非战斗时缓慢回血
    tryRegen()
  }

  // 城镇设施被动产出
  tickFacilities(clampedDt)

  // 农务地块生长
  tickFarming(clampedDt)

  // 清理过期 Buff
  cleanExpiredBuffs()

  gameState.lastTickTime = now
}

/** 尝试回血 */
function tryRegen(): void {
  if (gameState.hp < gameState.maxHp && Math.random() < REGEN_CHANCE_PER_TICK) {
    gameState.hp = Math.min(gameState.maxHp, gameState.hp + REGEN_AMOUNT)
  }
}
