// ==================== 文件系统抽象接口 ====================
export interface FileSystemProvider {
  read(path: string): Promise<string | null>
  write(path: string, content: string): Promise<boolean>
  delete(path: string): Promise<boolean>
  list(dir: string): Promise<string[]>
  exists(path: string): Promise<boolean>
  mkdir(dir: string): Promise<boolean>
  getAppDataDir(): Promise<string>
}
