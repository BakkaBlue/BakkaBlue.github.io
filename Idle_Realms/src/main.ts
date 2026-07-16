import { createApp } from 'vue'
import { initEngine, shutdownEngine, getConfig } from '@/engine'
import { disposeGameState } from '@/ui/adapters/useGameState'
import { startEngine, stopEngine } from '@/engine/bootstrap/GameEngine'
import { initLogging, getLogger, destroyLogging } from '@/infrastructure/logging/LogManager'
import { BrowserFileSystemProvider } from '@/infrastructure/storage/BrowserFileSystemProvider'
import { DesktopSaveStorage } from '@/infrastructure/storage/DesktopSaveStorage'
import { DesktopConfigStorage } from '@/infrastructure/storage/DesktopConfigStorage'
import { DefaultSaveCodec } from '@/infrastructure/storage/SaveCodec'
import App from './App.vue'
import i18n from './shared/i18n'

async function bootstrap() {
  // 1. 创建平台依赖（浏览器版本：localStorage 文件系统）
  const fs = new BrowserFileSystemProvider()
  const appDataDir = await fs.getAppDataDir()
  const codec = new DefaultSaveCodec()

  await fs.mkdir(`${appDataDir}/config`)
  await fs.mkdir(`${appDataDir}/saves`)
  await fs.mkdir(`${appDataDir}/backups`)
  await fs.mkdir(`${appDataDir}/logs`)

  const deps = {
    saveStorage: new DesktopSaveStorage(fs, codec, appDataDir),
    configStorage: new DesktopConfigStorage(fs, appDataDir),
  }

  // 2. 启动引擎（加载配置 + 存档）
  await initEngine(deps)

  // 3. 初始化日志
  const config = getConfig()
  initLogging(config, fs, appDataDir)
  getLogger().info('system', 'Logging initialized')

  // 4. 启动游戏 Tick 循环
  startEngine()

  // 5. 挂载 Vue
  const app = createApp(App)
  app.use(i18n)
  app.mount('#app')

  getLogger().info('system', '[Idle Realms] Browser version started')

  // 6. 清理钩子
  window.addEventListener('beforeunload', async () => {
    stopEngine()
    await shutdownEngine()
    disposeGameState()
    await destroyLogging()
  })
}

bootstrap()
