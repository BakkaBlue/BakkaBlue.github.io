// ==================== 配置管理 ====================
import { getDependencies } from './Dependencies'
import { eventBus } from '../events/EventBus'
import { SystemEvent } from '../events/EventTypes'
import { getDefaultConfig, validateConfig } from './ConfigSchema'
import { migrateConfig } from './ConfigMigration'
import type { AppConfig } from './ConfigStorage'

let _config: AppConfig = null!

export async function initConfig(): Promise<AppConfig> {
  const { configStorage } = getDependencies()
  const raw = await configStorage.load()
  const migrated = migrateConfig(raw as unknown as Record<string, unknown>)
  const defaults = getDefaultConfig()
  _config = { ...defaults, ...migrated } as unknown as AppConfig
  eventBus.emit(SystemEvent.CONFIG_LOADED, { config: _config })
  return _config
}

export function getConfig(): AppConfig {
  if (!_config) throw new Error('Config not loaded')
  return _config
}

export function getConfigValue<K extends keyof AppConfig>(key: K): AppConfig[K] {
  return getConfig()[key]
}

export async function updateConfig(updater: (c: AppConfig) => void): Promise<boolean> {
  const snapshot = structuralClone(_config)
  updater(_config)
  const errors = validateConfig(_config as unknown as Record<string, unknown>)
  if (errors.length > 0) {
    _config = snapshot
    throw new Error(`Config validation failed: ${errors.join('; ')}`)
  }
  const { configStorage } = getDependencies()
  const ok = await configStorage.save(_config)
  if (ok) {
    const changedKeys = getChangedKeys(snapshot, _config)
    eventBus.emit(SystemEvent.CONFIG_CHANGED, {
      keys: changedKeys,
      previous: pickKeys(snapshot, changedKeys) as Partial<AppConfig>,
      current: pickKeys(_config, changedKeys) as Partial<AppConfig>,
    })
  }
  return ok
}

function structuralClone<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)) }
function getChangedKeys(prev: AppConfig, curr: AppConfig): string[] {
  return Object.keys(curr).filter(k => JSON.stringify((prev as any)[k]) !== JSON.stringify((curr as any)[k]))
}
function pickKeys(obj: AppConfig, keys: string[]): Record<string, unknown> {
  return keys.reduce((acc, k) => { (acc as any)[k] = (obj as any)[k]; return acc }, {} as Record<string, unknown>)
}
