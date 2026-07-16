// ==================== 配置版本迁移 ====================
const MIGRATIONS: Record<number, (c: Record<string, unknown>) => Record<string, unknown>> = {
  1: (c) => ({
    ...c,
    version: 1,
    logLevel: (c as any).logLevel ?? { engine: 'info', ui: 'info', native: 'info', system: 'warn' },
  }),
}

export function migrateConfig(config: Record<string, unknown>): Record<string, unknown> {
  let result = { ...config }
  const currentVersion = (result.version as number) ?? 0
  for (let v = currentVersion; v < 2; v++) {  // 2 = target version
    if (MIGRATIONS[v + 1]) {
      result = MIGRATIONS[v + 1](result)
    }
  }
  return result
}
