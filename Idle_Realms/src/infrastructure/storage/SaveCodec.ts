// ==================== 存档编解码 ====================
import type { SaveData } from '@/engine/services/SaveStorage'

export interface SaveCodec {
  encode(data: SaveData): string
  decode(raw: string): SaveData | null
}

/** 默认编码器：Base64 + URI encode（向后兼容现有存档格式） */
export class DefaultSaveCodec implements SaveCodec {
  encode(data: SaveData): string {
    return btoa(encodeURIComponent(JSON.stringify(data)))
  }
  decode(raw: string): SaveData | null {
    try { return JSON.parse(decodeURIComponent(atob(raw))) }
    catch { return null }
  }
}
