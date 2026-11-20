type HeaderProps = {
  newCount: number
  inWorkCount: number
}

function Header({ newCount, inWorkCount }: HeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__logo" aria-hidden="true">🛠️</span>
        <div>
          <h1>Доска заявок</h1>
          <p>Общежитие №3 · поломки, бытовые проблемы и жалобы жителей</p>
        </div>
      </div>
      <div className="topbar__counters">
        <span className="topbar__badge topbar__badge--new">новых: {newCount}</span>
        <span className="topbar__badge topbar__badge--work">в работе: {inWorkCount}</span>
      </div>
    </header>
  )
}

export default Header
