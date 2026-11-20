import { Link, useParams } from 'react-router'
import { useMonitoring } from '../monitoring'
import { siteChecks, statusText, uptimePercent } from '../status'

function SitePage() {
  const { id } = useParams()
  const { sites, history, loading, error } = useMonitoring()

  if (loading) {
    return (
      <main className="main">
        <p className="empty">Загрузка сайта…</p>
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

  const site = sites.find((s) => s.id === id)
  if (site === undefined) {
    return (
      <main className="main">
        <Link to="/" className="back">← Все сайты</Link>
        <p className="empty">Сайта с номером {id} нет в списке: его удалили или в адресе ошибка.</p>
      </main>
    )
  }

  const checks = siteChecks(site.id, history)
  const okCount = checks.filter((c) => c.ok).length
  const lastTitle = checks.find((c) => c.ok && c.title !== '')?.title ?? ''
  // Наибольшее время ответа в истории — масштаб для полос (доп. задание).
  const max = Math.max(...checks.map((c) => c.ms), 1)

  return (
    <main className="main">
      <Link to="/" className="back">← Все сайты</Link>
      <article className="site site--page">
        <h2>{site.name}</h2>
        <a href={site.url} target="_blank" rel="noreferrer">
          {site.url}
        </a>
        {lastTitle !== '' && <p className="site__title">Заголовок страницы: «{lastTitle}»</p>}
        <p className="site__uptime">
          {checks.length === 0
            ? 'Проверок ещё не было'
            : `Открывался в ${okCount} из ${checks.length} последних проверок · ${uptimePercent(checks)}%`}
        </p>
      </article>

      <h3 className="history-title">История проверок</h3>
      {checks.length === 0 ? (
        <p className="empty">Этот сайт ещё не проверялся.</p>
      ) : (
        <table className="history">
          <thead>
            <tr>
              <th>Время проверки</th>
              <th>Результат</th>
              <th>Время ответа</th>
            </tr>
          </thead>
          <tbody>
            {history.map((run) => {
              const check = run.checks.find((c) => c.id === site.id)
              if (check === undefined) {
                return null
              }
              return (
                <tr key={run.time} className={check.ok ? '' : 'row--bad'}>
                  <td>{new Date(run.time).toLocaleString('ru')}</td>
                  <td>{statusText(check)}</td>
                  <td className="history__ms">
                    <div className="bar">
                      <div
                        className={check.ok ? 'bar__fill' : 'bar__fill bar__fill--bad'}
                        style={{ width: `${(check.ms / max) * 100}%` }}
                      />
                    </div>
                    <span className="bar__label">{check.ms} мс</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </main>
  )
}

export default SitePage
