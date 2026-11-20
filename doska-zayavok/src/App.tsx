import { useEffect, useMemo, useState } from 'react'
import TopBar from './components/TopBar'
import TicketForm from './components/TicketForm'
import TicketCard from './components/TicketCard'
import FilterBar from './components/FilterBar'
import Summary from './components/Summary'
import { useTickets } from './hooks/useTickets'
import { useFlash } from './hooks/useFlash'
import { notifyAutomation } from './lib/notify'
import { FILTERS, type Filter, type NewTicket, type Status } from './types'

const FILTER_STORAGE_KEY = 'doska.filter'

function readStoredFilter(): Filter {
  try {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY) as Filter | null
    return saved !== null && FILTERS.includes(saved) ? saved : 'Все'
  } catch {
    return 'Все'
  }
}

function App() {
  const { tickets, loading, error, retry, add, advance, remove } = useTickets()
  const [filter, setFilter] = useState<Filter>(readStoredFilter)
  const [query, setQuery] = useState('')
  const [flash, showFlash] = useFlash()

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { 'Все': tickets.length, 'Новая': 0, 'В работе': 0, 'Готово': 0 }
    for (const ticket of tickets) {
      result[ticket.status] += 1
    }
    return result
  }, [tickets])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return tickets.filter((ticket) => {
      const byStatus = filter === 'Все' || ticket.status === filter
      const byQuery =
        needle === '' ||
        [ticket.title, ticket.room, ticket.category, ticket.details].some((field) =>
          field.toLowerCase().includes(needle),
        )
      return byStatus && byQuery
    })
  }, [tickets, filter, query])

  useEffect(() => {
    document.title = `Заявки общежития (${counts['Новая']} новых)`
  }, [counts])

  useEffect(() => {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, filter)
    } catch {
      // localStorage может быть запрещён — просто не запоминаем фильтр
    }
  }, [filter])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setFilter('Все')
        setQuery('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function handleAdd(data: NewTicket) {
    try {
      const created = await add(data)
      showFlash('Заявка сохранена. Отправляем её диспетчеру…')
      const delivered = await notifyAutomation(created)
      showFlash(
        delivered
          ? 'Заявка сохранена, уведомление ушло в Telegram.'
          : 'Заявка сохранена, но n8n недоступен — уведомление не отправлено.',
      )
    } catch (e) {
      showFlash((e as Error).message)
    }
  }

  async function handleAdvance(id: string, status: Status) {
    try {
      await advance(id, status)
    } catch (e) {
      showFlash((e as Error).message)
    }
  }

  async function handleDelete(id: string) {
    try {
      await remove(id)
      showFlash('Заявка убрана с доски.')
    } catch (e) {
      showFlash((e as Error).message)
    }
  }

  return (
    <>
      <TopBar newCount={counts['Новая']} inWorkCount={counts['В работе']} />
      <main className="board">
        <TicketForm onAdd={handleAdd} />
        <section className="feed">
          <div className="feed__head">
            <h2>Заявки</h2>
            <input
              type="search"
              className="feed__search"
              placeholder="Поиск: комната, слово из описания…"
              aria-label="Поиск по заявкам"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <FilterBar value={filter} counts={counts} onChange={setFilter} />
          {flash !== '' && <p className="flash" role="status">{flash}</p>}
          {loading && <p className="placeholder">Загружаем заявки из базы…</p>}
          {error !== '' && (
            <div className="crash">
              <p>{error}</p>
              <button type="button" onClick={retry}>Попробовать снова</button>
            </div>
          )}
          {!loading && error === '' && visible.length === 0 && (
            <p className="placeholder">
              {query.trim() !== '' ? 'По такому запросу ничего не нашлось.' : 'Заявок с таким статусом пока нет.'}
            </p>
          )}
          {visible.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onAdvance={() => handleAdvance(ticket.id, ticket.status)}
              onDelete={() => handleDelete(ticket.id)}
            />
          ))}
          <Summary total={tickets.length} inWork={counts['В работе']} done={counts['Готово']} />
        </section>
      </main>
    </>
  )
}

export default App
