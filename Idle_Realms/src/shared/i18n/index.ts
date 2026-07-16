import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'
import type { MessageSchema } from './types'

function getInitialLocale(): string {
  try { return localStorage.getItem('idleRealms_lang') || 'zh-CN' }
  catch { return 'zh-CN' }
}

// en-US 为渐进式翻译，用 Partial 类型避免缺失 key 报错
export const i18n = createI18n<[MessageSchema], 'zh-CN' | 'en-US'>({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS as any,
  },
})

export default i18n
