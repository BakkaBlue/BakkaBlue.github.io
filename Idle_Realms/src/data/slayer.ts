// ==================== 屠杀者任务配置 ====================

export interface SlayerMaster {
  id: string
  name: string
  icon: string
  combatReq: number      // 所需战斗等级
  description: string
  taskPool: SlayerTaskTemplate[]   // 可分配的任务池
}

export interface SlayerTaskTemplate {
  enemyId: string               // 目标怪物 ID
  minCount: number              // 最小击杀数
  maxCount: number              // 最大击杀数
  weight: number                // 被选中的权重（越高越容易被抽到）
  xpReward: number              // 完成任务奖励的屠杀者经验
  pointReward: number           // 完成任务奖励的屠杀者点数
  specialDrops?: {              // 专属掉落（仅在任务期间掉落）
    itemId: string
    chance: number              // 0-1 概率
    qty: number
    name: string                // 显示名称
  }[]
}

/** 当前进行中的屠杀者任务 */
export interface ActiveSlayerTask {
  masterId: string
  enemyId: string
  requiredKills: number
  currentKills: number
  xpReward: number
  pointReward: number
  specialDrops: SlayerTaskTemplate['specialDrops']
  enemyName: string             // 缓存怪物名称（方便 UI 展示）
}

// ==================== 导师 & 任务配置 ====================

export const SLAYER_MASTERS: SlayerMaster[] = [
  {
    id: 'novice',
    name: '新手导师·格雷戈',
    icon: 'fa-shield',
    combatReq: 1,
    description: '专为初出茅庐的冒险者提供低风险任务。',
    taskPool: [
      { enemyId: 'chicken',  minCount: 10, maxCount: 30, weight: 5, xpReward: 30,  pointReward: 3,
        specialDrops: [{ itemId: 'chicken_feather', chance: 0.3, qty: 2, name: '额外鸡毛' }] },
      { enemyId: 'cow',      minCount: 8,  maxCount: 25, weight: 4, xpReward: 50,  pointReward: 5,
        specialDrops: [{ itemId: 'cow_hide', chance: 0.3, qty: 1, name: '额外牛皮' }] },
      { enemyId: 'goblin',   minCount: 5,  maxCount: 15, weight: 3, xpReward: 100, pointReward: 8,
        specialDrops: [{ itemId: 'goblin_ear', chance: 0.4, qty: 1, name: '哥布林断耳' }] },
    ],
  },
  {
    id: 'veteran',
    name: '老兵导师·瓦里克',
    icon: 'fa-skull',
    combatReq: 15,
    description: '为经验丰富的战士提供挑战性任务。',
    taskPool: [
      { enemyId: 'goblin',   minCount: 20, maxCount: 40, weight: 3, xpReward: 200, pointReward: 12 },
      { enemyId: 'bandit',   minCount: 10, maxCount: 30, weight: 4, xpReward: 300, pointReward: 20,
        specialDrops: [{ itemId: 'bone', chance: 0.2, qty: 2, name: '强盗遗骨' }] },
      { enemyId: 'skeleton', minCount: 8,  maxCount: 20, weight: 3, xpReward: 500, pointReward: 30,
        specialDrops: [{ itemId: 'bone', chance: 0.5, qty: 3, name: '骷髅碎骨' }] },
      { enemyId: 'troll',    minCount: 3,  maxCount: 8,  weight: 2, xpReward: 800, pointReward: 50,
        specialDrops: [{ itemId: 'gem_red', chance: 0.05, qty: 1, name: '巨魔宝石' }] },
    ],
  },
  {
    id: 'elite',
    name: '精英导师·暗影议会',
    icon: 'fa-dragon',
    combatReq: 40,
    description: '只有最强大的冒险者才能接受暗影议会的试炼。',
    taskPool: [
      { enemyId: 'skeleton', minCount: 15, maxCount: 35, weight: 2, xpReward: 800,  pointReward: 40 },
      { enemyId: 'troll',    minCount: 5,  maxCount: 12, weight: 3, xpReward: 1200, pointReward: 70,
        specialDrops: [{ itemId: 'gem_red', chance: 0.1, qty: 1, name: '巨魔核心' }] },
    ],
  },
]

// ==================== 屠杀者奖励商店 ====================

export interface SlayerReward {
  id: string
  name: string
  icon: string
  description: string
  cost: number            // 所需屠杀者点数
  levelReq: number        // 所需屠杀者等级
  type: 'unlock' | 'consumable' | 'permanent'
  effect?: {
    stat: string
    value: number
  }
}

export const SLAYER_REWARDS: SlayerReward[] = [
  {
    id: 'slayer_ring',
    name: '屠杀者戒指',
    icon: 'fa-ring',
    description: '装备后对任务目标伤害 +10%',
    cost: 30,
    levelReq: 1,
    type: 'unlock',
  },
  {
    id: 'bigger_tasks',
    name: '更大的任务',
    icon: 'fa-scroll',
    description: '任务要求的击杀数增加 30%（奖励同比增加）',
    cost: 50,
    levelReq: 5,
    type: 'permanent',
  },
  {
    id: 'auto_reroll',
    name: '自动重抽',
    icon: 'fa-dice',
    description: '完成一个任务后自动接取新任务',
    cost: 80,
    levelReq: 10,
    type: 'permanent',
  },
  {
    id: 'slayer_pouch',
    name: '屠杀者腰包',
    icon: 'fa-sack',
    description: '完成任务额外获得 20% 金币奖励',
    cost: 100,
    levelReq: 15,
    type: 'permanent',
  },
  {
    id: 'double_drops',
    name: '双倍掉率',
    icon: 'fa-gem',
    description: '任务专属掉落概率翻倍',
    cost: 200,
    levelReq: 25,
    type: 'permanent',
  },
]
