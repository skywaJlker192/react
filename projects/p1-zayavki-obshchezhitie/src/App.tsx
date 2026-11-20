import { useEffect, useState } from 'react'
import Header from './Header'
import RequestForm from './RequestForm'
import RequestCard from './RequestCard'
import { notifyAutomation } from './notify'
import { advanceStatus, FILTERS, type Filter, type NewRequest, type RequestItem } from './requests'
import { loadRequests, saveRequests } from './storage'

function App() {
  const [requests, setRequests] = useState<RequestItem[]>(loadRequests)
  const [filter, setFilter] = useState<Filter>('Все')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    saveRequests(requests)
  }, [requests])

  const newCount = requests.filter((item) => item.status === 'Новая').length
  const visible = requests.filter((item) => filter === 'Все' || item.status === filter)

  async function handleAdd(data: NewRequest) {
    const item: RequestItem = { id: crypto.randomUUID(), status: 'Новая', ...data }
    setRequests((list) => [item, ...list])
    setNotice('Отправляем заявку в Telegram…')
    const delivered = await notifyAutomation(data)
    setNotice(
      delivered
        ? 'Заявка добавлена, сообщение ушло в Telegram.'
        : 'Заявка добавлена, но сообщение в Telegram отправить не удалось: n8n недоступен.',
    )
  }

  function handleAdvance(id: string) {
    setRequests((list) =>
      list.map((item) => (item.id === id ? { ...item, status: advanceStatus(item.status) } : item)),
    )
  }

  function handleDelete(id: string) {
    setRequests((list) => list.filter((item) => item.id !== id))
  }

  return (
    <>
      <Header newCount={newCount} />
      <main className="board">
        <RequestForm onAdd={handleAdd} />
        <section className="feed">
          <div className="feed__head">
            <h2>Заявки</h2>
          </div>
          <div className="chips" role="group" aria-label="Фильтр по статусу">
            {FILTERS.map((option) => (
              <button
                key={option}
                type="button"
                className={option === filter ? 'chip chip--on' : 'chip'}
                aria-pressed={option === filter}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {notice !== '' && <p className="flash" role="status">{notice}</p>}
          {visible.length === 0 && <p className="placeholder">Заявок с таким статусом пока нет.</p>}
          {visible.map((item) => (
            <RequestCard
              key={item.id}
              item={item}
              onAdvance={() => handleAdvance(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </section>
      </main>
    </>
  )
}

export default App
