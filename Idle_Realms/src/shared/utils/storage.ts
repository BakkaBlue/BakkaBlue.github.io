// ==================== localStorage 封装 ====================

const KEY_PREFIX = 'idleRealms:'

/** 检查 localStorage 是否可用 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__idleRealms_test__'
    localStorage.setItem(testKey, '1')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/** 获取 localStorage 使用量（估算，单位字节） */
export function getStorageUsage(): number {
  let total = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(KEY_PREFIX)) {
      total += (key.length + (localStorage.getItem(key)?.length ?? 0)) * 2 // UTF-16
    }
  }
  return total
}
