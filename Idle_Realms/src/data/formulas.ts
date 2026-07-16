// ==================== 公式常量 ====================

/** 经验公式：基础值 */
export const XP_BASE = 80

/** 经验公式：指数（v1 = 1.6, v2 调整至 2.5） */
export const XP_EXPONENT = 1.6

/** 每级 HP 增长 */
export const HP_PER_LEVEL = 2

/** 基础 HP */
export const HP_BASE = 10

/** 每 4 级攻击力加成（取整） */
export const ATK_PER_LEVEL = 0.25

/** 基础攻击力 */
export const ATK_BASE = 1

/** 每 4 级防御力加成（取整） */
export const DEF_PER_LEVEL = 0.25

/** 基础暴击率（5%） */
export const BASE_CRIT_CHANCE = 0.05

/** 暴击伤害倍率 */
export const CRIT_MULTIPLIER = 1.5

/** 基础命中率（90%） */
export const BASE_HIT_CHANCE = 0.90

/** 战斗回合间隔（毫秒） */
export const COMBAT_TURN_MS = 1200

/** 非战斗时每 tick 回血概率 */
export const REGEN_CHANCE_PER_TICK = 0.05

/** 非战斗时每 tick 回血量 */
export const REGEN_AMOUNT = 1

/** 免费用户最大离线时长（小时） */
export const MAX_OFFLINE_HOURS_FREE = 8

/** VIP 用户最大离线时长（Infinity = 无限） */
export const MAX_OFFLINE_HOURS_VIP = Infinity

/** 离线战斗最大模拟场次 */
export const MAX_OFFLINE_COMBATS = 50

/** 自动保存间隔（毫秒） */
export const AUTO_SAVE_INTERVAL_MS = 60_000

/** 游戏循环 tick 间隔（毫秒） */
export const TICK_INTERVAL_MS = 100

/** 当前存档版本号 */
export const SAVE_VERSION = 1
