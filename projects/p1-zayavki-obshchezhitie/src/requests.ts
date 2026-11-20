export type Status = 'Новая' | 'В работе' | 'Готово'
export const STATUSES: Status[] = ['Новая', 'В работе', 'Готово']

export type Filter = 'Все' | Status
export const FILTERS: Filter[] = ['Все', ...STATUSES]

export type Category = 'Сантехника' | 'Электрика' | 'Мебель' | 'Интернет'
export const CATEGORIES: Category[] = ['Сантехника', 'Электрика', 'Мебель', 'Интернет']

export type RequestItem = {
  id: string
  title: string
  room: string
  category: Category
  details: string
  status: Status
}

export type NewRequest = Pick<RequestItem, 'title' | 'room' | 'category' | 'details'>

export function advanceStatus(status: Status): Status {
  return status === 'Новая' ? 'В работе' : 'Готово'
}

// Заявки, с которыми доска открывается в первый раз.
export const initialRequests: RequestItem[] = [
  {
    id: 'r1',
    title: 'Течёт кран в душевой',
    room: '312',
    category: 'Сантехника',
    details: 'Капает вторые сутки, под раковиной уже лужа.',
    status: 'Новая',
  },
  {
    id: 'r2',
    title: 'Не работает розетка у кровати',
    room: '204',
    category: 'Электрика',
    details: 'Розетка возле окна не даёт ток, зарядка не работает.',
    status: 'Новая',
  },
  {
    id: 'r3',
    title: 'Сломалась ножка стула',
    room: '118',
    category: 'Мебель',
    details: 'Стул шатается, на нём опасно сидеть.',
    status: 'В работе',
  },
  {
    id: 'r4',
    title: 'Пропал интернет в комнате',
    room: '421',
    category: 'Интернет',
    details: 'Кабель подключён, но сеть не появляется с вечера.',
    status: 'В работе',
  },
  {
    id: 'r5',
    title: 'Перегорела лампа в коридоре',
    room: '3 этаж',
    category: 'Электрика',
    details: '',
    status: 'Готово',
  },
]
