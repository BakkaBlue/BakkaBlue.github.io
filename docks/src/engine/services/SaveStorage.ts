// ==================== 存档存储接口 ====================
export interface SlotMeta {
  id: number
  name: string
  lastSave: number
  totalLevel: number
}

export interface SaveData {
  version: number
  timestamp: number
  state: unknown
}

export interface SaveStorage {
  getIndex(): Promise<SlotMeta[]>
  loadSlot(slotId: number): Promise<SaveData | null>
  saveSlot(slotId: number, data: SaveData): Promise<boolean>
  deleteSlot(slotId: number): Promise<boolean>
  exportSlot(slotId: number): Promise<string>
  importSlot(data: SaveData): Promise<number>
  listBackups(slotId: number): Promise<string[]>
  createBackup(slotId: number): Promise<boolean>
}
