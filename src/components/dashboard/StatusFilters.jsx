import { getTierById, sectionOrder } from '../../data/statusConfig.js'

const ALL_ACTIVE_CLASS =
  'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900'
const ALL_INACTIVE_CLASS =
  'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'

const mostUrgentSection = sectionOrder[0]

export function StatusFilters({
  driversBySection,
  activeFilter,
  onFilterChange,
}) {
  return (
    <fieldset className="m-0 flex flex-wrap gap-2 border-0 p-0">
      <legend className="sr-only">Filter drivers by status</legend>
      <button
        type="button"
        onClick={() => onFilterChange(null)}
        aria-pressed={activeFilter === null}
        className={`h-9 rounded-lg px-4 text-sm font-medium transition-colors ${
          activeFilter === null ? ALL_ACTIVE_CLASS : ALL_INACTIVE_CLASS
        }`}
        disabled={activeFilter === null}
      >
        All
      </button>
      {sectionOrder.map((section) => {
        const isActive = activeFilter === section
        const color = getTierById(section).color
        const isMostUrgent = section === mostUrgentSection

        return (
          <button
            key={section}
            type="button"
            onClick={() => onFilterChange(section)}
            aria-pressed={isActive}
            style={{ '--tier': `var(--color-${color})` }}
            className={
              isActive
                ? 'h-9 rounded-lg bg-[var(--tier)] px-4 text-sm font-medium text-white transition-colors'
                : 'h-9 rounded-lg border border-gray-300 px-4 text-sm font-medium text-[var(--tier)] transition-colors duration-500 hover:bg-[var(--tier)]/10 dark:border-gray-700'
            }
            disabled={isActive}
          >
            {getTierById(section).label}
            {isMostUrgent && (
              <span className="sr-only" aria-live="assertive">
                {driversBySection.get(section).length}{' '}
                {getTierById(section).label}
              </span>
            )}
          </button>
        )
      })}
    </fieldset>
  )
}
