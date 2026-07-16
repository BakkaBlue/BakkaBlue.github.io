// ==================== Log Formatters ====================
import type { LogEntry, LogLevel, LogChannel } from './Logger'

export type { LogEntry, LogLevel, LogChannel }

export interface LogFormatter {
  format(entry: LogEntry): string
}

/**
 * Human-readable text formatter.
 * Output: `[2026-07-12T10:30:00.000Z] [INFO ] [engine] Message text`
 */
export class TextFormatter implements LogFormatter {
  format(entry: LogEntry): string {
    const time = new Date(entry.timestamp).toISOString()
    const level = entry.level.toUpperCase().padEnd(5)
    let line = `[${time}] [${level}] [${entry.channel}] ${entry.message}`
    if (entry.context) {
      line += `\n  Context: ${JSON.stringify(entry.context)}`
    }
    if (entry.error) {
      line += `\n  Error: ${entry.error.message}\n  Stack: ${entry.error.stack ?? '(no stack)'}`
    }
    return line
  }
}

/**
 * Structured JSON formatter, one object per line.
 * Compatible with log aggregation tools.
 */
export class JsonFormatter implements LogFormatter {
  format(entry: LogEntry): string {
    const obj: Record<string, unknown> = {
      timestamp: new Date(entry.timestamp).toISOString(),
      level: entry.level,
      channel: entry.channel,
      message: entry.message,
    }
    if (entry.context) {
      obj.context = entry.context
    }
    if (entry.error) {
      obj.error = {
        name: entry.error.name,
        message: entry.error.message,
        stack: entry.error.stack,
      }
    }
    return JSON.stringify(obj)
  }
}
