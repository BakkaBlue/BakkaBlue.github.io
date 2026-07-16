export const enum SkillEvent {
  STARTED   = 'skill:started',
  STOPPED   = 'skill:stopped',
  COMPLETED = 'skill:completed',
  LEVEL_UP  = 'skill:levelup',
}

export const enum CombatEvent {
  STARTED = 'combat:started',
  VICTORY = 'combat:victory',
  DEFEAT  = 'combat:defeat',
  FLED    = 'combat:fled',
}

export const enum ItemEvent {
  ACQUIRED = 'item:acquired',
  CONSUMED = 'item:consumed',
}

export const enum ActionEvent {
  STARTED = 'action:started',
  STOPPED = 'action:stopped',
}

export const enum FoodEvent {
  EATEN = 'food:eaten',
}

export const enum SlayerEvent {
  TASK_COMPLETED = 'slayer:task-completed',
}

export const enum ToastEvent {
  SHOW = 'toast',
}

export const enum SystemEvent {
  CONFIG_LOADED   = 'system:config-loaded',
  CONFIG_CHANGED  = 'system:config-changed',
  ENGINE_INIT     = 'system:engine-init',
  SAVE_LOADED     = 'system:save-loaded',
  ASSET_RELOADED  = 'system:asset-reloaded',
  NOTIFICATION    = 'system:notification',
}

/**
 * Maps every game event name to its strongly-typed payload.
 * Used as the type parameter for {@link EventBus}.
 *
 * When adding a new event, add its name and payload type here
 * so that `emit` / `on` / `once` are fully type-checked.
 */
export interface GameEventMap {
  // ---- UI / Toast ----
  /** Display a toast notification */
  'toast': { message: string; type: string }

  // ---- Combat ----
  /** Combat started against an enemy */
  'combat:started': { enemyId: string; enemyName: string }
  /** A hit landed during combat (one event per hit) */
  'combat:hit': { target: 'enemy' | 'player'; damage: number }
  /** Combat victory with rewards */
  'combat:victory': { enemyId: string; enemyName: string; gold: number; xp: number }
  /** Player was defeated */
  'combat:defeat': { enemyId: string; enemyName: string }
  /** Player fled from combat */
  'combat:fled': { enemyName: string }

  // ---- Inventory / Items ----
  /** An item was added to the inventory */
  'item:acquired': { itemId: string; qty: number; source: string }
  /** An item was consumed/removed */
  'item:consumed': { itemId: string; qty: number }

  // ---- Skills / Actions ----
  /** A skill action started */
  'action:started': { skillId: string; actionId: string }
  /** A skill action stopped (by completion, cancellation, or exhaustion) */
  'action:stopped': void
  /** A skill leveled up */
  'skill:levelup': { skillId: string; newLevel: number }
  /** A skill activity started (reserved) */
  'skill:started': void
  /** A skill activity stopped (reserved) */
  'skill:stopped': void
  /** A skill action fully completed (reserved) */
  'skill:completed': void

  // ---- Food ----
  /** A food item was eaten */
  'food:eaten': { foodId: string; healAmount: number }

  // ---- Slayer ----
  /** A slayer task was completed with rewards */
  'slayer:task-completed': { enemyName: string; kills: number; xp: number; points: number; gold: number }
  /** A new slayer task was accepted */
  'slayer:task-accepted': { enemyName?: string; requiredKills: number; masterName: string }
  /** The current slayer task was abandoned (no rewards) */
  'slayer:task-abandoned': void
  /** A permanent slayer reward was purchased */
  'slayer:reward-purchased': { rewardName: string }

  // ---- Farming ----
  /** A new farming plot was purchased */
  'farming:plot-bought': { cat: string; name: string }
  /** A farming plot was upgraded */
  'farming:plot-upgraded': { plotId: string; newLevel: number }

  // ---- Town ----
  /** A town building was upgraded */
  'town:upgraded': { buildingId: string; buildingName: string; newLevel: number }
  /** A town facility was upgraded */
  'town:facility-upgraded': { facilityId: string; name: string; newLevel: number }

  // ---- Offline ----
  /** Offline progress was calculated (engine internal) */
  'offline:calculated': {
    elapsedMs: number
    elapsedFormatted: string
    skillResults: Array<{
      skillId: string
      actionName: string
      cycles: number
      items: Record<string, number>
      totalXp: number
    }>
    combatResult: {
      enemyName: string
      battles: number
      wins: number
      totalGold: number
      totalXp: number
      items: Record<string, number>
    } | null
    levelUps: Array<{ skillId: string; newLevel: number }>
  }
  /** Offline report to show to the player */
  'offline:show': {
    elapsedMs: number
    elapsedFormatted: string
    skillResults: Array<{
      skillId: string
      actionName: string
      cycles: number
      items: Record<string, number>
      totalXp: number
    }>
    combatResult: {
      enemyName: string
      battles: number
      wins: number
      totalGold: number
      totalXp: number
      items: Record<string, number>
    } | null
    levelUps: Array<{ skillId: string; newLevel: number }>
  }

  // ---- Engine lifecycle ----
  /** Periodic auto-save has completed */
  'save:completed': void
  /** Game engine main loop has started */
  'engine:started': void
  /** Game engine main loop has stopped */
  'engine:stopped': void

  // ---- System / Config ----
  /** Game configuration was loaded from storage */
  'system:config-loaded': { config: object }
  /** Game configuration was changed at runtime */
  'system:config-changed': {
    keys: string[]
    previous: object
    current: object
  }
  /** Engine has been fully initialized (save + config loaded) */
  'system:engine-init': void
  /** A save slot was loaded */
  'system:save-loaded': void
  /** Game assets were reloaded */
  'system:asset-reloaded': void
  /** General-purpose system notification */
  'system:notification': { message: string; type?: string }
}
