// ==================== 桌面存档存储实现 ====================
import type { SaveStorage, SaveData, SlotMeta } from '@/engine/services/SaveStorage'
import type { FileSystemProvider } from './FileSystemProvider'
import type { SaveCodec } from './SaveCodec'

const INDEX_FILE = 'index.json'
const SLOT_PREFIX = 'slot_'

export class DesktopSaveStorage implements SaveStorage {
  constructor(
    private fs: FileSystemProvider,
    private codec: SaveCodec,
    private baseDir: string,
  ) {}

  private savesDir(): string { return `${this.baseDir}/saves` }
  private backupsDir(): string { return `${this.baseDir}/backups` }
  private slotFile(id: number): string { return `${this.savesDir()}/${SLOT_PREFIX}${id}.json` }

  async getIndex(): Promise<SlotMeta[]> {
    const raw = await this.fs.read(`${this.savesDir()}/${INDEX_FILE}`)
    return raw ? JSON.parse(raw) : []
  }

  async loadSlot(slotId: number): Promise<SaveData | null> {
    const raw = await this.fs.read(this.slotFile(slotId))
    if (!raw) return null
    return this.codec.decode(raw)
  }

  async saveSlot(slotId: number, data: SaveData): Promise<boolean> {
    try {
      const encoded = this.codec.encode(data)
      await this.fs.write(this.slotFile(slotId), encoded)
      await this._updateIndex(slotId, data)
      return true
    } catch { return false }
  }

  async deleteSlot(slotId: number): Promise<boolean> {
    return this.fs.delete(this.slotFile(slotId))
  }

  async exportSlot(slotId: number): Promise<string> {
    const raw = await this.fs.read(this.slotFile(slotId))
    if (!raw) throw new Error('Slot not found')
    return raw
  }

  async importSlot(data: SaveData): Promise<number> {
    const index = await this.getIndex()
    const newId = index.length > 0 ? Math.max(...index.map(s => s.id)) + 1 : 0
    await this.saveSlot(newId, data)
    return newId
  }

  async listBackups(slotId: number): Promise<string[]> {
    const dir = `${this.backupsDir()}/${SLOT_PREFIX}${slotId}`
    return this.fs.list(dir)
  }

  async createBackup(slotId: number): Promise<boolean> {
    const src = this.slotFile(slotId)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const dst = `${this.backupsDir()}/${SLOT_PREFIX}${slotId}/${timestamp}.json`
    const raw = await this.fs.read(src)
    if (!raw) return false
    await this.fs.mkdir(`${this.backupsDir()}/${SLOT_PREFIX}${slotId}`)
    return this.fs.write(dst, raw)
  }

  private async _updateIndex(slotId: number, data: SaveData): Promise<void> {
    const index = await this.getIndex()
    const state = data.state as Record<string, unknown>
    const skills = (state?.skills ?? {}) as Record<string, { level: number }>
    const totalLevel = Object.values(skills).reduce((a, s) => a + s.level, 0)
    const existing = index.find(s => s.id === slotId)
    const meta: SlotMeta = { id: slotId, name: `勇士 ${slotId + 1}`, lastSave: Date.now(), totalLevel }
    if (existing) Object.assign(existing, meta)
    else index.push(meta)
    await this.fs.write(`${this.savesDir()}/${INDEX_FILE}`, JSON.stringify(index))
  }
}
