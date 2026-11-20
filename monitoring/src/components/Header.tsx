import { NavLink } from 'react-router'
import { useMonitoring } from '../monitoring'

function Header() {
  const { history, loading } = useMonitoring()
  const last = history[0]

  return (
    <header className="header">
      <h1>Мониторинг сайтов группы</h1>
      <p>
        {loading
          ? 'Загрузка данных…'
          : last === undefined
            ? 'Проверок ещё не было'
            : `Последняя проверка: ${new Date(last.time).toLocaleString('ru')}`}
      </p>
      <nav className="nav">
        <NavLink to="/">Сайты</NavLink>
        <NavLink to="/about">О проверке</NavLink>
      </nav>
    </header>
  )
}

export default Header
