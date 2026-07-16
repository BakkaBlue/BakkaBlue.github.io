// ==================== 怪物定义 ====================

export interface DropConfig {
  id: string              // 物品 ID
  chance: number          // 0-1 掉落概率
  qty: number             // 掉落数量
}

export interface MonsterConfig {
  id: string
  name: string
  icon: string            // FontAwesome icon class
  levelReq: number        // 所需战斗等级
  hp: number
  atk: number
  def: number
  xp: number
  goldMin: number
  goldMax: number
  drops: DropConfig[]
}

export const ENEMIES: MonsterConfig[] = [
  {
    id: 'chicken', name: '野生鸡', icon: 'fa-feather',
    levelReq: 1, hp: 4, atk: 1, def: 0,
    xp: 6, goldMin: 1, goldMax: 4,
    drops: [
      { id: 'chicken_feather', chance: 0.8, qty: 1 },
    ],
  },
  {
    id: 'cow', name: '野牛', icon: 'fa-cow',
    levelReq: 3, hp: 10, atk: 2, def: 1,
    xp: 14, goldMin: 3, goldMax: 8,
    drops: [
      { id: 'cow_hide', chance: 0.7, qty: 1 },
    ],
  },
  {
    id: 'goblin', name: '哥布林', icon: 'fa-skull',
    levelReq: 8, hp: 22, atk: 5, def: 2,
    xp: 35, goldMin: 8, goldMax: 18,
    drops: [
      { id: 'goblin_ear', chance: 0.6, qty: 1 },
      { id: 'bronze_sword', chance: 0.05, qty: 1 },
    ],
  },
  {
    id: 'bandit', name: '强盗', icon: 'fa-mask',
    levelReq: 15, hp: 45, atk: 9, def: 5,
    xp: 80, goldMin: 20, goldMax: 45,
    drops: [
      { id: 'iron_sword', chance: 0.05, qty: 1 },
      { id: 'iron_body', chance: 0.04, qty: 1 },
    ],
  },
  {
    id: 'skeleton', name: '骷髅战士', icon: 'fa-skull-crossbones',
    levelReq: 25, hp: 90, atk: 16, def: 10,
    xp: 180, goldMin: 50, goldMax: 110,
    drops: [
      { id: 'bone', chance: 0.9, qty: 2 },
      { id: 'steel_sword', chance: 0.04, qty: 1 },
      { id: 'steel_body', chance: 0.03, qty: 1 },
    ],
  },
  {
    id: 'troll', name: '巨魔', icon: 'fa-ghost',
    levelReq: 40, hp: 200, atk: 30, def: 18,
    xp: 400, goldMin: 120, goldMax: 280,
    drops: [
      { id: 'mithril_sword', chance: 0.03, qty: 1 },
      { id: 'gem_red', chance: 0.02, qty: 1 },
      { id: 'power_amulet', chance: 0.02, qty: 1 },
    ],
  },
]
