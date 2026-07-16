export default {
  // 侧栏分组
  sidebar: {
    noncombat: '非战斗',
    combat: '战斗',
    noncombat_overview: '全部技能',
    combat_overview: '全部技能',
    farming: '农业',
    town: '城镇设施',
    town_shop: '军需商店',
    shop: '商店',
    inventory: '背包',
    settings: '设置',
    menu: '返回菜单',
  },

  // 存档菜单
  saveMenu: {
    title: '放置王国',
    subtitle: '选择存档',
    slot: '存档',
    emptySlot: '空闲槽位',
    newGameHint: '点击右侧按钮开始新的冒险',
    enterGame: '进入游戏',
    newSave: '新建',
    totalLevel: '总等级',
    lastSave: '最后保存',
    deleteConfirm: '确定要删除存档 {slot} 吗？此操作不可撤销！',
  },

  // 技能总览网格
  skillGrid: {
    title: '技能总览',
    category: '分类',
    favorites: '收藏技能',
    noncombat: '非战斗技能',
    combat: '战斗技能',
    perHour: '/小时',
  },

  // 技能详情
  skillDetail: {
    category: '分类',
    consumes: '消耗材料',
    produces: '产出物品',
    dependencies: '依赖链',
    unlockCondition: '解锁条件',
    noActions: '暂无可用操作',
  },

  // 页面标题&副标题
  pages: {
    combat: { title: '战斗竞技场', sub: '选择目标自动战斗，获取金币、经验和装备' },
    farming: { title: '农务', sub: '购买并升级各类地块，种植对应作物以自动循环收获。点击空闲地块选择要种植的作物。' },
    town: { title: '城镇', sub: '消耗资源升级建筑和设施，获得全局加成与被动资源产出。' },
    town_shop: { title: '军需商店', sub: '消耗城镇专属资源，购买战略卷轴与专属装备。装备直接进入个人背包。' },
    settings: { title: '设置中心', sub: '管理游戏行为、外观和数据' },
    empty: '选择一项技能开始冒险',
  },

  // 技能页
  skill: {
    hint: '点击下方的资源点开始采集。采集完成后自动循环。',
    gathering: '点击下方的资源点开始采集。采集完成后自动循环。',
    production: '消耗材料以产出物品。加工完成后自动循环。',
    stopAction: '停止采集',
    startAction: '开始采集',
    unlocked: '未解锁',
    unlockHint: '需要 {skill} Lv.{level}',
    needLevel: '需要 Lv.{level}',
    collecting: '采集中',
    statusLabels: {
      ready: '就绪',
      working: '工作中',
      paused: '已暂停',
      locked: '未解锁',
    },
    removeFavorite: '取消收藏',
    addFavorite: '收藏',
    details: '详情',
  },

  // 战斗
  combat: {
    playerName: '玩家',
    selectTarget: '选择目标',
    flee: '逃跑',
    autoBattle: '自动战斗',
    autoFood: '自动进食',
    idleHint: '👇 点击下方目标立即开战',
    lockedEnemy: '🔒 需要 Lv.{level}',
    hitPlayer: '你对 {name} 造成 {damage} 点伤害',
    hitEnemy: '{name} 对你造成 {damage} 点伤害',
    victory: '🎉 击败 {name}！+{gold}💰 +{xp}XP',
    defeat: '💀 被 {name} 击败...',
    fled: '🏃 从 {name} 处逃跑',
  },

  // 装备
  equipment: {
    slots: {
      weapon: '武器', helmet: '头盔', body: '胸甲', legs: '腿甲',
      boots: '靴子', ring: '戒指', amulet: '项链',
    },
    rightClickHint: '左键卸下 · 右键菜单',
    emptyHint: '右键装备',
    searchPlaceholder: '搜索装备...',
    noMatch: '无匹配装备',
    noAvailable: '背包中没有可用于此槽位的装备',
    replace: '替换...',
  },

  // 物品详情
  itemDetail: {
    value: '{value} 金币',
    slot: '槽位',
    restore: '❤️ 恢复',
  },

  // 背包
  inventory: {
    hint: '左键装备/食用/查看 · 右键打开菜单',
    empty: '背包空空如也',
  },

  // 商店
  shop: {
    hint: '左键购买 · 右键查看详情',
    goldLabel: '💰 持有金币：',
  },

  // 农务
  farming: {
    level: '等级 {level}',
    speed: '速度 +{pct}%',
    growing: '生长中 (自动循环)',
    current: '当前: {crop}',
    remove: '拔除',
    upgradePlot: '升级 ({cost}💰)',
    upgradePlotEmpty: '升级地块 ({cost}💰)',
    selectCrop: '选择作物',
    cancel: '取消',
    needLevel: '需 Lv.{level}',
    plantCrop: '选择作物种植',
    buyPlot: '开垦新{name}',
    plotsLeft: '剩余可开垦: {count}',
    buyCost: '花费 {cost} 金币购买',
  },

  // 屠杀者
  slayer: {
    level: '屠杀者等级',
    points: '点数',
    tasksCompleted: '已完成任务',
    currentTask: '📋 当前任务',
    taskSource: '任务来源：{master}',
    kill: '🎯 击杀 ',
    xpReward: '🏆 {xp} 屠杀者 XP',
    pointReward: '⭐ {points} 点数',
    skip: '🔄 跳过 ({cost} 💰)',
    abandon: '❌ 放弃',
    noTask: '暂无任务，选择一个导师接取',
    masters: '👤 屠杀者导师',
    acceptTask: '接取任务',
    lockedMaster: '需要战斗等级 {level}',
    lockedBadge: '🔒 战斗 Lv.{level}',
    rewards: '🏪 奖励商店',
    noRewards: '还没有可购买的奖励',
    purchased: '已购买',
    needSlayerLevel: '需要屠杀者 Lv.{level}',
  },

  // 城镇
  town: {
    gold: '金币: ',
    townLogs: '城镇木材: ',
    townOre: '城镇矿石: ',
    buildings: '🏗 功能建筑（全局加成）',
    facilities: '🏭 产出设施（被动资源）',
    currentEffect: '当前效果：{effect}',
    upgradeTo: '升级至 Lv.{level}',
    currentRate: '当前产能：{rate} {resourceName}/秒',
  },

  // 日志（右侧栏）
  log: {
    itemAcquired: '获得 <strong>{name}</strong> ×{qty}',
    skillLevelup: '🎉 <strong>{name}</strong> 升至 Lv.{level}！',
    combatVictory: '⚔️ 击败 <strong>{name}</strong>，+{gold}💰',
    combatDefeat: '💀 被 <strong>{name}</strong> 击败',
    actionStarted: '开始{skillName}：<strong>{actionName}</strong>',
    foodEaten: '食用 <strong>{name}</strong> 恢复 {healAmount} HP',
    slayerComplete: '💀 屠杀者任务完成：击杀 {kills} 只{enemy}，+{points}⭐',
    idle: '空闲中 — 选择一个技能开始',
    empty: '暂无日志，开始冒险吧！',
    currentActivity: '📋 当前活动',
    logTitle: '📜 日志',
    noAction: '无',
  },

  // 离线弹窗
  offline: {
    title: '离线收益报告',
    away: '你离开了 {duration}',
    skillCycles: '🎯 {action} × <strong>{cycles}</strong> 次',
    itemsGained: '📦 获得物品 × {qty}',
    xpGained: '⭐ 经验 +{xp}',
    combatSummary: '⚔️ 离线战斗：<strong>{battles}</strong> 场（胜利 {wins} 场）',
    goldGained: '💰 获得金币 {gold}',
    combatXp: '⭐ 战斗经验 +{xp}',
    claim: '领取奖励',
  },

  // 设置
  settings: {
    tabs: {
      general: '通用',
      personalize: '个性化',
      player: '玩家',
      saves: '存档管理',
    },
    general: {
      autoSave: '自动保存',
      autoSaveDesc: '游戏将在后台自动保存进度，防止数据丢失。',
      autoSaveInterval: '自动保存频率',
      autoSaveIntervalDesc: '设置自动保存的间隔时间。',
      showRightPanel: '显示右侧信息栏',
      showRightPanelDesc: '控制右侧当前活动和日志面板的显示与隐藏。',
      reduceMotion: '减少动态效果',
      reduceMotionDesc: '关闭所有 CSS 动画和过渡特效，适合低端设备或省电模式。',
    },
    personalize: {
      theme: '界面主题',
      themeDesc: '选择你喜欢的配色方案。',
      themes: { default: '暗金', forest: '翠绿', magic: '暗紫' },
      fontSize: '字体大小',
      fontSizeDesc: '调整游戏全局文字的基准大小。',
      fontSizes: { small: '小', medium: '中 (默认)', large: '大' },
    },
    player: {
      name: '角色名称',
      nameDesc: '修改你在游戏中的称呼。',
      dataManage: '数据管理',
      export: '导出存档码',
      exportDesc: '将当前存档编码为一串文本，可跨设备转移。',
      exportBtn: '生成码',
      import: '导入存档码',
      importDesc: '粘贴存档码以覆盖当前数据。',
      importWarning: '警告：将清除当前进度！',
      importPlaceholder: '在此粘贴存档码...',
      importBtn: '确认导入',
    },
    saves: {
      free: '空闲',
      copyCode: '复制存档码',
      resetAll: '重置全部数据',
      resetAllDesc: '清空所有存档和设置，将游戏恢复到初始状态。此操作不可撤销！',
      resetBtn: '一键核平',
    },
  },

  // 主题名称
  themes: {
    default: '暗金',
    forest: '翠绿',
    magic: '暗紫',
  },
}
