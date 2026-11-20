import { useState } from 'react'
import type { RequestItem } from './requests'

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

  return (
    <article className="ticket">
      <div className="ticket__meta">
        <span className="ticket__place">{item.room} · {item.category}</span>
        <span className={STATUS_CLASS[item.status]}>{item.status}</span>
      </div>

      <h3>{item.title}</h3>

      {expanded && (
        <p className={item.details === '' ? 'ticket__details ticket__details--empty' : 'ticket__details'}>
          {item.details === '' ? 'Подробностей нет.' : item.details}
        </p>
      )}

      <div className="ticket__bottom">
        <div className="ticket__buttons">
          <button type="button" className="btn btn--ghost" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Свернуть' : 'Подробнее'}
          </button>
          {item.status !== 'Готово' && (
            <button type="button" className="btn" onClick={onAdvance}>
              {item.status === 'Новая' ? 'Взять в работу' : 'Завершить'}
            </button>
          )}
          {item.status === 'Готово' && (
            <button type="button" className="btn btn--danger" onClick={onDelete}>
              Убрать
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default RequestCard
