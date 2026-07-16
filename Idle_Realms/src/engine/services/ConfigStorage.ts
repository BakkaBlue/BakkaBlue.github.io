// ==================== 配置存储接口 ====================
export interface AppConfig {
  version: number                         // 配置版本号
  language: string
  theme: string
  fontSize: string
  autoSaveInterval: number
  reduceMotion: boolean
  showRightPanel: boolean
  playerName: string
  fps: number                             // 0=unlimited
  autoUpdateCheck: boolean
  windowState: { width: number; height: number; x: number; y: number; maximized: boolean }
  logLevel: Record<string, string>        // channel -> level
}

export interface ConfigStorage {
  load(): Promise<AppConfig>
  save(config: AppConfig): Promise<boolean>
}
