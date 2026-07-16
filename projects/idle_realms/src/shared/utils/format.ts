// ==================== 格式化工具 ====================

import i18n from '@/shared/i18n'
const { t } = i18n.global

/** 格式化大数字（如 1.5K, 2.3M） */
export function formatNumber(n: number): string {
  if (n < 1000) return n.toString()
  if (n < 1_000_000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  if (n < 1_000_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n < 1_000_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
  return (n / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T'
}

/** 格式化为百分数字符串 */
export function formatPercent(value: number, decimals: number = 1): string {
  return (value * 100).toFixed(decimals) + '%'
}

/** 格式化时间为 hh:mm:ss */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

/** 格式化时长为可读文本 */
export function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) return t('common.duration_hours', { hours, minutes })
  if (minutes > 0) return t('common.duration_minutes', { minutes })
  return t('common.duration_less_than_minute')
}

/** 获取当前时间 HH:MM 格式 */
export function timeNow(): string {
  const locale = (i18n.global.locale as string) || 'zh-CN'
  return new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
}
