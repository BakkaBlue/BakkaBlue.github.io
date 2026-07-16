// ==================== Logging Types & Core Logger ====================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'
export type LogChannel = 'engine' | 'ui' | 'native' | 'system'

export interface LogEntry {
  timestamp: number
  level: LogLevel
  channel: LogChannel
  message: string
  context?: Record<string, unknown>
  error?: Error
}

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
}

/**
 * Core logger that dispatches LogEntries to registered sinks.
 * Checks level threshold per channel before forwarding.
 */
export class Logger {
  private sinks: { write(entry: LogEntry): void; flush?(): Promise<void> }[] = []
  private levelThresholds: Record<LogChannel, LogLevel>

  constructor(thresholds: Record<LogChannel, LogLevel>) {
    this.levelThresholds = { ...thresholds }
  }

  /** Register a sink — receives every entry that passes the level filter. */
  addSink(sink: { write(entry: LogEntry): void; flush?(): Promise<void> }): void {
    this.sinks.push(sink)
  }

  /** Update the minimum level for a channel at runtime. */
  setLevel(channel: LogChannel, level: LogLevel): void {
    this.levelThresholds[channel] = level
  }

  /** Get a snapshot of current thresholds. */
  getLevels(): Readonly<Record<LogChannel, LogLevel>> {
    return { ...this.levelThresholds }
  }

  private shouldLog(channel: LogChannel, level: LogLevel): boolean {
    return LEVEL_ORDER[level] >= LEVEL_ORDER[this.levelThresholds[channel]]
  }

  private write(level: LogLevel, channel: LogChannel, message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(channel, level)) return
    const entry: LogEntry = { timestamp: Date.now(), level, channel, message, context, error }
    for (const sink of this.sinks) {
      sink.write(entry)
    }
  }

  debug(channel: LogChannel, message: string, context?: Record<string, unknown>): void {
    this.write('debug', channel, message, context)
  }

  info(channel: LogChannel, message: string, context?: Record<string, unknown>): void {
    this.write('info', channel, message, context)
  }

  warn(channel: LogChannel, message: string, context?: Record<string, unknown>): void {
    this.write('warn', channel, message, context)
  }

  error(channel: LogChannel, message: string, error?: Error, context?: Record<string, unknown>): void {
    this.write('error', channel, message, context, error)
  }

  fatal(channel: LogChannel, message: string, error?: Error, context?: Record<string, unknown>): void {
    this.write('fatal', channel, message, context, error)
  }

  /** Flush all sinks that support it (e.g. FileSink). */
  async flushAll(): Promise<void> {
    for (const sink of this.sinks) {
      if (sink.flush) {
        await sink.flush()
      }
    }
  }
}
