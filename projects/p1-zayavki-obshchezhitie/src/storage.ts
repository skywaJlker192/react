import { initialRequests, type RequestItem } from './requests'

const STORAGE_KEY = 'zayavki-obshchezhitie'

// Читает заявки из localStorage; если там пусто или данные испорчены — стартовые.
export function loadRequests(): RequestItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      return initialRequests
    }
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as RequestItem[]) : initialRequests
  } catch {
    return initialRequests
  }
}

export function saveRequests(requests: RequestItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  } catch {
    // localStorage может быть запрещён — тогда заявки живут до перезагрузки
  }
}
