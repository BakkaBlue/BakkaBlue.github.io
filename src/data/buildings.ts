// ==================== 城镇建筑配置 ====================

export interface BuildingConfig {
  id: string
  name: string
  icon: string
  description: string
  cost: Record<string, number>    // 基础消耗 { itemId/gold: qty }
  costMultiplier: number          // 每级消耗倍增系数
  effectDescription: (level: number) => string
  getEffect: (level: number) => number   // 返回倍率（<1 = 时间缩短，>0 = 概率等）
}

export const BUILDINGS: Record<string, BuildingConfig> = {
  farm: {
    id: 'farm',
    name: '农场',
    icon: 'fa-warehouse',
    description: '提升农业生长速度，每级缩短 10% 生长时间。',
    cost: { logs: 50, gold: 200 },
    costMultiplier: 1.5,
    effectDescription: (lvl) => `生长时间 -${lvl * 10}%`,
    getEffect: (lvl) => 1 - lvl * 0.10,       // 时间倍率（越低越快）
  },
  blacksmith: {
    id: 'blacksmith',
    name: '铁匠铺',
    icon: 'fa-hammer',
    description: '提升采矿和锻造速度，每级 +5%。',
    cost: { copper_ore: 30, gold: 150 },
    costMultiplier: 1.6,
    effectDescription: (lvl) => `采矿/锻造时间 -${lvl * 5}%`,
    getEffect: (lvl) => 1 - lvl * 0.05,
  },
  kitchen: {
    id: 'kitchen',
    name: '厨房',
    icon: 'fa-fire-burner',
    description: '提升烹饪速度，每级 +8%。',
    cost: { logs: 30, gold: 100 },
    costMultiplier: 1.4,
    effectDescription: (lvl) => `烹饪时间 -${lvl * 8}%`,
    getEffect: (lvl) => 1 - lvl * 0.08,
  },
  warehouse: {
    id: 'warehouse',
    name: '仓库',
    icon: 'fa-boxes-stacked',
    description: '提升采集产出暴击率（双倍产出），每级 +2%。',
    cost: { oak_logs: 10, copper_ore: 20, gold: 300 },
    costMultiplier: 1.8,
    effectDescription: (lvl) => `采集双倍产出几率 +${(lvl * 2).toFixed(0)}%`,
    getEffect: (lvl) => lvl * 0.02,
  },
}
