// ==================== Engine 依赖注入 ====================
import type { SaveStorage } from './SaveStorage'
import type { ConfigStorage } from './ConfigStorage'

export interface EngineDependencies {
  saveStorage: SaveStorage
  configStorage: ConfigStorage
}

let _deps: EngineDependencies | null = null

export function setDependencies(deps: EngineDependencies): void {
  _deps = deps
}

export function getDependencies(): EngineDependencies {
  if (!_deps) throw new Error('Engine dependencies not initialized. Call setDependencies() first.')
  return _deps
}
