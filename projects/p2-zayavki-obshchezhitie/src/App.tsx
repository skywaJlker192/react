import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import RequestForm from './components/RequestForm'
import RequestCard from './components/RequestCard'
import FilterBar from './components/FilterBar'
import Summary from './components/Summary'
import { useRequests } from './hooks/useRequests'
import { useFlash } from './hooks/useFlash'
import { notifyAutomation } from './notify'
import type { Filter, NewRequest, Status } from './requests'

function App() {
  const { requests, loading, error, retry, add, advance, remove } = useRequests()
  const [filter, setFilter] = useState<Filter>('Все')
  const [query, setQuery] = useState('')
  const [flash, showFlash] = useFlash()

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { 'Все': requests.length, 'Новая': 0, 'В работе': 0, 'Готово': 0 }
    for (const item of requests) {
      result[item.status] += 1
    }
    return result
  }, [requests])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return requests.filter((item) => {
      const byStatus = filter === 'Все' || item.status === filter
      const byQuery =
        needle === '' ||
        [item.title, item.room, item.category, item.details].some((field) =>
          field.toLowerCase().includes(needle),
        )
      return byStatus && byQuery
    })
  }, [requests, filter, query])

  useEffect(() => {
    document.title = `Заявки общежития (${counts['Новая']} новых)`
  }, [counts])

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

  async function handleAdd(data: NewRequest) {
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
      <Header newCount={counts['Новая']} inWorkCount={counts['В работе']} />
      <main className="board">
        <RequestForm onAdd={handleAdd} />
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
              <button type="button" onClick={retry}>Повторить</button>
            </div>
          )}
          {!loading && error === '' && visible.length === 0 && (
            <p className="placeholder">
              {query.trim() !== '' ? 'По такому запросу ничего не нашлось.' : 'Заявок с таким статусом пока нет.'}
            </p>
          )}
          {visible.map((item) => (
            <RequestCard
              key={item.id}
              item={item}
              onAdvance={() => handleAdvance(item.id, item.status)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
          <Summary total={requests.length} inWork={counts['В работе']} done={counts['Готово']} />
        </section>
      </main>
    </>
  )
}

export default App
