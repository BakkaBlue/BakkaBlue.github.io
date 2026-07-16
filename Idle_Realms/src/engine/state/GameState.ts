// ==================== 游戏状态（单例，Vue reactive + 引擎 pub/sub）====================
import { reactive } from 'vue'
import type { GameStateData } from './types'
import { SAVE_VERSION, HP_BASE } from '@/data/formulas'

/** 创建初始游戏状态 */
export function createInitialState(): GameStateData {
  return {
    gold: 50,
    hp: HP_BASE,
    maxHp: HP_BASE,
    skills: {
      woodcutting: { level: 1, xp: 0 },
      mining:     { level: 1, xp: 0 },
      fishing:    { level: 1, xp: 0 },
      cooking:    { level: 1, xp: 0 },
      combat:     { level: 1, xp: 0 },
      smithing:   { level: 1, xp: 0 },
      crafting:   { level: 1, xp: 0 },
      slayer:     { level: 1, xp: 0 },
      farming:    { level: 1, xp: 0 },
      town:       { level: 1, xp: 0 },
      firemaking:  { level: 1, xp: 0 },
      beekeeping:  { level: 1, xp: 0 },
      salvaging:   { level: 1, xp: 0 },
      archaeology: { level: 1, xp: 0 },
      prospecting: { level: 1, xp: 0 },
      alchemy:     { level: 1, xp: 0 },
      astrology:   { level: 1, xp: 0 },
      astronomy:   { level: 1, xp: 0 },
      engineering: { level: 1, xp: 0 },
    },
    currentAction: null,
    inventory: {},
    equipment: {
      weapon: null, helmet: null, body: null,
      legs: null, boots: null, ring: null, amulet: null,
    },
    combat: {
      enemyId: null,
      enemyHp: 0,
      enemyMaxHp: 0,
      inBattle: false,
      autoBattle: false,
      autoFood: true,
      selectedFood: 'cooked_shrimp',
      turnTimer: 0,
    },
    slayer: {
      activeTask: null,
      points: 0,
      tasksCompleted: 0,
      purchasedRewards: [],
    },
    farming: {
      plots: {
        veg: [{ id: 'veg_0', level: 1, cropId: null, progress: 0 }],
        herb: [],
        tree: [],
      },
      plotCounters: { veg: 1, herb: 0, tree: 0 },
      activeSelectPlot: null,
    },
    town: {
      buildings: { farm: 0, blacksmith: 0, kitchen: 0, warehouse: 0 },
      facilities: { lumber_mill: 0, mine: 0 },
      storage: { town_logs: 0, town_ore: 0 },
    },
    buffs: [],
    selectedEnemy: 'chicken',
    stats: { totalGold: 0, kills: 0, gathers: 0, cooks: 0 },
    lastSaveTime: Date.now(),
    lastTickTime: Date.now(),
    version: SAVE_VERSION,
  }
}

// ---- Vue reactive（系统和 UI 可直接 mutate）----

/** 全局游戏状态实例（Vue reactive） */
export const gameState = reactive<GameStateData>(createInitialState())

// ---- 引擎 pub/sub 层（框架无关的状态访问）----

const _listeners = new Set<() => void>()

/** 获取只读游戏状态 */
export function getGameState(): Readonly<GameStateData> {
  return gameState
}

/** 订阅状态变更 */
export function subscribeToState(fn: () => void): () => void {
  _listeners.add(fn)
  return () => { _listeners.delete(fn) }
}

/** 修改状态（Engine 内部使用，自动通知订阅者） */
export function mutateState(updater: (s: GameStateData) => void): void {
  updater(gameState)
  _listeners.forEach(fn => fn())
}

/** 重置为初始状态 */
export function resetState(): void {
  Object.assign(gameState, createInitialState())
  _listeners.forEach(fn => fn())
}

/** 替换整个状态（加载存档时使用） */
export function replaceState(newState: GameStateData): void {
  Object.assign(gameState, newState)
  _listeners.forEach(fn => fn())
}
