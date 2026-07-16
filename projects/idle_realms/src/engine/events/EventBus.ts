import type { GameEventMap } from './EventTypes'

type Handler = (payload: unknown) => void

/**
 * Type-safe generic event bus.
 *
 * @example
 * ```ts
 * const bus = new EventBus<MyEventMap>()
 * bus.on('some:event', payload => { /* payload is typed *​/ })
 * bus.emit('some:event', { foo: 1 })
 * ```
 */
class EventBus<EventMap extends Record<string, any>> {
  private _handlers = new Map<string, Set<Handler>>()

  /**
   * Subscribe to an event. Returns a dispose function that removes the handler.
   *
   * @param event  Event name (must be a key of EventMap)
   * @param handler  Callback receiving the typed payload
   * @param _opts  Optional settings (priority accepted but not re-ordered in Phase B)
   */
  on<K extends keyof EventMap>(
    event: K,
    handler: (payload: EventMap[K]) => void,
    _opts?: { priority?: number },
  ): () => void {
    const key = event as string
    let handlers = this._handlers.get(key)
    if (!handlers) {
      handlers = new Set()
      this._handlers.set(key, handlers)
    }
    handlers.add(handler as Handler)
    return () => {
      handlers!.delete(handler as Handler)
    }
  }

  /**
   * Subscribe to an event for exactly one invocation.
   * The handler is automatically removed after the first call.
   */
  once<K extends keyof EventMap>(
    event: K,
    handler: (payload: EventMap[K]) => void,
  ): () => void {
    const wrapper: Handler = (payload: unknown) => {
      handler(payload as EventMap[K])
      this.off(event, wrapper as (payload: EventMap[K]) => void)
    }
    return this.on(event, wrapper as (payload: EventMap[K]) => void)
  }

  /**
   * Emit an event with its typed payload.
   *
   * For events whose payload type is `void` or `undefined`, the payload may be omitted:
   * ```ts
   * eventBus.emit('engine:started')
   * eventBus.emit('toast', { message: 'Hi', type: 'success' })
   * ```
   */
  emit<K extends keyof EventMap>(
    event: K,
    ...args: EventMap[K] extends void | undefined ? [] : [EventMap[K]]
  ): void {
    const key = event as string
    const handlers = this._handlers.get(key)
    if (handlers) {
      handlers.forEach(h => h(args[0]))
    }
  }

  /**
   * Unregister one or all handlers for an event.
   *
   * - `off(event)` — removes **all** handlers for the event
   * - `off(event, handler)` — removes only the specific handler
   */
  off<K extends keyof EventMap>(event: K, handler?: (payload: EventMap[K]) => void): void {
    const key = event as string
    if (handler) {
      this._handlers.get(key)?.delete(handler as Handler)
    } else {
      this._handlers.delete(key)
    }
  }

  /** Remove all event subscriptions. */
  clear(): void {
    this._handlers.clear()
  }
}

/** Singleton game-wide event bus, typed with the full GameEventMap. */
export const eventBus = new EventBus<GameEventMap>()
