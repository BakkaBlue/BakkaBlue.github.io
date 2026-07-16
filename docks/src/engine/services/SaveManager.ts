// ==================== 存档管理 ====================
// 从 core/SaveSystem.ts 重构，使用注入的 SaveStorage
import { getGameState, replaceState, createInitialState } from '../state/GameState'
import { getDependencies } from './Dependencies'
import type { SaveData } from './SaveStorage'

export async function saveSlot(slotId: number): Promise<boolean> {
  const { saveStorage } = getDependencies()
  const state = getGameState()
  const data: SaveData = {
    version: state.version,
    timestamp: Date.now(),
    state: JSON.parse(JSON.stringify(state)),
  }
  return saveStorage.saveSlot(slotId, data)
}

export async function loadSlot(slotId: number): Promise<boolean> {
  const { saveStorage } = getDependencies()
  const data = await saveStorage.loadSlot(slotId)
  if (!data) {
    replaceState(createInitialState())
    return true
  }
  replaceState(data.state as Parameters<typeof replaceState>[0])
  return true
}

export async function createNewSlot(slotId: number): Promise<boolean> {
  return saveSlot(slotId)
}

export async function autoSave(): Promise<boolean> {
  return saveSlot(0)
}

export async function exportSave(slotId: number): Promise<string> {
  const { saveStorage } = getDependencies()
  return saveStorage.exportSlot(slotId)
}

export async function importSave(data: SaveData): Promise<number> {
  const { saveStorage } = getDependencies()
  return saveStorage.importSlot(data)
}
