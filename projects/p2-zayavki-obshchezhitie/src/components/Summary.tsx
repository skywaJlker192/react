import { plural } from '../format'

type SummaryProps = {
  total: number
  inWork: number
  done: number
}

function Summary({ total, inWork, done }: SummaryProps) {
  return (
    <footer className="summary">
      Всего {total} {plural(total, 'заявка', 'заявки', 'заявок')} · в работе {inWork} · закрыто {done}
    </footer>
  )
}

export default Summary
