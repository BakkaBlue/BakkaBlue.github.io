// ==================== 桌面配置存储实现 ====================
import type { ConfigStorage, AppConfig } from '@/engine/services/ConfigStorage'
import type { FileSystemProvider } from './FileSystemProvider'

const DEFAULT_CONFIG: AppConfig = {
  version: 1,
  language: 'zh-CN',
  theme: 'default',
  fontSize: 'medium',
  autoSaveInterval: 60,
  reduceMotion: false,
  showRightPanel: true,
  playerName: '玩家',
  fps: 0,
  autoUpdateCheck: true,
  windowState: { width: 1280, height: 800, x: 0, y: 0, maximized: false },
  logLevel: { engine: 'info', ui: 'info', native: 'info', system: 'warn' },
}

export class DesktopConfigStorage implements ConfigStorage {
  constructor(
    private fs: FileSystemProvider,
    private baseDir: string,
  ) {}

  private configFile(): string {
    return `${this.baseDir}/config/settings.json`
  }

  async load(): Promise<AppConfig> {
    const raw = await this.fs.read(this.configFile())
    if (!raw) return { ...DEFAULT_CONFIG }
    try {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_CONFIG, ...parsed }
    } catch {
      return { ...DEFAULT_CONFIG }
    }
  }

  async save(config: AppConfig): Promise<boolean> {
    return this.fs.write(this.configFile(), JSON.stringify(config, null, 2))
  }
}
