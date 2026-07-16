// ==================== 浏览器 localStorage 文件系统实现 ====================
import type { FileSystemProvider } from './FileSystemProvider'

const KEY_PREFIX = 'idleRealms:fs:'

export class BrowserFileSystemProvider implements FileSystemProvider {
  private key(path: string): string {
    return KEY_PREFIX + path
  }

  async read(path: string): Promise<string | null> {
    try {
      return localStorage.getItem(this.key(path))
    } catch { return null }
  }

  async write(path: string, content: string): Promise<boolean> {
    try {
      localStorage.setItem(this.key(path), content)
      return true
    } catch { return false }
  }

  async delete(path: string): Promise<boolean> {
    try {
      localStorage.removeItem(this.key(path))
      return true
    } catch { return false }
  }

  async list(dir: string): Promise<string[]> {
    try {
      const prefix = this.key(dir.endsWith('/') ? dir : dir + '/')
      const result: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(prefix)) {
          result.push(key.slice(prefix.length))
        }
      }
      return result
    } catch { return [] }
  }

  async exists(path: string): Promise<boolean> {
    try {
      return localStorage.getItem(this.key(path)) !== null
    } catch { return false }
  }

  async mkdir(_dir: string): Promise<boolean> {
    // localStorage 是 flat 结构，无需创建目录，始终成功
    return true
  }

  async getAppDataDir(): Promise<string> {
    return 'idle-realms'
  }
}
