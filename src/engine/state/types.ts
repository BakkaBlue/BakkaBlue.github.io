// ==================== 核心类型定义 ====================

import type { SkillId } from '@/data/skills'
import type { EquipmentSlot } from '@/data/items'
import type { ActiveSlayerTask } from '@/data/slayer'

// ----- 视图类型 -----
export enum ViewType {
  SkillGrid = 'skill_grid',
  SkillDetail = 'skill_detail',
  Farming = 'farming',
  Town = 'town',
  TownShop = 'town_shop',
  Equipment = 'equipment',
  Shop = 'shop',
  Inventory = 'inventory',
  Settings = 'settings',
  Combat = 'combat',
  Slayer = 'slayer',
}

// ----- 技能状态 -----
export interface SkillState {
  level: number
  xp: number
}

// ----- 当前动作 -----
export interface CurrentAction {
  skill: SkillId
  actionId: string
  progress: number       // 已完成时间（毫秒）
  totalTime: number      // 总时间（毫秒）
}

// ----- 战斗状态 -----
export interface CombatState {
  enemyId: string | null
  enemyHp: number
  enemyMaxHp: number
  inBattle: boolean
  autoBattle: boolean
  autoFood: boolean
  selectedFood: string   // itemId
  turnTimer: number
}

// ----- 屠杀者状态 -----
export interface SlayerState {
  activeTask: ActiveSlayerTask | null
  points: number          // 屠杀者点数
  tasksCompleted: number  // 已完成任务总数
  purchasedRewards: string[]  // 已购买的奖励 ID 列表
}

// ----- 农务地块 -----
export interface FarmPlot {
  id: string              // 'veg_0', 'herb_1' 等
  level: number            // 地块等级（影响生长速度）
  cropId: string | null
  progress: number         // 生长进度（毫秒）
}

export interface FarmingStateData {
  plots: Record<string, FarmPlot[]>  // 'veg': [...], 'herb': [...], 'tree': [...]
  plotCounters: Record<string, number>
  activeSelectPlot: string | null    // 当前正在选择作物的地块 ID
}

// ----- Buff 状态 -----
export interface ActiveBuff {
  id: string
  name: string
  icon: string
  key: string        // 影响的属性（exp_mult, gold_mult 等）
  value: number      // 倍率值
  expires: number    // 过期时间戳
}

// ----- 城镇状态 -----
export interface TownStateData {
  buildings: Record<string, number>   // buildingId → level
  facilities: Record<string, number>  // facilityId → level
  storage: Record<string, number>     // resourceId → amount
}

// ----- 玩家统计 -----
export interface PlayerStats {
  totalGold: number
  kills: number
  gathers: number
  cooks: number
}

// ----- 游戏状态（顶层） -----
export interface GameStateData {
  gold: number
  hp: number
  maxHp: number
  skills: Record<SkillId, SkillState>
  currentAction: CurrentAction | null
  inventory: Record<string, number>       // itemId → qty
  equipment: Record<EquipmentSlot, string | null>
  combat: CombatState
  slayer: SlayerState
  farming: FarmingStateData
  town: TownStateData
  buffs: ActiveBuff[]
  selectedEnemy: string
  stats: PlayerStats
  lastSaveTime: number
  lastTickTime: number
  version: number
}

// ----- 存档数据 -----
export interface SaveData {
  version: number              // 存档格式版本号
  timestamp: number            // 保存时间戳
  state: GameStateData
}

// ----- 离线结算报告 -----
export interface OfflineReport {
  elapsedMs: number
  elapsedFormatted: string
  skillResults: OfflineSkillResult[]
  combatResult: OfflineCombatResult | null
  levelUps: { skillId: SkillId; newLevel: number }[]
}

export interface OfflineSkillResult {
  skillId: SkillId
  actionName: string
  cycles: number
  items: Record<string, number>
  totalXp: number
}

export interface OfflineCombatResult {
  enemyName: string
  battles: number
  wins: number
  totalGold: number
  totalXp: number
  items: Record<string, number>
}
