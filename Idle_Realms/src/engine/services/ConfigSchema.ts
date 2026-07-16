// ==================== 配置模式校验 ====================
import type { AppConfig } from './ConfigStorage'

export interface SchemaField {
  type: 'string' | 'number' | 'boolean' | 'object'
  default: unknown
  enum?: unknown[]
  min?: number; max?: number
  maxLength?: number
  validator?: (value: unknown) => string | null
}

export const CONFIG_SCHEMA: Record<string, SchemaField> = {
  version:         { type: 'number',  default: 1 },
  language:        { type: 'string',  default: 'zh-CN',    enum: ['zh-CN', 'en-US'] },
  theme:           { type: 'string',  default: 'default',   enum: ['default', 'forest', 'magic'] },
  fontSize:        { type: 'string',  default: 'medium',    enum: ['small', 'medium', 'large'] },
  autoSaveInterval:{ type: 'number',  default: 60,          min: 10, max: 3600 },
  reduceMotion:    { type: 'boolean', default: false },
  showRightPanel:  { type: 'boolean', default: true },
  playerName:      { type: 'string',  default: '玩家',      maxLength: 20 },
  fps:             { type: 'number',  default: 0,           enum: [0, 30, 60, 120] },
  autoUpdateCheck: { type: 'boolean', default: true },
  windowState:     { type: 'object',  default: { width: 1280, height: 800, x: 0, y: 0, maximized: false } },
  logLevel:        { type: 'object',  default: { engine: 'info', ui: 'info', native: 'info', system: 'warn' } },
}

export function getDefaultConfig(): AppConfig {
  const defaults: Record<string, unknown> = {}
  for (const [key, field] of Object.entries(CONFIG_SCHEMA)) {
    defaults[key] = field.default
  }
  return defaults as unknown as AppConfig
}

export function validateConfig(config: Record<string, unknown>): string[] {
  const errors: string[] = []
  for (const [key, field] of Object.entries(CONFIG_SCHEMA)) {
    const value = config[key]
    if (value === undefined) continue  // skip, default will fill
    if (field.type === 'string' && field.enum && !field.enum.includes(value)) {
      errors.push(`${key}: must be one of ${field.enum.join(', ')}, got "${value}"`)
    }
    if (field.type === 'number' && field.enum && !field.enum.includes(value)) {
      errors.push(`${key}: must be one of ${field.enum.join(', ')}, got ${value}`)
    }
    if (field.min !== undefined && typeof value === 'number' && value < field.min) {
      errors.push(`${key}: minimum ${field.min}, got ${value}`)
    }
    if (field.max !== undefined && typeof value === 'number' && value > field.max) {
      errors.push(`${key}: maximum ${field.max}, got ${value}`)
    }
    if (field.maxLength !== undefined && typeof value === 'string' && value.length > field.maxLength) {
      errors.push(`${key}: max length ${field.maxLength}, got ${value.length}`)
    }
    if (field.validator) {
      const err = field.validator(value)
      if (err) errors.push(`${key}: ${err}`)
    }
  }
  return errors
}
