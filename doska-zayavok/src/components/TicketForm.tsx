import { useState, type FormEvent } from 'react'
import { CATEGORIES, type Category, type NewTicket } from '../types'

const DETAILS_LIMIT = 300

type TicketFormProps = {
  onAdd: (ticket: NewTicket) => void
}

function TicketForm({ onAdd }: TicketFormProps) {
  const [title, setTitle] = useState('')
  const [room, setRoom] = useState('')
  const [category, setCategory] = useState<Category>('Бытовое')
  const [details, setDetails] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (title.trim().length < 3 || room.trim() === '') {
      setError('Опишите проблему (хотя бы 3 символа) и укажите номер комнаты.')
      return
    }
    onAdd({ title: title.trim(), room: room.trim(), category, details: details.trim() })
    setTitle('')
    setRoom('')
    setCategory('Бытовое')
    setDetails('')
    setError('')
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>Новая заявка</h2>

      <label htmlFor="ticket-title">Что случилось</label>
      <input
        id="ticket-title"
        type="text"
        placeholder="Например: течёт кран в душевой"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor="ticket-room">Комната</label>
      <input
        id="ticket-room"
        type="text"
        inputMode="numeric"
        placeholder="312"
        value={room}
        onChange={(event) => setRoom(event.target.value)}
      />

      <label htmlFor="ticket-category">Категория</label>
      <select
        id="ticket-category"
        value={category}
        onChange={(event) => setCategory(event.target.value as Category)}
      >
        {CATEGORIES.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <label htmlFor="ticket-details">Подробности</label>
      <textarea
        id="ticket-details"
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

export default TicketForm
