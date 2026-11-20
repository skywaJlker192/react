import { FILTERS, type Filter } from '../requests'

type FilterBarProps = {
  value: Filter
  counts: Record<Filter, number>
  onChange: (filter: Filter) => void
}

function FilterBar({ value, counts, onChange }: FilterBarProps) {
  return (
    <div className="chips" role="group" aria-label="Фильтр по статусу">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          className={filter === value ? 'chip chip--on' : 'chip'}
          aria-pressed={filter === value}
          onClick={() => onChange(filter)}
        >
          {filter} <span className="chip__num">{counts[filter]}</span>
        </button>
      ))}
    </div>
  )
}

export default FilterBar
