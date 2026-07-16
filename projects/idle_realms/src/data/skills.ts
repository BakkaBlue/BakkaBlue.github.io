// ==================== 技能动作定义 ====================

export type SkillId =
  | 'woodcutting' | 'mining' | 'fishing'
  | 'cooking' | 'smithing' | 'crafting'
  | 'combat' | 'slayer' | 'farming' | 'town'
  | 'firemaking' | 'beekeeping' | 'salvaging'
  | 'archaeology' | 'prospecting'
  | 'alchemy' | 'astrology' | 'astronomy'
  | 'engineering'

export type SkillCategory = 'noncombat' | 'combat'

export type SkillSubCategory = 'gather' | 'process' | 'transform' | 'knowledge'

export interface SkillAction {
  id: string
  name: string
  icon: string
  levelReq: number
  xp: number
  time: number             // 耗时（毫秒）
  drops: Record<string, number>    // 产出 { itemId: qty }
  consume?: Record<string, number> // 消耗材料（加工类）
}

export interface SkillConfig {
  id: SkillId
  icon: string
  category: SkillCategory
  subCategory: SkillSubCategory
  unlockCondition?: {       // 解锁条件（null = 初始可用）
    skill: SkillId
    level: number
  } | null
  dependencies?: {
    consumes: { itemId: string; fromSkill: SkillId }[]
    produces: { itemId: string }[]
    // requiredBy 不存储 — 由 useDependencies() 自动推导
  }
  actions: SkillAction[]
}

export const SKILLS: SkillConfig[] = [
  {
    id: 'woodcutting', icon: 'fa-tree',
    category: 'noncombat', subCategory: 'gather',
    unlockCondition: null,
    dependencies: {
      consumes: [],
      produces: [
        { itemId: 'logs' }, { itemId: 'oak_logs' },
        { itemId: 'willow_logs' }, { itemId: 'maple_logs' },
      ],
    },
    actions: [
      { id: 'normal_tree', name: '普通树木', icon: 'fa-tree',     levelReq: 1,  xp: 8,   time: 2500, drops: { logs: 1 } },
      { id: 'oak_tree',    name: '橡树',     icon: 'fa-tree',     levelReq: 5,  xp: 20,  time: 4000, drops: { oak_logs: 1 } },
      { id: 'willow_tree', name: '柳树',     icon: 'fa-tree',     levelReq: 15, xp: 45,  time: 6000, drops: { willow_logs: 1 } },
      { id: 'maple_tree',  name: '枫树',     icon: 'fa-tree',     levelReq: 30, xp: 100, time: 9000, drops: { maple_logs: 1 } },
    ],
  },
  {
    id: 'mining', icon: 'fa-gem',
    category: 'noncombat', subCategory: 'gather',
    unlockCondition: null,
    dependencies: {
      consumes: [],
      produces: [
        { itemId: 'copper_ore' }, { itemId: 'tin_ore' },
        { itemId: 'iron_ore' }, { itemId: 'coal_ore' },
        { itemId: 'silver_ore' }, { itemId: 'gold_ore' },
        { itemId: 'mineral_ore' },
      ],
    },
    actions: [
      { id: 'copper_rock', name: '铜矿脉', icon: 'fa-gem', levelReq: 1,  xp: 8,   time: 3000,  drops: { copper_ore: 1 } },
      { id: 'tin_rock',    name: '锡矿脉', icon: 'fa-gem', levelReq: 1,  xp: 8,   time: 3000,  drops: { tin_ore: 1 } },
      { id: 'iron_rock',   name: '铁矿脉', icon: 'fa-gem', levelReq: 10, xp: 25,  time: 5000,  drops: { iron_ore: 1 } },
      { id: 'coal_rock',   name: '煤矿脉', icon: 'fa-gem', levelReq: 20, xp: 50,  time: 7000,  drops: { coal_ore: 1 } },
      { id: 'silver_rock', name: '银矿脉', icon: 'fa-gem', levelReq: 35, xp: 120, time: 10000, drops: { silver_ore: 1 } },
      { id: 'gold_rock',   name: '金矿脉',   icon: 'fa-gem', levelReq: 50, xp: 250, time: 14000, drops: { gold_ore: 1 } },
      { id: 'mineral_rock',name: '秘银矿脉', icon: 'fa-gem', levelReq: 65, xp: 500, time: 20000, drops: { mineral_ore: 1 } },
    ],
  },
  {
    id: 'fishing', icon: 'fa-fish',
    category: 'noncombat', subCategory: 'gather',
    unlockCondition: null,
    dependencies: {
      consumes: [],
      produces: [
        { itemId: 'raw_shrimp' }, { itemId: 'raw_herring' },
        { itemId: 'raw_bass' }, { itemId: 'raw_salmon' },
      ],
    },
    actions: [
      { id: 'shrimp',  name: '捕虾',   icon: 'fa-shrimp',  levelReq: 1,  xp: 8,   time: 2500, drops: { raw_shrimp: 1 } },
      { id: 'herring', name: '捕鲱鱼', icon: 'fa-fish',    levelReq: 5,  xp: 18,  time: 4000, drops: { raw_herring: 1 } },
      { id: 'bass',    name: '捕鲈鱼', icon: 'fa-fish',    levelReq: 15, xp: 45,  time: 6500, drops: { raw_bass: 1 } },
      { id: 'salmon',  name: '捕鲑鱼', icon: 'fa-fish',    levelReq: 30, xp: 100, time: 9000, drops: { raw_salmon: 1 } },
    ],
  },
  {
    id: 'cooking', icon: 'fa-bowl-food',
    category: 'noncombat', subCategory: 'process',
    unlockCondition: null,
    dependencies: {
      consumes: [
        { itemId: 'raw_shrimp', fromSkill: 'fishing' },
        { itemId: 'raw_herring', fromSkill: 'fishing' },
        { itemId: 'raw_bass', fromSkill: 'fishing' },
        { itemId: 'raw_salmon', fromSkill: 'fishing' },
      ],
      produces: [
        { itemId: 'cooked_shrimp' }, { itemId: 'cooked_herring' },
        { itemId: 'cooked_bass' }, { itemId: 'cooked_salmon' },
      ],
    },
    actions: [
      { id: 'cook_shrimp',  name: '烹饪虾',   icon: 'fa-bowl-food', levelReq: 1,  xp: 10,  time: 2000, consume: { raw_shrimp: 1 },  drops: { cooked_shrimp: 1 } },
      { id: 'cook_herring', name: '烹饪鲱鱼', icon: 'fa-bowl-food', levelReq: 5,  xp: 25,  time: 3000, consume: { raw_herring: 1 }, drops: { cooked_herring: 1 } },
      { id: 'cook_bass',    name: '烹饪鲈鱼', icon: 'fa-bowl-food', levelReq: 15, xp: 55,  time: 4500, consume: { raw_bass: 1 },    drops: { cooked_bass: 1 } },
      { id: 'cook_salmon',  name: '烹饪鲑鱼', icon: 'fa-bowl-food', levelReq: 30, xp: 120, time: 6000, consume: { raw_salmon: 1 },  drops: { cooked_salmon: 1 } },
    ],
  },
  {
    id: 'smithing', icon: 'fa-hammer',
    category: 'noncombat', subCategory: 'process',
    unlockCondition: { skill: 'mining', level: 10 },
    dependencies: {
      consumes: [
        { itemId: 'copper_ore', fromSkill: 'mining' },
        { itemId: 'tin_ore', fromSkill: 'mining' },
        { itemId: 'iron_ore', fromSkill: 'mining' },
        { itemId: 'coal_ore', fromSkill: 'mining' },
        { itemId: 'silver_ore', fromSkill: 'mining' },
        { itemId: 'gold_ore', fromSkill: 'mining' },
        { itemId: 'mineral_ore', fromSkill: 'mining' },
      ],
      produces: [{ itemId: 'bars' }],
    },
    actions: [
      { id: 'smelt_bronze',  name: '熔炼青铜锭', icon: 'fa-hammer', levelReq: 1,  xp: 12,  time: 3000,  consume: { copper_ore: 1, tin_ore: 1 }, drops: { bronze_bar: 1 } },
      { id: 'smelt_iron',    name: '熔炼铁锭',   icon: 'fa-hammer', levelReq: 15, xp: 35,  time: 5000,  consume: { iron_ore: 2 },              drops: { iron_bar: 1 } },
      { id: 'smelt_steel',   name: '熔炼钢锭',   icon: 'fa-hammer', levelReq: 30, xp: 80,  time: 8000,  consume: { iron_ore: 1, coal_ore: 2 },   drops: { steel_bar: 1 } },
      { id: 'smelt_mithril', name: '熔炼秘银锭', icon: 'fa-hammer', levelReq: 50, xp: 200, time: 12000, consume: { mineral_ore: 2 },            drops: { mithril_bar: 1 } },
      { id: 'smelt_adamant', name: '熔炼精金锭', icon: 'fa-hammer', levelReq: 70, xp: 450, time: 18000, consume: { gold_ore: 2, coal_ore: 3 },   drops: { adamantite_bar: 1 } },
    ],
  },
  {
    id: 'crafting', icon: 'fa-scissors',
    category: 'noncombat', subCategory: 'process',
    unlockCondition: { skill: 'mining', level: 10 },
    dependencies: {
      consumes: [{ itemId: 'bars', fromSkill: 'smithing' }],
      produces: [{ itemId: 'tools' }],
    },
    actions: [
      { id: 'craft_bronze_tools',   name: '制作青铜工具', icon: 'fa-scissors', levelReq: 1,  xp: 15,  time: 3500,  consume: { bronze_bar: 2 },          drops: { bronze_tools: 1 } },
      { id: 'craft_iron_tools',     name: '制作铁工具',   icon: 'fa-scissors', levelReq: 15, xp: 40,  time: 5500,  consume: { iron_bar: 2 },             drops: { iron_tools: 1 } },
      { id: 'craft_steel_tools',    name: '制作钢工具',   icon: 'fa-scissors', levelReq: 30, xp: 90,  time: 8500,  consume: { steel_bar: 2 },            drops: { steel_tools: 1 } },
      { id: 'craft_jewelry',        name: '制作珠宝',     icon: 'fa-scissors', levelReq: 50, xp: 220, time: 13000, consume: { gold_ore: 3, gems: 1 },     drops: { jewelry: 1 } },
      { id: 'craft_advanced_gear',  name: '制作高级装备', icon: 'fa-scissors', levelReq: 70, xp: 480, time: 20000, consume: { mithril_bar: 2, bars: 3 },  drops: { advanced_gear: 1 } },
    ],
  },
  {
    id: 'firemaking', icon: 'fa-fire',
    category: 'noncombat', subCategory: 'process',
    unlockCondition: { skill: 'woodcutting', level: 5 },
    dependencies: {
      consumes: [{ itemId: 'logs', fromSkill: 'woodcutting' }],
      produces: [{ itemId: 'charcoal' }, { itemId: 'ash' }],
    },
    actions: [
      { id: 'burn_logs',    name: '燃烧普通木', icon: 'fa-fire', levelReq: 1,  xp: 10,  time: 2500,  consume: { logs: 1 },          drops: { charcoal: 1, ash: 1 } },
      { id: 'burn_oak',     name: '燃烧橡木',   icon: 'fa-fire', levelReq: 10, xp: 25,  time: 4000,  consume: { oak_logs: 1 },       drops: { charcoal: 2, ash: 1 } },
      { id: 'burn_willow',  name: '燃烧柳木',   icon: 'fa-fire', levelReq: 25, xp: 55,  time: 6000,  consume: { willow_logs: 1 },    drops: { charcoal: 3, ash: 2 } },
      { id: 'burn_maple',   name: '燃烧枫木',   icon: 'fa-fire', levelReq: 45, xp: 130, time: 9000,  consume: { maple_logs: 1 },     drops: { charcoal: 5, ash: 3 } },
      { id: 'burn_magic',   name: '燃烧魔法木', icon: 'fa-fire', levelReq: 65, xp: 300, time: 14000, consume: { magic_logs: 1 },      drops: { charcoal: 8, ash: 5 } },
    ],
  },
  {
    id: 'beekeeping', icon: 'fa-bug',
    category: 'noncombat', subCategory: 'knowledge',
    unlockCondition: { skill: 'farming', level: 5 },
    dependencies: {
      consumes: [],
      produces: [{ itemId: 'honey' }, { itemId: 'beeswax' }],
    },
    actions: [
      { id: 'wild_hive',          name: '野生蜂巢', icon: 'fa-bug', levelReq: 1,  xp: 10,  time: 3000,  drops: { honey: 1, beeswax: 1 } },
      { id: 'basic_hive',         name: '基础蜂箱', icon: 'fa-bug', levelReq: 15, xp: 30,  time: 5000,  drops: { honey: 2, beeswax: 1 } },
      { id: 'improved_hive',      name: '改良蜂箱', icon: 'fa-bug', levelReq: 30, xp: 70,  time: 7500,  drops: { honey: 3, beeswax: 2 } },
      { id: 'advanced_apiary',    name: '高级蜂场', icon: 'fa-bug', levelReq: 50, xp: 180, time: 11000, drops: { honey: 5, beeswax: 3, royal_jelly: 1 } },
      { id: 'royal_apiary',       name: '皇家蜂场', icon: 'fa-bug', levelReq: 70, xp: 400, time: 16000, drops: { honey: 8, beeswax: 5, royal_jelly: 2 } },
    ],
  },
  {
    id: 'salvaging', icon: 'fa-wrench',
    category: 'noncombat', subCategory: 'gather',
    unlockCondition: { skill: 'crafting', level: 15 },
    dependencies: {
      consumes: [],
      produces: [{ itemId: 'components' }, { itemId: 'ancient_parts' }],
    },
    actions: [
      { id: 'salvage_basic',      name: '拆解普通装备', icon: 'fa-wrench', levelReq: 1,  xp: 12,  time: 3000,  drops: { components: 1 } },
      { id: 'salvage_weapons',    name: '拆解武器',     icon: 'fa-wrench', levelReq: 15, xp: 35,  time: 5000,  drops: { components: 2, iron_bar: 1 } },
      { id: 'salvage_armor',      name: '拆解护甲',     icon: 'fa-wrench', levelReq: 30, xp: 80,  time: 7500,  drops: { components: 3, steel_bar: 1 } },
      { id: 'salvage_mechanical', name: '拆解机械装置', icon: 'fa-wrench', levelReq: 50, xp: 200, time: 11000, drops: { components: 5, ancient_parts: 1 } },
      { id: 'salvage_ancient',    name: '拆解古代遗物', icon: 'fa-wrench', levelReq: 70, xp: 450, time: 16000, drops: { components: 8, ancient_parts: 3 } },
    ],
  },
  {
    id: 'archaeology', icon: 'fa-monument',
    category: 'noncombat', subCategory: 'knowledge',
    unlockCondition: { skill: 'mining', level: 25 },
    dependencies: {
      consumes: [{ itemId: 'ancient_parts', fromSkill: 'salvaging' }],
      produces: [{ itemId: 'artifacts' }, { itemId: 'fossils' }],
    },
    actions: [
      { id: 'dig_ruins',              name: '挖掘遗迹',       icon: 'fa-monument', levelReq: 1,  xp: 15,  time: 4000,  drops: { artifacts: 1, fossils: 1 } },
      { id: 'explore_temple',         name: '探索神庙',       icon: 'fa-monument', levelReq: 15, xp: 40,  time: 6500,  drops: { artifacts: 2, ancient_parts: 1 } },
      { id: 'investigate_tomb',       name: '调查古墓',       icon: 'fa-monument', levelReq: 35, xp: 100, time: 10000, drops: { artifacts: 3, fossils: 2 } },
      { id: 'excavate_civilization',  name: '发掘失落文明',   icon: 'fa-monument', levelReq: 55, xp: 250, time: 15000, drops: { artifacts: 5, ancient_parts: 3 } },
      { id: 'ancient_site',           name: '远古遗址',       icon: 'fa-monument', levelReq: 75, xp: 550, time: 22000, drops: { artifacts: 8, fossils: 5, ancient_parts: 5 } },
    ],
  },
  {
    id: 'prospecting', icon: 'fa-magnifying-glass',
    category: 'noncombat', subCategory: 'gather',
    unlockCondition: { skill: 'mining', level: 15 },
    dependencies: {
      consumes: [],
      produces: [{ itemId: 'gems' }],
    },
    actions: [
      { id: 'prospect_basic',      name: '勘探普通矿层', icon: 'fa-magnifying-glass', levelReq: 1,  xp: 10,  time: 3000,  drops: { gems: 1 } },
      { id: 'prospect_gem',        name: '寻找宝石矿脉', icon: 'fa-magnifying-glass', levelReq: 15, xp: 30,  time: 5000,  drops: { gems: 2, silver_ore: 1 } },
      { id: 'prospect_deep',       name: '深层矿脉',     icon: 'fa-magnifying-glass', levelReq: 30, xp: 75,  time: 8000,  drops: { gems: 3, gold_ore: 1 } },
      { id: 'prospect_crystal',    name: '晶体矿脉',     icon: 'fa-magnifying-glass', levelReq: 50, xp: 190, time: 12000, drops: { gems: 5, mineral_ore: 1 } },
      { id: 'prospect_ancient',    name: '远古矿脉',     icon: 'fa-magnifying-glass', levelReq: 70, xp: 420, time: 18000, drops: { gems: 8, mineral_ore: 3 } },
    ],
  },
  {
    id: 'alchemy', icon: 'fa-flask',
    category: 'noncombat', subCategory: 'transform',
    unlockCondition: { skill: 'crafting', level: 15 },
    dependencies: {
      consumes: [
        { itemId: 'honey', fromSkill: 'beekeeping' },
        { itemId: 'gems', fromSkill: 'prospecting' },
        { itemId: 'ash', fromSkill: 'firemaking' },
      ],
      produces: [{ itemId: 'potions' }, { itemId: 'essences' }],
    },
    actions: [
      { id: 'brew_health',        name: '生命药剂',   icon: 'fa-flask', levelReq: 1,  xp: 15,  time: 3500,  consume: { honey: 2, ash: 1 },           drops: { health_potion: 1 } },
      { id: 'brew_mana',          name: '法力药剂',   icon: 'fa-flask', levelReq: 15, xp: 40,  time: 5500,  consume: { honey: 3, gems: 1 },          drops: { mana_potion: 1 } },
      { id: 'brew_resistance',    name: '抗性药剂',   icon: 'fa-flask', levelReq: 30, xp: 90,  time: 8500,  consume: { essences: 1, ash: 3 },        drops: { resistance_potion: 1 } },
      { id: 'brew_enhancement',   name: '强化药剂',   icon: 'fa-flask', levelReq: 50, xp: 230, time: 13000, consume: { essences: 2, gems: 3 },        drops: { enhancement_potion: 1 } },
      { id: 'extract_essence',    name: '精华提炼',   icon: 'fa-flask', levelReq: 70, xp: 500, time: 20000, consume: { potions: 1, royal_jelly: 1 },  drops: { essences: 3 } },
    ],
  },
  {
    id: 'astrology', icon: 'fa-star',
    category: 'noncombat', subCategory: 'knowledge',
    unlockCondition: { skill: 'archaeology', level: 10 },
    dependencies: {
      consumes: [{ itemId: 'artifacts', fromSkill: 'archaeology' }],
      produces: [{ itemId: 'stardust' }],
    },
    actions: [
      { id: 'observe_constellation', name: '观测星座', icon: 'fa-star', levelReq: 1,  xp: 12,  time: 3500,  drops: { stardust: 1 } },
      { id: 'read_stars',           name: '解读星象', icon: 'fa-star', levelReq: 20, xp: 45,  time: 6000,  consume: { artifacts: 1 },               drops: { stardust: 2 } },
      { id: 'divine_fate',          name: '占卜命运', icon: 'fa-star', levelReq: 40, xp: 110, time: 10000, consume: { stardust: 3 },                 drops: { stardust: 5, fortune_token: 1 } },
      { id: 'study_astrolabe',      name: '研究星盘', icon: 'fa-star', levelReq: 60, xp: 280, time: 15000, consume: { stardust: 5, gems: 2 },         drops: { stardust: 8, star_charts: 1 } },
      { id: 'stellar_resonance',    name: '恒星共鸣', icon: 'fa-star', levelReq: 80, xp: 600, time: 22000, consume: { stardust: 10, essences: 2 },     drops: { stardust: 15, star_charts: 3 } },
    ],
  },
  {
    id: 'astronomy', icon: 'fa-moon',
    category: 'noncombat', subCategory: 'knowledge',
    unlockCondition: { skill: 'astrology', level: 20 },
    dependencies: {
      consumes: [{ itemId: 'stardust', fromSkill: 'astrology' }],
      produces: [{ itemId: 'star_charts' }, { itemId: 'discovery_tokens' }],
    },
    actions: [
      { id: 'observe_moon',            name: '观测月球',   icon: 'fa-moon', levelReq: 1,  xp: 12,  time: 3500,  drops: { star_charts: 1 } },
      { id: 'observe_planets',         name: '观测行星',   icon: 'fa-moon', levelReq: 20, xp: 45,  time: 6000,  consume: { stardust: 2 },                  drops: { star_charts: 2 } },
      { id: 'chart_stars',             name: '绘制星图',   icon: 'fa-moon', levelReq: 40, xp: 110, time: 10000, consume: { star_charts: 3 },                drops: { star_charts: 5, discovery_tokens: 1 } },
      { id: 'deep_space',              name: '深空观测',   icon: 'fa-moon', levelReq: 60, xp: 280, time: 15000, consume: { star_charts: 5, discovery_tokens: 1 }, drops: { star_charts: 8, discovery_tokens: 2 } },
      { id: 'celestial_research',      name: '天体研究',   icon: 'fa-moon', levelReq: 80, xp: 600, time: 22000, consume: { star_charts: 10, essences: 2 },     drops: { star_charts: 15, discovery_tokens: 5 } },
    ],
  },
  {
    id: 'engineering', icon: 'fa-gears',
    category: 'noncombat', subCategory: 'transform',
    unlockCondition: { skill: 'smithing', level: 20 },
    dependencies: {
      consumes: [
        { itemId: 'bars', fromSkill: 'smithing' },
        { itemId: 'components', fromSkill: 'salvaging' },
      ],
      produces: [{ itemId: 'devices' }, { itemId: 'tool_upgrades' }],
    },
    actions: [
      { id: 'craft_parts',             name: '制作机械零件', icon: 'fa-gears', levelReq: 1,  xp: 15,  time: 4000,  consume: { bars: 2, components: 1 },         drops: { devices: 1 } },
      { id: 'assemble_device',         name: '组装装置',     icon: 'fa-gears', levelReq: 20, xp: 50,  time: 7000,  consume: { devices: 2, iron_bar: 2 },         drops: { devices: 3, tool_upgrades: 1 } },
      { id: 'build_automaton',         name: '制作自动机械', icon: 'fa-gears', levelReq: 40, xp: 130, time: 11000, consume: { devices: 3, steel_bar: 2 },         drops: { devices: 5, tool_upgrades: 2 } },
      { id: 'craft_advanced_tools',    name: '制作高级工具', icon: 'fa-gears', levelReq: 60, xp: 320, time: 16000, consume: { devices: 5, mithril_bar: 2 },       drops: { devices: 8, tool_upgrades: 3 } },
      { id: 'build_engineering_device',name: '制作工程设备', icon: 'fa-gears', levelReq: 80, xp: 680, time: 24000, consume: { devices: 10, ancient_parts: 3 },    drops: { devices: 15, tool_upgrades: 5 } },
    ],
  },
  // === Combat ===
  {
    id: 'combat', icon: 'fa-sword',
    category: 'combat', subCategory: 'gather',
    unlockCondition: null,
    dependencies: {
      consumes: [],
      produces: [{ itemId: 'gold' }, { itemId: 'equipment' }],
    },
    actions: [
      { id: 'training_dummy', name: '训练木桩', icon: 'fa-sword', levelReq: 1,  xp: 10,  time: 2500,  drops: { gold: 5 } },
      { id: 'chicken',        name: '鸡',       icon: 'fa-sword', levelReq: 1,  xp: 15,  time: 3000,  drops: { gold: 8, raw_chicken: 1 } },
      { id: 'goblin',         name: '哥布林',   icon: 'fa-sword', levelReq: 10, xp: 35,  time: 4500,  drops: { gold: 20, copper_ore: 1 } },
      { id: 'orc',            name: '兽人',     icon: 'fa-sword', levelReq: 25, xp: 80,  time: 6500,  drops: { gold: 50, iron_ore: 1 } },
      { id: 'troll',          name: '巨魔',     icon: 'fa-sword', levelReq: 40, xp: 180, time: 9000,  drops: { gold: 120, coal_ore: 2 } },
      { id: 'demon',          name: '恶魔',     icon: 'fa-sword', levelReq: 60, xp: 400, time: 13000, drops: { gold: 300, ancient_parts: 1 } },
      { id: 'dragon',         name: '巨龙',     icon: 'fa-sword', levelReq: 80, xp: 900, time: 18000, drops: { gold: 800, ancient_parts: 3, gems: 2 } },
    ],
  },
  {
    id: 'slayer', icon: 'fa-skull',
    category: 'combat', subCategory: 'process',
    unlockCondition: { skill: 'combat', level: 10 },
    dependencies: {
      consumes: [],
      produces: [{ itemId: 'slayer_points' }],
    },
    actions: [
      { id: 'slayer_easy',   name: '初级委托', icon: 'fa-skull', levelReq: 1,  xp: 50,   time: 8000,  drops: { gold: 30, slayer_points: 5 } },
      { id: 'slayer_medium', name: '中级委托', icon: 'fa-skull', levelReq: 20, xp: 150,  time: 15000, drops: { gold: 100, slayer_points: 10 } },
      { id: 'slayer_hard',   name: '高级委托', icon: 'fa-skull', levelReq: 40, xp: 400,  time: 25000, drops: { gold: 300, slayer_points: 20 } },
      { id: 'slayer_elite',  name: '精英委托', icon: 'fa-skull', levelReq: 60, xp: 1000, time: 40000, drops: { gold: 800, slayer_points: 40 } },
      { id: 'slayer_master', name: '大师委托', icon: 'fa-skull', levelReq: 80, xp: 2500, time: 60000, drops: { gold: 2000, slayer_points: 80 } },
    ],
  },
]

/** 技能名称映射 */
export const SKILL_NAMES: Record<SkillId, string> = {
  woodcutting: '伐木',
  mining: '采矿',
  fishing: '钓鱼',
  cooking: '烹饪',
  combat: '战斗',
  smithing: '锻造',
  crafting: '工艺',
  slayer: '屠杀者',
  farming: '农业',
  town: '城镇',
  firemaking: '生火',
  beekeeping: '养蜂',
  salvaging: '回收',
  archaeology: '考古',
  prospecting: '勘探',
  alchemy: '炼金',
  astrology: '占星术',
  astronomy: '天文学',
  engineering: '工程',
}

/** 技能图标映射 */
export const SKILL_ICONS: Record<SkillId, string> = {
  woodcutting: 'fa-tree',
  mining: 'fa-gem',
  fishing: 'fa-fish',
  cooking: 'fa-bowl-food',
  combat: 'fa-sword',
  smithing: 'fa-hammer',
  crafting: 'fa-scissors',
  slayer: 'fa-skull',
  farming: 'fa-seedling',
  town: 'fa-landmark',
  firemaking: 'fa-fire',
  beekeeping: 'fa-bug',
  salvaging: 'fa-wrench',
  archaeology: 'fa-monument',
  prospecting: 'fa-magnifying-glass',
  alchemy: 'fa-flask',
  astrology: 'fa-star',
  astronomy: 'fa-moon',
  engineering: 'fa-gears',
}

/** 根据 skillId 获取配置 */
export function getSkillConfig(skillId: SkillId): SkillConfig | undefined {
  return SKILLS.find(s => s.id === skillId)
}

/** 根据 skillId + actionId 获取动作配置 */
export function getSkillAction(skillId: SkillId, actionId: string): SkillAction | undefined {
  const skill = getSkillConfig(skillId)
  return skill?.actions.find(a => a.id === actionId)
}
