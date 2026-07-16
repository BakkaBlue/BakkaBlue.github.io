// ==================== Log Sinks ====================
import type { LogEntry } from './Logger'
import type { LogFormatter, LogLevel, LogChannel } from './Formatter'
import type { FileSystemProvider } from '@/infrastructure/storage/FileSystemProvider'
export type { LogEntry, LogFormatter, LogLevel, LogChannel }

/** A sink consumes formatted LogEntry objects. */
export interface LogSink {
  write(entry: LogEntry): void
  flush?(): Promise<void>
}

// ---- Console Sink ----

/**
 * Writes log entries to the JavaScript console using the
 * appropriate console method for each level.
 */
export class ConsoleSink implements LogSink {
  constructor(private formatter: LogFormatter) {}

  write(entry: LogEntry): void {
    const formatted = this.formatter.format(entry)
    switch (entry.level) {
      case 'debug':
        console.debug(formatted)
        break
      case 'info':
        console.info(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      case 'error':
      case 'fatal':
        console.error(formatted)
        break
    }
  }
}

// ---- File Sink (daily rotation) ----

/**
 * Writes log entries to a daily-rotated file: {appDataDir}/logs/YYYY-MM-DD.log
 * Entries are buffered and flushed periodically to reduce disk I/O.
 */
export class FileSink implements LogSink {
  private currentDate: string
  private buffer: string[] = []
  private flushTimer: ReturnType<typeof setInterval> | null = null

  constructor(
    private fs: FileSystemProvider,
    private appDataDir: string,
    private formatter: LogFormatter,
    flushIntervalMs: number = 5000,
  ) {
    this.currentDate = this.getDateStr()
    this.flushTimer = setInterval(() => {
      this.flushBuffer().catch(() => { /* flush errors logged inside */ })
    }, flushIntervalMs)
  }

  private getDateStr(): string {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  private logFilePath(): string {
    return `${this.appDataDir}/logs/${this.currentDate}.log`
  }

  write(entry: LogEntry): void {
    const dateStr = this.getDateStr()
    if (dateStr !== this.currentDate) {
      // Date boundary crossed — flush the old file then start new day
      this.flushBufferSync()
      this.currentDate = dateStr
    }
    this.buffer.push(this.formatter.format(entry))
  }

  private async flushBuffer(): Promise<void> {
    if (this.buffer.length === 0) return
    const lines = this.buffer.splice(0)
    try {
      const path = this.logFilePath()
      let existing = await this.fs.read(path) ?? ''
      if (existing !== '' && !existing.endsWith('\n')) {
        existing += '\n'
      }
      await this.fs.write(path, existing + lines.join('\n') + '\n')
    } catch (e) {
      console.error('[FileSink] Failed to flush log buffer:', e)
    }
  }

  private flushBufferSync(): void {
    // Fire-and-forget the async flush
    this.flushBuffer().catch(() => {})
  }

  async flush(): Promise<void> {
    if (this.flushTimer !== null) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
    await this.flushBuffer()
  }
}

// ---- Memory Sink (ring buffer) ----

/**
 * In-memory ring buffer that keeps the last N entries.
 * Useful for an in-game log panel.
 */
export class MemorySink implements LogSink {
  private buffer: LogEntry[] = []
  private readonly maxSize: number

  constructor(maxSize: number = 200) {
    this.maxSize = maxSize
  }

  write(entry: LogEntry): void {
    this.buffer.push(entry)
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift()
    }
  }

  /** Returns a read-only snapshot of stored entries (newest last). */
  getEntries(): ReadonlyArray<LogEntry> {
    return this.buffer
  }

  /** Clear all stored entries. */
  clear(): void {
    this.buffer = []
  }
}
