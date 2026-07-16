// ==================== 军需商店 ====================
// 消耗城镇专属资源，购买 Buff 卷轴或专属装备

export interface TownShopItem {
  id: string
  name: string
  icon: string
  description: string
  cost: Record<string, number>   // { town_logs: 30, town_ore: 20 }
  type: 'buff' | 'item'
  // Buff 配置
  buffKey?: string
  buffValue?: number
  buffDuration?: number          // 毫秒
  // 物品配置
  itemId?: string
}

export const TOWN_SHOP_ITEMS: TownShopItem[] = [
  {
    id: 'scroll_exp',
    name: '智者卷轴',
    icon: 'fa-scroll',
    description: '全技能经验获取 +50%，持续 5 分钟。',
    cost: { town_logs: 30 },
    type: 'buff',
    buffKey: 'exp_mult',
    buffValue: 1.5,
    buffDuration: 300_000,
  },
  {
    id: 'scroll_gold',
    name: '财神卷轴',
    icon: 'fa-scroll',
    description: '战斗金币掉落 +100%，持续 10 分钟。',
    cost: { town_logs: 50, town_ore: 20 },
    type: 'buff',
    buffKey: 'gold_mult',
    buffValue: 2.0,
    buffDuration: 600_000,
  },
  {
    id: 'town_iron_sword',
    name: '精铁长剑',
    icon: 'fa-sword',
    description: '装备后攻击力 +10。',
    cost: { town_ore: 80 },
    type: 'item',
    itemId: 'iron_sword',
  },
  {
    id: 'town_steel_armor',
    name: '精钢战甲',
    icon: 'fa-shirt',
    description: '装备后防御力 +15。',
    cost: { town_ore: 120, town_logs: 40 },
    type: 'item',
    itemId: 'steel_body',
  },
]
