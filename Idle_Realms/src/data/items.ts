// ==================== 物品定义 ====================
// 所有物品的静态配置，按 id 索引
// 新增物品只需在此添加条目，逻辑层自动识别

export type ItemType =
  | 'log'
  | 'ore'
  | 'raw_food'
  | 'food'
  | 'weapon'
  | 'armor'
  | 'misc'

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export type EquipmentSlot =
  | 'weapon'
  | 'helmet'
  | 'body'
  | 'legs'
  | 'boots'
  | 'ring'
  | 'amulet'

export interface BuffConfig {
  stat: string        // 属性名，如 'maxHp', 'atk', 'def'
  value: number       // Buff 数值
  duration: number    // 持续次数（战斗回合数）
}

export interface ItemConfig {
  id: string
  name: string
  icon: string            // FontAwesome icon class，如 'fa-tree'
  type: ItemType
  value: number           // 基础售价
  rarity: Rarity
  heal?: number           // 食物恢复 HP 量
  atk?: number            // 武器/饰品攻击力
  def?: number            // 防具/饰品防御力
  slot?: EquipmentSlot    // 装备槽位
  buff?: BuffConfig       // 食物 Buff（v1 后期加入）
}

export const ITEMS: Record<string, ItemConfig> = {
  // ===== 木材 =====
  logs:           { id: 'logs',           name: '原木',   icon: 'fa-tree',       type: 'log',      value: 5,   rarity: 'common' },
  oak_logs:       { id: 'oak_logs',       name: '橡木',   icon: 'fa-tree',       type: 'log',      value: 15,  rarity: 'common' },
  willow_logs:    { id: 'willow_logs',    name: '柳木',   icon: 'fa-tree',       type: 'log',      value: 40,  rarity: 'common' },
  maple_logs:     { id: 'maple_logs',     name: '枫木',   icon: 'fa-tree',       type: 'log',      value: 90,  rarity: 'uncommon' },

  // ===== 矿石 =====
  copper_ore:     { id: 'copper_ore',     name: '铜矿',   icon: 'fa-gem',        type: 'ore',      value: 5,   rarity: 'common' },
  tin_ore:        { id: 'tin_ore',        name: '锡矿',   icon: 'fa-gem',        type: 'ore',      value: 5,   rarity: 'common' },
  iron_ore:       { id: 'iron_ore',       name: '铁矿',   icon: 'fa-gem',        type: 'ore',      value: 20,  rarity: 'common' },
  coal_ore:       { id: 'coal_ore',       name: '煤矿',   icon: 'fa-gem',        type: 'ore',      value: 45,  rarity: 'common' },
  silver_ore:     { id: 'silver_ore',     name: '银矿',   icon: 'fa-gem',        type: 'ore',      value: 100, rarity: 'uncommon' },
  gold_ore:       { id: 'gold_ore',       name: '金矿',   icon: 'fa-gem',        type: 'ore',      value: 200, rarity: 'rare' },
  mineral_ore:    { id: 'mineral_ore',    name: '秘银矿', icon: 'fa-gem',        type: 'ore',      value: 500, rarity: 'epic' },
  
  // ===== 生食 =====
  raw_shrimp:     { id: 'raw_shrimp',     name: '生虾',   icon: 'fa-shrimp',     type: 'raw_food', value: 5,   rarity: 'common' },
  raw_herring:    { id: 'raw_herring',    name: '生鲱鱼', icon: 'fa-fish',       type: 'raw_food', value: 12,  rarity: 'common' },
  raw_bass:       { id: 'raw_bass',       name: '生鲈鱼', icon: 'fa-fish',       type: 'raw_food', value: 30,  rarity: 'common' },
  raw_salmon:     { id: 'raw_salmon',     name: '生鲑鱼', icon: 'fa-fish',       type: 'raw_food', value: 60,  rarity: 'uncommon' },

  // ===== 熟食 =====
  cooked_shrimp:  { id: 'cooked_shrimp',  name: '熟虾',   icon: 'fa-bowl-food', type: 'food',    value: 10,  heal: 5,  rarity: 'common' },
  cooked_herring: { id: 'cooked_herring', name: '熟鲱鱼', icon: 'fa-bowl-food', type: 'food',    value: 25,  heal: 9,  rarity: 'common' },
  cooked_bass:    { id: 'cooked_bass',    name: '熟鲈鱼', icon: 'fa-bowl-food', type: 'food',    value: 60,  heal: 16, rarity: 'common' },
  cooked_salmon:  { id: 'cooked_salmon',  name: '熟鲑鱼', icon: 'fa-bowl-food', type: 'food',    value: 120, heal: 28, rarity: 'uncommon' },

  // ===== 武器 =====
  bronze_sword:   { id: 'bronze_sword',   name: '青铜剑', icon: 'fa-sword',    type: 'weapon', slot: 'weapon', atk: 3,  value: 80,   rarity: 'common' },
  iron_sword:     { id: 'iron_sword',     name: '铁剑',   icon: 'fa-sword',    type: 'weapon', slot: 'weapon', atk: 7,  value: 250,  rarity: 'common' },
  steel_sword:    { id: 'steel_sword',    name: '钢剑',   icon: 'fa-sword',    type: 'weapon', slot: 'weapon', atk: 14, value: 800,  rarity: 'uncommon' },
  mithril_sword:  { id: 'mithril_sword',  name: '秘银剑', icon: 'fa-khanda',  type: 'weapon', slot: 'weapon', atk: 28, value: 2500, rarity: 'rare' },

  // ===== 防具 =====
  bronze_helm:    { id: 'bronze_helm',    name: '青铜盔',   icon: 'fa-hat-wizard', type: 'armor', slot: 'helmet', def: 2,  value: 60,   rarity: 'common' },
  iron_helm:      { id: 'iron_helm',      name: '铁盔',     icon: 'fa-hat-wizard', type: 'armor', slot: 'helmet', def: 5,  value: 200,  rarity: 'common' },
  bronze_body:    { id: 'bronze_body',    name: '青铜胸甲', icon: 'fa-shirt',      type: 'armor', slot: 'body',   def: 4,  value: 100,  rarity: 'common' },
  iron_body:      { id: 'iron_body',      name: '铁胸甲',   icon: 'fa-shirt',      type: 'armor', slot: 'body',   def: 10, value: 350,  rarity: 'common' },
  steel_body:     { id: 'steel_body',     name: '钢胸甲',   icon: 'fa-shirt',      type: 'armor', slot: 'body',   def: 20, value: 1100, rarity: 'uncommon' },
  bronze_legs:    { id: 'bronze_legs',    name: '青铜腿甲', icon: 'fa-socks',      type: 'armor', slot: 'legs',   def: 2,  value: 50,   rarity: 'common' },
  iron_legs:      { id: 'iron_legs',      name: '铁腿甲',   icon: 'fa-socks',      type: 'armor', slot: 'legs',   def: 5,  value: 180,  rarity: 'common' },
  leather_boots:  { id: 'leather_boots',  name: '皮靴',     icon: 'fa-shoe-prints',type: 'armor', slot: 'boots',  def: 1,  value: 30,   rarity: 'common' },
  iron_boots:     { id: 'iron_boots',     name: '铁靴',     icon: 'fa-shoe-prints',type: 'armor', slot: 'boots',  def: 4,  value: 150,  rarity: 'common' },

  // ===== 饰品 =====
  power_ring:     { id: 'power_ring',     name: '力量戒指', icon: 'fa-ring',  type: 'armor', slot: 'ring',  atk: 4, value: 500,  rarity: 'uncommon' },
  defense_ring:   { id: 'defense_ring',   name: '防御戒指', icon: 'fa-ring',  type: 'armor', slot: 'ring',  def: 4, value: 500,  rarity: 'uncommon' },
  power_amulet:   { id: 'power_amulet',   name: '力量项链', icon: 'fa-link',  type: 'armor', slot: 'amulet', atk: 8, value: 1500, rarity: 'rare' },

  // ===== 战利品/杂项 =====
  chicken_feather:{ id: 'chicken_feather',name: '鸡毛',     icon: 'fa-feather',type: 'misc', value: 2,   rarity: 'common' },
  cow_hide:       { id: 'cow_hide',       name: '牛皮',     icon: 'fa-square', type: 'misc', value: 8,   rarity: 'common' },
  goblin_ear:     { id: 'goblin_ear',     name: '哥布林之耳',icon: 'fa-leaf',  type: 'misc', value: 20,  rarity: 'common' },
  bone:           { id: 'bone',           name: '骨头',     icon: 'fa-bone',   type: 'misc', value: 15,  rarity: 'common' },
  gem_red:        { id: 'gem_red',        name: '红宝石',   icon: 'fa-gem',    type: 'misc', value: 300, rarity: 'epic' },

  // ===== 农务产物 =====
  carrot:         { id: 'carrot',         name: '胡萝卜',   icon: 'fa-carrot',       type: 'misc', value: 5,   rarity: 'common' },
  tomato:         { id: 'tomato',         name: '番茄',     icon: 'fa-apple-whole', type: 'misc', value: 10,  rarity: 'common' },
  strawberry:     { id: 'strawberry',     name: '草莓',     icon: 'fa-strawberry',  type: 'misc', value: 25,  rarity: 'uncommon' },
  potato:         { id: 'potato',         name: '土豆',     icon: 'fa-potato',      type: 'misc', value: 40,  rarity: 'uncommon' },
  herb:           { id: 'herb',           name: '草药',     icon: 'fa-leaf',        type: 'misc', value: 60,  rarity: 'uncommon' },
  magic_herb:     { id: 'magic_herb',     name: '魔草',     icon: 'fa-clover',      type: 'misc', value: 300, rarity: 'rare' },
}

/** 稀有度对应的卖出价格倍率 */
export const RARITY_SELL_MULTIPLIER: Record<Rarity, number> = {
  common:    0.5,
  uncommon:  1.0,
  rare:      2.0,
  epic:      5.0,
  legendary: 10.0,
}
