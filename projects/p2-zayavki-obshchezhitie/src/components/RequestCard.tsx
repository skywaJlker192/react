import { useState } from 'react'
import { CATEGORY_ICONS, type RequestItem } from '../requests'
import { timeAgo } from '../format'

const STATUS_CLASS: Record<RequestItem['status'], string> = {
  'Новая': 'pill pill--new',
  'В работе': 'pill pill--work',
  'Готово': 'pill pill--done',
}

type RequestCardProps = {
  item: RequestItem
  onAdvance: () => void
  onDelete: () => void
}

function RequestCard({ item, onAdvance, onDelete }: RequestCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const age = timeAgo(item.created)

  return (
    <article className="ticket">
      <div className="ticket__meta">
        <span className="ticket__place">
          комн. {item.room} · {CATEGORY_ICONS[item.category]} {item.category}
        </span>
        <span className="ticket__flags">
          {item.urgent === true && <span className="pill pill--urgent">🔥 срочно</span>}
          <span className={STATUS_CLASS[item.status]}>{item.status}</span>
        </span>
      </div>

      <h3>{item.title}</h3>

      {expanded && item.details !== '' && <p className="ticket__details">{item.details}</p>}
      {expanded && item.details === '' && <p className="ticket__details ticket__details--empty">Подробностей нет.</p>}

      <div className="ticket__bottom">
        <div className="ticket__buttons">
          {item.details !== '' && (
            <button type="button" className="btn btn--ghost" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Свернуть' : 'Подробнее'}
            </button>
          )}
          {item.status !== 'Готово' && (
            <button type="button" className="btn" onClick={onAdvance}>
              {item.status === 'Новая' ? 'Взять в работу' : 'Завершить'}
            </button>
          )}
          {item.status === 'Готово' && !confirming && (
            <button type="button" className="btn btn--danger" onClick={() => setConfirming(true)}>
              Убрать с доски
            </button>
          )}
          {item.status === 'Готово' && confirming && (
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

export default RequestCard
