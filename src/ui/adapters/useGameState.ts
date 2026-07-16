// ==================== Engine State → Vue Reactive 桥接 ====================
import { reactive } from 'vue'
import { getGameState, subscribeToState } from '@/engine'
import type { GameStateData } from '@/engine'

let _reactiveState: GameStateData | null = null
let _unsubscribe: (() => void) | null = null

export function useGameState(): GameStateData {
  if (!_reactiveState) {
    _reactiveState = reactive({}) as GameStateData
    Object.assign(_reactiveState, getGameState())
    _unsubscribe = subscribeToState(() => {
      Object.assign(_reactiveState!, getGameState())
    })
  }
  return _reactiveState
}

export function disposeGameState(): void {
  _unsubscribe?.()
  _reactiveState = null
}
