// ==================== 商店配置 ====================

export interface ShopEntry {
  id: string        // 物品 ID
  price: number     // 售价
}

export const SHOP_ITEMS: ShopEntry[] = [
  // 武器
  { id: 'bronze_sword',  price: 200 },
  { id: 'iron_sword',    price: 600 },
  { id: 'steel_sword',   price: 2000 },
  { id: 'mithril_sword', price: 6000 },
  // 头盔
  { id: 'bronze_helm',   price: 150 },
  { id: 'iron_helm',     price: 500 },
  // 胸甲
  { id: 'bronze_body',   price: 250 },
  { id: 'iron_body',     price: 850 },
  { id: 'steel_body',    price: 2800 },
  // 腿甲
  { id: 'bronze_legs',   price: 120 },
  { id: 'iron_legs',     price: 450 },
  // 靴子
  { id: 'leather_boots', price: 80 },
  { id: 'iron_boots',    price: 380 },
  // 饰品
  { id: 'power_ring',    price: 1200 },
  { id: 'defense_ring',  price: 1200 },
  { id: 'power_amulet',  price: 3800 },
]
