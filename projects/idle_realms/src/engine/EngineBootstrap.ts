// ==================== Engine 生命周期管理 ====================
import type { EngineDependencies } from './services/Dependencies'
import { setDependencies } from './services/Dependencies'
import { initConfig } from './services/ConfigManager'
import { loadSlot } from './services/SaveManager'
import { eventBus } from './events/EventBus'

let _initialized = false

export async function initEngine(deps: EngineDependencies): Promise<void> {
  if (_initialized) return

  setDependencies(deps)
  await initConfig()
  await loadSlot(0)

  _initialized = true
}

export async function shutdownEngine(): Promise<void> {
  eventBus.clear()
  _initialized = false
}
