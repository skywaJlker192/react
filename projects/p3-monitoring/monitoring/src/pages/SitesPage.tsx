import { useState } from 'react'
import { Link } from 'react-router'
import { useMonitoring } from '../monitoring'
import { siteChecks, statusText, uptimePercent } from '../status'

function SitesPage() {
  const { sites, history, loading, error } = useMonitoring()
  // Дополнительное задание «Только неработающие»: фильтр живёт в странице
  // и сбрасывается при уходе с неё (глава 3.1).
  const [onlyBad, setOnlyBad] = useState(false)

  if (loading) {
    return (
      <main className="main">
        <p className="empty">Загрузка сайтов…</p>
      </main>
    )
  }

  if (error !== '') {
    return (
      <main className="main">
        <p className="load-error">{error}</p>
      </main>
    )
  }

  const last = history[0]
  const cards = sites.map((site) => ({
    site,
    check: last?.checks.find((c) => c.id === site.id),
  }))
  const badCount = cards.filter(({ check }) => check !== undefined && !check.ok).length

  let summary = 'Проверок ещё не было'
  if (last !== undefined) {
    summary = badCount === 0 ? `Все ${sites.length} сайтов открываются` : `Не открываются: ${badCount} из ${sites.length}`
  }

  const visible = onlyBad ? cards.filter(({ check }) => check !== undefined && !check.ok) : cards

  return (
    <main className="main">
      <p className={badCount > 0 ? 'summary summary--bad' : 'summary'}>{summary}</p>
      <div className="list-tools">
        <button className={onlyBad ? 'filter active' : 'filter'} onClick={() => setOnlyBad(!onlyBad)}>
          {onlyBad ? 'Показать все сайты' : 'Только неработающие'}
        </button>
      </div>
      {visible.length === 0 && (
        <p className="empty">{onlyBad ? 'Неработающих сайтов нет' : 'Список сайтов пуст'}</p>
      )}
      <ul className="sites">
        {visible.map(({ site, check }) => {
          const checks = siteChecks(site.id, history)
          return (
            <li key={site.id} className={check?.ok ? 'site' : 'site site--bad'}>
              <span className="site__status">{statusText(check)}</span>
              <h2>
                <Link to={`/site/${site.id}`}>{site.name}</Link>
              </h2>
              <a href={site.url} target="_blank" rel="noreferrer">
                {site.url}
              </a>
              {checks.length > 0 && (
                <span className="site__uptime">Открывался в {uptimePercent(checks)}% проверок</span>
              )}
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export default SitesPage
