// Склонение существительного после числа: 1 минута, 2 минуты, 5 минут.
export function plural(count: number, one: string, few: string, many: string): string {
  const tail = count % 10
  const hundred = count % 100
  if (tail === 1 && hundred !== 11) {
    return one
  }
  if (tail >= 2 && tail <= 4 && (hundred < 12 || hundred > 14)) {
    return few
  }
  return many
}

// PocketBase отдаёт дату вида «2026-11-20 05:49:12.345Z».
export function timeAgo(created: string | undefined): string {
  if (!created) {
    return ''
  }
  const moment = new Date(created.replace(' ', 'T')).getTime()
  if (Number.isNaN(moment)) {
    return ''
  }
  const minutes = Math.max(0, Math.floor((Date.now() - moment) / 60_000))
  if (minutes < 1) {
    return 'только что'
  }
  if (minutes < 60) {
    return `${minutes} ${plural(minutes, 'минуту', 'минуты', 'минут')} назад`
  }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} ${plural(hours, 'час', 'часа', 'часов')} назад`
  }
  const days = Math.floor(hours / 24)
  return `${days} ${plural(days, 'день', 'дня', 'дней')} назад`
}
