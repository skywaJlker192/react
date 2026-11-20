import { useMonitoring } from '../monitoring'

function AboutPage() {
  const { sites, history, loading, error } = useMonitoring()

  if (loading) {
    return (
      <main className="main">
        <p className="empty">Загрузка данных…</p>
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

  return (
    <main className="main page">
      <h2>О проверке</h2>
      <p>
        Каждую ночь в 00:00 по Москве (21:00 UTC) GitHub Actions запускает конвейер «Ночная
        проверка сайтов»: скрипт <code>scripts/check.mjs</code> по очереди запрашивает все сайты
        из списка — сейчас их {sites.length}.
      </p>
      <p>
        Сайт считается работающим, если сервер ответил кодом 200–299 не дольше чем за 15 секунд.
        Код 404, ошибка сети или таймаут означают, что сайт не открывается. Вместе с кодом
        записывается время ответа в миллисекундах.
      </p>
      <p>
        Результаты сохраняются в <code>public/data/results.json</code> коммитом бота
        github-actions[bot] и публикуются на GitHub Pages. В истории хранятся последние 30
        проверок, сейчас их {history.length}.
      </p>
      <p>
        Если сайт перестал открываться или снова заработал, бот присылает сообщение в Telegram.
        О сайтах, состояние которых не изменилось, сообщений нет. Токен бота и номер чата
        хранятся в секретах репозитория — в коде и истории Git их нет.
      </p>
      <p>
        Проверку можно запустить вручную: вкладка Actions → «Ночная проверка сайтов» →
        Run workflow.
      </p>
    </main>
  )
}

export default AboutPage
