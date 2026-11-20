import { useState, type FormEvent } from 'react'
import { CATEGORIES, type Category, type NewRequest } from '../requests'

const DETAILS_LIMIT = 300

type RequestFormProps = {
  onAdd: (item: NewRequest) => void
}

function RequestForm({ onAdd }: RequestFormProps) {
  const [title, setTitle] = useState('')
  const [room, setRoom] = useState('')
  const [category, setCategory] = useState<Category>(CATEGORIES[0])
  const [details, setDetails] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (title.trim() === '' || room.trim() === '') {
      setError('Заполните, что случилось, и укажите номер комнаты.')
      return
    }
    onAdd({ title: title.trim(), room: room.trim(), category, details: details.trim() })
    setTitle('')
    setRoom('')
    setCategory(CATEGORIES[0])
    setDetails('')
    setError('')
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>Новая заявка</h2>

      <label htmlFor="request-title">Что случилось</label>
      <input
        id="request-title"
        type="text"
        placeholder="Например: течёт кран в душевой"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor="request-room">Комната</label>
      <input
        id="request-room"
        type="text"
        inputMode="numeric"
        placeholder="312"
        value={room}
        onChange={(event) => setRoom(event.target.value)}
      />

      <label htmlFor="request-category">Категория</label>
      <select
        id="request-category"
        value={category}
        onChange={(event) => setCategory(event.target.value as Category)}
      >
        {CATEGORIES.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <label htmlFor="request-details">Подробности</label>
      <textarea
        id="request-details"
        rows={4}
        maxLength={DETAILS_LIMIT}
        placeholder="Когда заметили, что уже пробовали, когда удобно прийти мастеру…"
        value={details}
        onChange={(event) => setDetails(event.target.value)}
      />
      <span className="panel__counter">{details.length}/{DETAILS_LIMIT}</span>

      {error !== '' && <p className="panel__error" role="alert">{error}</p>}

      <button type="submit" className="panel__submit">Добавить заявку</button>
      <p className="panel__hint">После отправки заявка уйдёт диспетчеру в Telegram.</p>
    </form>
  )
}

export default RequestForm
