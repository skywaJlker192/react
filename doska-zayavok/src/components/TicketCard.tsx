import { useState } from 'react'
import { CATEGORY_ICONS, type Ticket } from '../types'
import { timeAgo } from '../lib/format'

const STATUS_CLASS: Record<Ticket['status'], string> = {
  'Новая': 'pill pill--new',
  'В работе': 'pill pill--work',
  'Готово': 'pill pill--done',
}

type TicketCardProps = {
  ticket: Ticket
  onAdvance: () => void
  onDelete: () => void
}

function TicketCard({ ticket, onAdvance, onDelete }: TicketCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const age = timeAgo(ticket.created)

  return (
    <article className="ticket">
      <div className="ticket__meta">
        <span className="ticket__place">
          комн. {ticket.room} · {CATEGORY_ICONS[ticket.category]} {ticket.category}
        </span>
        <span className="ticket__flags">
          {ticket.urgent === true && <span className="pill pill--urgent">🔥 срочно</span>}
          <span className={STATUS_CLASS[ticket.status]}>{ticket.status}</span>
        </span>
      </div>

      <h3>{ticket.title}</h3>

      {expanded && ticket.details !== '' && <p className="ticket__details">{ticket.details}</p>}
      {expanded && ticket.details === '' && <p className="ticket__details ticket__details--empty">Подробностей нет.</p>}

      <div className="ticket__bottom">
        <div className="ticket__buttons">
          {ticket.details !== '' && (
            <button type="button" className="btn btn--ghost" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Свернуть' : 'Подробнее'}
            </button>
          )}
          {ticket.status !== 'Готово' && (
            <button type="button" className="btn" onClick={onAdvance}>
              {ticket.status === 'Новая' ? 'Взять в работу' : 'Завершить'}
            </button>
          )}
          {ticket.status === 'Готово' && !confirming && (
            <button type="button" className="btn btn--danger" onClick={() => setConfirming(true)}>
              Убрать с доски
            </button>
          )}
          {ticket.status === 'Готово' && confirming && (
            <>
              <button type="button" className="btn btn--danger" onClick={onDelete}>
                Точно убрать?
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setConfirming(false)}>
                Отмена
              </button>
            </>
          )}
        </div>
        {age !== '' && <time className="ticket__age">{age}</time>}
      </div>
    </article>
  )
}

export default TicketCard
