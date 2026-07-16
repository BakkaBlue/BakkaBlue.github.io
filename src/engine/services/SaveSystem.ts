// ==================== 多存档位系统 ====================
// - idleRealms_index: 存储所有槽位的元信息
// - idleRealms_slot_0 ~ idleRealms_slot_2: 各自独立存档
// - Base64+URI 编码防轻易篡改

import { gameState, createInitialState } from '../state/GameState'
import type { SaveData } from '../state/types'
import { SAVE_VERSION } from '@/data/formulas'
import { getLogger } from '@/infrastructure/logging/LogManager'

const INDEX_KEY = 'idleRealms_index'
const SLOT_PREFIX = 'idleRealms_slot_'

// ---- 槽位元信息 ----
export interface SlotMeta {
  id: number
  name: string
  lastSave: number
  totalLevel: number
}

// ---- 索引管理 ----
function getIndex(): SlotMeta[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
function saveIndex(index: SlotMeta[]) { localStorage.setItem(INDEX_KEY, JSON.stringify(index)) }

// ---- 编解码 ----
function encode(data: SaveData): string { return btoa(encodeURIComponent(JSON.stringify(data))) }
function decode(raw: string): SaveData | null {
  try { return JSON.parse(decodeURIComponent(atob(raw))) }
  catch { return null }
}

// ---- 槽位读写 ----
function slotKey(id: number) { return `${SLOT_PREFIX}${id}` }

export function saveSlot(slotId: number): boolean {
  try {
    gameState.lastSaveTime = Date.now()
    const data: SaveData = { version: SAVE_VERSION, timestamp: Date.now(), state: JSON.parse(JSON.stringify(gameState)) }
    localStorage.setItem(slotKey(slotId), encode(data))

    const totalLevel = Object.values(gameState.skills).reduce((a, s) => a + s.level, 0)
    const index = getIndex()
    const existing = index.find(s => s.id === slotId)
    const meta: SlotMeta = { id: slotId, name: `勇士 ${slotId + 1}`, lastSave: Date.now(), totalLevel }
    if (existing) Object.assign(existing, meta)
    else index.push(meta)
    saveIndex(index)
    return true
  } catch (e) { getLogger().error('system', 'Save failed', e as Error); return false }
}

export function loadSlot(slotId: number): boolean {
  try {
    const raw = localStorage.getItem(slotKey(slotId))
    if (!raw) { createNewSlot(slotId); return true }
    const data = decode(raw)
    if (!data) return false
    Object.assign(gameState, data.state)
    patchMissingFields()
    patchMissingFields()
    gameState.lastTickTime = Date.now()
    gameState.lastSaveTime = Date.now()
    return true
  } catch (e) { getLogger().error('system', 'Save load failed', e as Error); return false }
}

export function createNewSlot(slotId: number): void {
  const fresh = createInitialState()
  Object.assign(gameState, fresh)
  gameState.lastTickTime = Date.now()
  gameState.lastSaveTime = Date.now()
  saveSlot(slotId)
}

export function deleteSlot(slotId: number): void {
  localStorage.removeItem(slotKey(slotId))
  const index = getIndex().filter(s => s.id !== slotId)
  saveIndex(index)
}

export function getSlotIndex(): SlotMeta[] { return getIndex() }

// ---- 自动保存（当前槽位） ----
let currentSlot = -1
export function getCurrentSlot(): number { return currentSlot }
export function setCurrentSlot(id: number) { currentSlot = id }
export function autoSave(): void { if (currentSlot >= 0) saveSlot(currentSlot) }

// ---- 导入导出 ----
export function exportSlot(slotId: number): string {
  const raw = localStorage.getItem(slotKey(slotId))
  return raw ? btoa(raw) : ''
}
export function importSlot(slotId: number, base64: string): boolean {
  try {
    const inner = atob(base64)
    const data = decode(inner)
    if (!data) return false
    localStorage.setItem(slotKey(slotId), inner)
    return true
  } catch { return false }
}

// ---- 补全字段 / 版本迁移（内联） ----
function patchMissingFields(): void {
  const defaults = createInitialState()
  for (const key of Object.keys(defaults.skills)) {
    if (!(key in gameState.skills)) {
      ;(gameState.skills as Record<string, { level: number; xp: number }>)[key] = { level: 1, xp: 0 }
    }
  }
  if (!gameState.farming || !gameState.farming.plots) {
    (gameState as any).farming = defaults.farming
  } else {
    for (const cat of Object.keys(defaults.farming.plots)) {
      if (!gameState.farming.plots[cat]) gameState.farming.plots[cat] = []
    }
    if (!gameState.farming.plotCounters) gameState.farming.plotCounters = { ...defaults.farming.plotCounters }
    if (gameState.farming.activeSelectPlot === undefined) gameState.farming.activeSelectPlot = null
    if (Array.isArray(gameState.farming.plots)) gameState.farming = defaults.farming
  }
  if (!gameState.town || typeof gameState.town !== 'object' || Array.isArray(gameState.town) || typeof (gameState.town as any).farm === 'number') {
    gameState.town = defaults.town
  } else {
    if (!gameState.town.buildings) gameState.town.buildings = { ...defaults.town.buildings }
    if (!gameState.town.facilities) gameState.town.facilities = { ...defaults.town.facilities }
    if (!gameState.town.storage) gameState.town.storage = { ...defaults.town.storage }
    for (const key of Object.keys(defaults.town.buildings)) { if (!(key in gameState.town.buildings)) gameState.town.buildings[key] = 0 }
    for (const key of Object.keys(defaults.town.facilities)) { if (!(key in gameState.town.facilities)) gameState.town.facilities[key] = 0 }
  }
  if (!Array.isArray(gameState.buffs)) gameState.buffs = []
}

// migrate 函数保留用于未来版本迁移
// function migrate(data: SaveData): SaveData { return data }
