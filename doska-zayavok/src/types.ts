export const STATUSES = ['Новая', 'В работе', 'Готово'] as const
export type Status = (typeof STATUSES)[number]

export type Filter = 'Все' | Status
export const FILTERS: Filter[] = ['Все', ...STATUSES]

export const CATEGORIES = ['Бытовое', 'Мебель', 'Сантехника', 'Электрика', 'Интернет', 'Соседи'] as const
export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_ICONS: Record<Category, string> = {
  'Бытовое': '🧹',
  'Мебель': '🪑',
  'Сантехника': '🚿',
  'Электрика': '💡',
  'Интернет': '📶',
  'Соседи': '🔊',
}

export type Ticket = {
  id: string
  title: string
  room: string
  category: Category
  details: string
  status: Status
  urgent?: boolean
  created?: string
}

export type NewTicket = Pick<Ticket, 'title' | 'room' | 'category' | 'details'>

export function advanceStatus(status: Status): Status {
  return status === 'Новая' ? 'В работе' : 'Готово'
}

// Обновляет заявку в списке, а если её ещё нет — ставит первой.
export function mergeTicket(list: Ticket[], ticket: Ticket): Ticket[] {
  const known = list.some((t) => t.id === ticket.id)
  return known ? list.map((t) => (t.id === ticket.id ? ticket : t)) : [ticket, ...list]
}
