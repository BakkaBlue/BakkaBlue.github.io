// ==================== 农务系统 ====================

import { gameState } from '../state/GameState'
import { eventBus } from '@/engine/events/EventBus'
import { PLOT_TYPES, FARM_CROPS, type PlotCategory } from '@/data/farming'
import { addItem } from './InventorySystem'
import { addXp } from './ExperienceSystem'
import type { FarmPlot } from '../state/types'
import i18n from '@/shared/i18n'
const { t } = i18n.global

// ==================== 地块购买/升级 ====================

export function getBuyPlotCost(cat: PlotCategory): number {
  const config = PLOT_TYPES[cat]
  const count = gameState.farming.plots[cat].length
  return Math.floor(config.baseBuyCost * Math.pow(config.buyCostMultiplier, count))
}

export function getUpgradePlotCost(cat: PlotCategory, level: number): number {
  const config = PLOT_TYPES[cat]
  return Math.floor(config.upgradeBaseCost * Math.pow(config.upgradeCostMultiplier, level - 1))
}

export function getPlotSpeedMult(level: number): number {
  return 1 + (level - 1) * 0.15
}

export function buyPlot(cat: PlotCategory): boolean {
  const config = PLOT_TYPES[cat]
  const plots = gameState.farming.plots[cat]
  if (plots.length >= config.maxPlots) {
    eventBus.emit('toast', { message: t('toasts.plotMax', { name: t(`farming.plots.${cat}`) }), type: 'danger' })
    return false
  }
  const cost = getBuyPlotCost(cat)
  if (gameState.gold < cost) {
    eventBus.emit('toast', { message: t('toasts.goldInsufficient'), type: 'danger' })
    return false
  }
  gameState.gold -= cost
  const newId = `${cat}_${gameState.farming.plotCounters[cat]++}`
  plots.push({ id: newId, level: 1, cropId: null, progress: 0 })
  eventBus.emit('farming:plot-bought', { cat, name: config.name })
  return true
}

export function upgradePlot(plotId: string): boolean {
  const { plot, cat } = findPlot(plotId)
  if (!plot || !cat) return false
  const cost = getUpgradePlotCost(cat as PlotCategory, plot.level)
  if (gameState.gold < cost) {
    eventBus.emit('toast', { message: t('toasts.goldInsufficient'), type: 'danger' })
    return false
  }
  gameState.gold -= cost
  plot.level++
  eventBus.emit('farming:plot-upgraded', { plotId, newLevel: plot.level })
  return true
}

// ==================== 种植/拔除 ====================

export function assignCrop(plotId: string, cropId: string): boolean {
  const { plot } = findPlot(plotId)
  if (!plot) return false
  const crop = FARM_CROPS[cropId]
  if (!crop) return false
  if (gameState.skills.farming.level < crop.levelReq) {
    eventBus.emit('toast', { message: t('toasts.needFarmingLevel', { level: crop.levelReq }), type: 'danger' })
    return false
  }
  plot.cropId = cropId
  plot.progress = 0
  gameState.farming.activeSelectPlot = null
  return true
}

export function unassignCrop(plotId: string): boolean {
  const { plot } = findPlot(plotId)
  if (!plot) return false
  plot.cropId = null
  plot.progress = 0
  return true
}

// ==================== 选择面板 ====================

export function toggleCropSelection(plotId: string | null): void {
  gameState.farming.activeSelectPlot = plotId
}

// ==================== 主循环 tick ====================

/** 每帧更新所有地块生长进度（由 GameEngine 调用） */
export function tickFarming(dt: number): void {
  for (const cat of Object.keys(PLOT_TYPES) as PlotCategory[]) {
    for (const plot of gameState.farming.plots[cat]) {
      if (!plot.cropId) continue
      const crop = FARM_CROPS[plot.cropId]
      if (!crop) continue
      const speedMult = getPlotSpeedMult(plot.level)
      const actualTime = crop.growTime / speedMult

      plot.progress += dt
      if (plot.progress >= actualTime) {
        plot.progress = 0
        // 收获
        addXp('farming', crop.xp)
        for (const [itemId, qty] of Object.entries(crop.drops)) {
          addItem(itemId, qty)
        }
        // 自动循环种植（不枯萎）
      }
    }
  }
}

// ==================== 工具 ====================

function findPlot(plotId: string): { plot: FarmPlot | null; cat: string | null } {
  for (const cat of Object.keys(PLOT_TYPES) as PlotCategory[]) {
    const plot = gameState.farming.plots[cat].find(p => p.id === plotId)
    if (plot) return { plot, cat }
  }
  return { plot: null, cat: null }
}
