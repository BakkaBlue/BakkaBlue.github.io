// ==================== Log Manager: init + EventBus integration ====================
import type { LogChannel, LogLevel } from './Logger'
import { Logger } from './Logger'
import { TextFormatter, JsonFormatter } from './Formatter'
import { ConsoleSink, FileSink, MemorySink } from './Sink'
import type { FileSystemProvider } from '@/infrastructure/storage/FileSystemProvider'
import type { AppConfig } from '@/engine/services/ConfigStorage'
import { eventBus } from '@/engine/events/EventBus'

// ---- Module-level state ----

let _logger: Logger | null = null
let _memorySink: MemorySink | null = null
let _fileSink: FileSink | null = null
const disposers: (() => void)[] = []

// ---- Public accessors ----

/**
 * Returns the singleton Logger instance.
 * Throws if `initLogging()` has not been called yet.
 */
export function getLogger(): Logger {
  if (!_logger) {
    throw new Error('Logger not initialized. Call initLogging() first.')
  }
  return _logger
}

/**
 * Returns the MemorySink (ring buffer) for the in-game log panel.
 * Throws if `initLogging()` has not been called yet.
 */
export function getMemorySink(): MemorySink {
  if (!_memorySink) {
    throw new Error('MemorySink not initialized. Call initLogging() first.')
  }
  return _memorySink
}

// ---- Initialization ----

/**
 * Initialize the logging system.
 *
 * Creates ConsoleSink (JSON), FileSink (daily-rotated text), and
 * MemorySink (200-entry ring buffer).  Subscribes to key game events
 * for auto-logging and hot-reloads log levels on CONFIG_CHANGED.
 *
 * @param config       Current AppConfig (provides logLevel thresholds)
 * @param fs           FileSystemProvider for FileSink
 * @param appDataDir   Base application data directory
 * @returns The initialized Logger instance
 */
export function initLogging(
  config: AppConfig,
  fs: FileSystemProvider,
  appDataDir: string,
): Logger {
  // Guard against double init
  if (_logger) {
    _logger.warn('system', 'initLogging called more than once — reconfiguring')
    disposers.forEach(d => d())
    disposers.length = 0
  }

  const logLevels = config.logLevel as Record<LogChannel, LogLevel>
  const logger = new Logger(logLevels)

  // Console sink — structured JSON for dev tools
  logger.addSink(new ConsoleSink(new JsonFormatter()))

  // File sink — human-readable text, daily rotation
  _fileSink = new FileSink(fs, appDataDir, new TextFormatter())
  logger.addSink(_fileSink)

  // Memory sink — ring buffer for in-game log panel
  _memorySink = new MemorySink(200)
  logger.addSink(_memorySink)

  // ---- Auto-log subscribed events ----

  disposers.push(
    eventBus.on('skill:levelup', (p) => {
      logger.info('engine', `Skill leveled up: ${p.skillId} -> ${p.newLevel}`, {
        skillId: p.skillId,
        newLevel: p.newLevel,
      })
    }),
  )

  disposers.push(
    eventBus.on('combat:victory', (p) => {
      logger.info('engine', `Combat victory against ${p.enemyName}`, {
        enemyId: p.enemyId,
        enemyName: p.enemyName,
        gold: p.gold,
        xp: p.xp,
      })
    }),
  )

  disposers.push(
    eventBus.on('system:engine-init', () => {
      logger.info('system', 'Engine initialized')
    }),
  )

  disposers.push(
    eventBus.on('system:save-loaded', () => {
      logger.info('system', 'Save game loaded')
    }),
  )

  // Hot-reload log levels on CONFIG_CHANGED
  disposers.push(
    eventBus.on('system:config-changed', (p) => {
      const changed = p.keys
      if (changed.some(k => k === 'logLevel' || k.startsWith('logLevel.'))) {
        const levels = (p.current as AppConfig).logLevel as Record<LogChannel, LogLevel>
        for (const [channel, level] of Object.entries(levels)) {
          logger.setLevel(channel as LogChannel, level as LogLevel)
        }
        logger.info('system', 'Log levels updated from config change', { changedKeys: changed })
      }
    }),
  )

  _logger = logger
  return logger
}

/**
 * Tear down the logging system: unsubscribes from EventBus
 * and flushes pending file writes.
 */
export async function destroyLogging(): Promise<void> {
  disposers.forEach(d => d())
  disposers.length = 0
  if (_logger) {
    await _logger.flushAll()
  }
  _fileSink = null
  _memorySink = null
  _logger = null
}
