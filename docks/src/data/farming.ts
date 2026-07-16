// ==================== 农务系统配置 ====================

// ----- 地块类型 -----
export type PlotCategory = 'veg' | 'herb' | 'tree'

export interface PlotTypeConfig {
  id: PlotCategory
  name: string
  icon: string
  color: string                // CSS 色值
  baseBuyCost: number          // 基础购买消耗
  buyCostMultiplier: number    // 购买消耗倍增
  maxPlots: number             // 最大地块数
  upgradeBaseCost: number      // 升级基础消耗
  upgradeCostMultiplier: number // 升级消耗倍增
  speedPerLevel: number        // 每级生长速度加成（倍率）
}

export const PLOT_TYPES: Record<PlotCategory, PlotTypeConfig> = {
  veg: {
    id: 'veg',
    name: '农作物地块',
    icon: 'fa-carrot',
    color: '#8bc34a',          // --farm-veg
    baseBuyCost: 300,
    buyCostMultiplier: 2.0,
    maxPlots: 4,
    upgradeBaseCost: 200,
    upgradeCostMultiplier: 1.8,
    speedPerLevel: 0.15,
  },
  herb: {
    id: 'herb',
    name: '草药地块',
    icon: 'fa-leaf',
    color: '#b968e0',          // --farm-herb
    baseBuyCost: 1500,
    buyCostMultiplier: 2.2,
    maxPlots: 3,
    upgradeBaseCost: 800,
    upgradeCostMultiplier: 2.0,
    speedPerLevel: 0.15,
  },
  tree: {
    id: 'tree',
    name: '树木地块',
    icon: 'fa-tree',
    color: '#a1887f',          // --farm-tree
    baseBuyCost: 3000,
    buyCostMultiplier: 2.5,
    maxPlots: 3,
    upgradeBaseCost: 1500,
    upgradeCostMultiplier: 2.2,
    speedPerLevel: 0.15,
  },
}

// ----- 作物配置 -----
export interface CropConfig {
  id: string
  name: string
  icon: string
  category: PlotCategory      // 所属地块类别
  levelReq: number             // 所需农务等级
  xp: number                   // 收获经验
  growTime: number             // 生长时间（毫秒）
  drops: Record<string, number> // 产出
}

export const FARM_CROPS: Record<string, CropConfig> = {
  // == 农作物 ==
  carrot:     { id: 'carrot',     name: '胡萝卜',   icon: 'fa-carrot',       category: 'veg',  levelReq: 1,  xp: 10,  growTime: 15_000,  drops: { carrot: 3 } },
  tomato:     { id: 'tomato',     name: '番茄',     icon: 'fa-apple-whole', category: 'veg',  levelReq: 8,  xp: 25,  growTime: 30_000,  drops: { tomato: 5 } },
  strawberry: { id: 'strawberry', name: '草莓',     icon: 'fa-strawberry',  category: 'veg',  levelReq: 20, xp: 60,  growTime: 60_000,  drops: { strawberry: 5 } },
  potato:     { id: 'potato',     name: '土豆',     icon: 'fa-potato',      category: 'veg',  levelReq: 35, xp: 120, growTime: 120_000, drops: { potato: 10 } },
  // == 草药 ==
  herb:       { id: 'herb',       name: '普通草药', icon: 'fa-leaf',        category: 'herb', levelReq: 15, xp: 100, growTime: 45_000,  drops: { herb: 2 } },
  magic_herb: { id: 'magic_herb', name: '魔法草药', icon: 'fa-clover',      category: 'herb', levelReq: 50, xp: 300, growTime: 90_000,  drops: { magic_herb: 2 } },
  // == 树木 ==
  oak_tree:   { id: 'oak_tree',   name: '橡树苗',   icon: 'fa-tree',        category: 'tree', levelReq: 30, xp: 150, growTime: 60_000,  drops: { oak_logs: 5 } },
  maple_tree: { id: 'maple_tree', name: '枫树苗',   icon: 'fa-tree',        category: 'tree', levelReq: 60, xp: 400, growTime: 120_000, drops: { maple_logs: 5 } },
}

/** 获取某类别下的所有作物 */
export function getCropsByCategory(cat: PlotCategory): CropConfig[] {
  return Object.values(FARM_CROPS).filter(c => c.category === cat)
}
