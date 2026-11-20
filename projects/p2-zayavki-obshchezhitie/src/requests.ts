export type Status = 'Новая' | 'В работе' | 'Готово'
export const STATUSES: Status[] = ['Новая', 'В работе', 'Готово']

export type Filter = 'Все' | Status
export const FILTERS: Filter[] = ['Все', ...STATUSES]

export type Category = 'Сантехника' | 'Электрика' | 'Мебель' | 'Интернет'
export const CATEGORIES: Category[] = ['Сантехника', 'Электрика', 'Мебель', 'Интернет']

export const CATEGORY_ICONS: Record<Category, string> = {
  'Сантехника': '🚿',
  'Электрика': '💡',
  'Мебель': '🪑',
  'Интернет': '📶',
}

export type RequestItem = {
  id: string
  title: string
  room: string
  category: Category
  details: string
  status: Status
  urgent?: boolean
  created?: string
}

export type NewRequest = Pick<RequestItem, 'title' | 'room' | 'category' | 'details'>

export function advanceStatus(status: Status): Status {
  return status === 'Новая' ? 'В работе' : 'Готово'
}

// Обновляет заявку в списке, а если её ещё нет — ставит первой.
export function mergeRequest(list: RequestItem[], item: RequestItem): RequestItem[] {
  const known = list.some((r) => r.id === item.id)
  return known ? list.map((r) => (r.id === item.id ? item : r)) : [item, ...list]
}
