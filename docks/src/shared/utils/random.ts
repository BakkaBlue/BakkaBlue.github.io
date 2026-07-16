// ==================== 随机数工具 ====================

/** 生成 [min, max] 范围内的随机整数 */
export function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

/** 概率检测（0-1），返回是否命中 */
export function rollChance(chance: number): boolean {
  return Math.random() < chance
}

/** 加权随机选择 */
export function weightedRandom<T>(items: T[], weights: number[]): T | null {
  if (items.length === 0 || items.length !== weights.length) return null

  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  let r = Math.random() * totalWeight

  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }

  return items[items.length - 1]
}
