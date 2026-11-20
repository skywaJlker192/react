type HeaderProps = {
  newCount: number
}

function Header({ newCount }: HeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__logo" aria-hidden="true">🛠️</span>
        <div>
          <h1>Доска заявок</h1>
          <p>Общежитие №3 · поломки и бытовые проблемы жителей</p>
        </div>
      </div>
      <div className="topbar__counters">
        <span className="topbar__badge topbar__badge--new">новых заявок: {newCount}</span>
      </div>
    </header>
  )
}

export default Header
