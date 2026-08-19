import { useEffect, useRef, useState } from 'react'
import { getTierById, sectionOrder } from '../../data/statusConfig.js'

const mostUrgentSection = sectionOrder[0]

export function StatusFilters({
  driversBySection,
  activeFilter,
  onFilterChange,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    function closeIfOutside(event) {
      if (!containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function closeIfEscape(event) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', closeIfOutside)
    document.addEventListener('keydown', closeIfEscape)
    return () => {
      document.removeEventListener('mousedown', closeIfOutside)
      document.removeEventListener('keydown', closeIfEscape)
    }
  }, [isOpen])

  function selectFilter(section) {
    onFilterChange(section)
    setIsOpen(false)
  }

  const activeLabel = activeFilter ? getTierById(activeFilter).label : 'All'

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Filter: {activeLabel}
        <span aria-hidden="true">▾</span>
      </button>
      <span className="sr-only" aria-live="assertive">
        {driversBySection.get(mostUrgentSection).length}{' '}
        {getTierById(mostUrgentSection).label}
      </span>
      {isOpen && (
        <ul className="absolute top-full left-0 z-50 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <li>
            <button
              type="button"
              aria-current={activeFilter === null ? 'true' : undefined}
              onClick={() => selectFilter(null)}
              className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                activeFilter === null ? 'font-semibold' : ''
              }`}
            >
              All
            </button>
          </li>
          {sectionOrder.map((section) => {
            const isActive = activeFilter === section
            const tier = getTierById(section)

            return (
              <li key={section}>
                <button
                  type="button"
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => selectFilter(section)}
                  style={{ '--tier': `var(--color-${tier.type})` }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    isActive ? 'font-semibold' : ''
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full bg-[var(--tier)]"
                  />
                  {tier.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
