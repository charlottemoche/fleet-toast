import {
  getSectionActiveClassName,
  getSectionBadgeClassName,
  getSectionLabel,
  sectionOrder,
} from '../../data/alertConfig.js'

const ALL_ACTIVE_CLASS =
  'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900'
const ALL_INACTIVE_CLASS =
  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'

// sectionOrder is urgency-sorted, so the first section is the one that
// deserves an assertive screen-reader announcement when its count changes.
const mostUrgentSection = sectionOrder[0]

function countAllDrivers(driversBySection) {
  let total = 0
  for (const drivers of driversBySection.values()) {
    total += drivers.length
  }
  return total
}

export function AlertSummary({
  driversBySection,
  activeFilter,
  onFilterChange,
}) {
  function toggleFilter(section) {
    onFilterChange(activeFilter === section ? null : section)
  }

  return (
    <fieldset className="m-0 flex flex-wrap gap-2 border-0 p-0">
      <legend className="sr-only">Filter drivers by status</legend>
      <button
        type="button"
        onClick={() => onFilterChange(null)}
        aria-pressed={activeFilter === null}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          activeFilter === null ? ALL_ACTIVE_CLASS : ALL_INACTIVE_CLASS
        }`}
      >
        <span className="text-base font-semibold">
          {countAllDrivers(driversBySection)}
        </span>{' '}
        All
      </button>
      {sectionOrder.map((section) => {
        const isActive = activeFilter === section
        const className = isActive
          ? getSectionActiveClassName(section)
          : getSectionBadgeClassName(section)

        return (
          <button
            key={section}
            type="button"
            onClick={() => toggleFilter(section)}
            aria-pressed={isActive}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${className}`}
          >
            <span
              className="text-base font-semibold"
              aria-live={
                section === mostUrgentSection ? 'assertive' : undefined
              }
            >
              {driversBySection.get(section).length}
            </span>{' '}
            {getSectionLabel(section)}
          </button>
        )
      })}
    </fieldset>
  )
}
