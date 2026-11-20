import type { Check, Run } from './types'

// Текст статуса одной проверки — нужен и списку, и странице сайта (глава 3.4).
export function statusText(check: Check | undefined) {
  if (check === undefined) {
    return 'Не проверялся'
  }
  if (check.ok) {
    return `Работает · ${check.ms} мс`
  }
  return `Не открывается · ${check.status || check.error}`
}

// Все проверки одного сайта из истории, от новых к старым.
export function siteChecks(id: string, history: Run[]): Check[] {
  const checks: Check[] = []
  for (const run of history) {
    const check = run.checks.find((c) => c.id === id)
    if (check !== undefined) {
      checks.push(check)
    }
  }
  return checks
}

// Дополнительное задание «Доля работы»: процент успешных проверок.
export function uptimePercent(checks: Check[]): number {
  if (checks.length === 0) {
    return 0
  }
  const ok = checks.filter((c) => c.ok).length
  return Math.round((ok / checks.length) * 100)
}
