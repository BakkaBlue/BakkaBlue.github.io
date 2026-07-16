// ==================== Engine 公共 API ====================
// UI 层唯一允许接触的 Engine 接口

// -- 生命周期
export { initEngine, shutdownEngine } from './EngineBootstrap'

// -- 状态（只读 + 订阅）
export { getGameState, subscribeToState, mutateState, resetState, replaceState } from './state/GameState'

// -- 事件
export { eventBus } from './events/EventBus'

// -- 命令（从 core/ 再导出，逐步迁移到 engine/systems/）
export { startAction, stopAction } from '@/engine/systems/SkillSystem'
export { startBattle, fleeBattle } from '@/engine/systems/CombatSystem'
export { addItem, removeItem, hasItem } from '@/engine/systems/InventorySystem'
export { equipItem, unequipSlot } from '@/engine/systems/EquipmentSystem'
export { addXp } from '@/engine/systems/ExperienceSystem'
export { acceptTask, skipTask, abandonTask } from '@/engine/systems/SlayerSystem'

// -- 存档/配置
export { saveSlot, loadSlot, createNewSlot, autoSave, exportSave, importSave } from './services/SaveManager'
export { initConfig, getConfig, getConfigValue, updateConfig } from './services/ConfigManager'

// -- 将旧的 gameState 重新导出（过渡期兼容）
export { gameState } from '@/engine/state/GameState'

// -- 类型
export type { GameStateData, SkillState, CurrentAction } from './state/types'
export type { SkillId } from '@/data/skills'
