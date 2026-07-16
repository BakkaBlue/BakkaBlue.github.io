// ==================== 城镇产出设施 ====================
// 消耗金币建造，被动产出城镇专属资源（独立于个人背包）

export interface FacilityConfig {
  id: string
  name: string
  icon: string
  description: string
  baseCost: number         // 基础建造消耗（金币）
  costMultiplier: number   // 每级消耗倍增
  baseRate: number         // 基础产出速率（每秒）
  resourceId: string       // 产出物 ID
  resourceName: string     // 产出物显示名
  resourceIcon: string     // 产出物图标
}

export const FACILITIES: Record<string, FacilityConfig> = {
  lumber_mill: {
    id: 'lumber_mill',
    name: '伐木场',
    icon: 'fa-tree',
    description: '自动产出城镇木材，用于购买军需物资。',
    baseCost: 500,
    costMultiplier: 1.8,
    baseRate: 0.2,            // 每秒 0.2 木材/级
    resourceId: 'town_logs',
    resourceName: '木材',
    resourceIcon: 'fa-tree',
  },
  mine: {
    id: 'mine',
    name: '矿场',
    icon: 'fa-gem',
    description: '自动产出城镇矿石，用于购买军需物资。',
    baseCost: 800,
    costMultiplier: 1.9,
    baseRate: 0.1,            // 每秒 0.1 矿石/级
    resourceId: 'town_ore',
    resourceName: '矿石',
    resourceIcon: 'fa-gem',
  },
}
