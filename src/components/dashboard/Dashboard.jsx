import { useState } from 'react'
import { getTierById, sectionOrder } from '../../data/statusConfig.js'
import { driverColumns } from './DriverCols.jsx'
import { StatusFilters } from './StatusFilters.jsx'
import { DriverSection } from './DriverSection.jsx'
import { Stats } from './Stats.jsx'

// Illustrative only — side panel nav items
const NAV_ITEMS = ['Dashboard', 'Map view', 'Traffic', 'Incidents']
const SELECTED_NAV_ITEM = NAV_ITEMS[0]

function matchesSearch(driver, searchTerm) {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return true
  return (
    driver.name.toLowerCase().includes(term) ||
    driver.truckId.toLowerCase().includes(term)
  )
}

export function Dashboard({
  now,
  driversBySection,
  reviewedTierByDriverId,
  onSelectDriver,
  onOpenReview,
}) {
  const [activeFilter, setActiveFilter] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const visibleSections = activeFilter
    ? sectionOrder.filter((section) => section === activeFilter)
    : sectionOrder

  const searchedDriversBySection = new Map(
    sectionOrder.map((section) => [
      section,
      driversBySection
        .get(section)
        .filter((driver) => matchesSearch(driver, searchTerm)),
    ]),
  )

  return (
    <div className="mx-auto flex h-full min-h-0 flex-col">
      <div className="flex h-full min-h-0 flex-1 gap-2 overflow-hidden">
        <aside className="sticky top-0 flex hidden h-full w-1/5 flex-col gap-2 self-start border-r border-gray-200 bg-gray-50 lg:block dark:border-gray-800 dark:bg-gray-950">
          <ul className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
            <li className="p-3">
              <Stats
                driversBySection={driversBySection}
                reviewedTierByDriverId={reviewedTierByDriverId}
                onOpenReview={onOpenReview}
              />
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className={[
                    'w-full p-4 text-left transition-colors duration-300',
                    item === SELECTED_NAV_ITEM
                      ? 'bg-brand/40 dark:bg-brand/30 font-semibold'
                      : 'text-gray-700/90 hover:bg-gray-300 disabled:hover:bg-transparent dark:text-gray-400 dark:hover:bg-gray-800',
                  ].join(' ')}
                  disabled={true}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="flex min-w-0 flex-1 flex-col p-4 lg:pr-6">
          <div className="flex shrink-0 flex-col gap-2">
            <h1 className="shrink-0 text-xl font-semibold">
              {SELECTED_NAV_ITEM}
            </h1>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <StatusFilters
                driversBySection={driversBySection}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
              <input
                className="h-9 min-w-60 rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="relative mt-4 max-h-fit min-h-0 flex-1 overflow-auto rounded border border-gray-200 dark:border-gray-800">
            <table className="w-full min-w-[880px] border-separate border-spacing-0 bg-white text-left text-sm dark:bg-gray-950 dark:text-gray-100">
              <thead className="sticky top-0 z-40 bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  {driverColumns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      title={column.label}
                      className={`p-3 ${column.headerClassName}`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              {visibleSections.map((section) => (
                <DriverSection
                  key={section}
                  label={getTierById(section).label}
                  drivers={searchedDriversBySection.get(section)}
                  now={now}
                  onSelectDriver={onSelectDriver}
                />
              ))}
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
