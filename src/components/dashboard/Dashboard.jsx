import { useState } from 'react'
import {
  getSectionLabel,
  isSectionCollapsible,
  sectionOrder,
} from '../../data/statusConfig.js'
import { driverColumns } from './driverColumns.jsx'
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
  onSelectDriver,
  acknowledgedIds,
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
      <div className="flex h-full min-h-0 flex-1 gap-4 overflow-hidden lg:gap-6">
        <aside className="sticky top-0 flex hidden w-1/5 flex-col gap-2 self-start lg:block 2xl:w-1/6">
          <ul className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
            <li className="p-3">
              <Stats />
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <button
                  className={[
                    'w-full rounded p-4 text-left transition-colors duration-300 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800',
                    item === SELECTED_NAV_ITEM
                      ? 'font-semibold'
                      : 'text-gray-600/90 dark:text-gray-400',
                  ].join(' ')}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="flex min-w-0 flex-1 flex-col p-4 lg:pr-8">
          <h1 className="mb-2 shrink-0 text-xl font-semibold">
            {SELECTED_NAV_ITEM}
          </h1>
          <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <StatusFilters
              driversBySection={driversBySection}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            <div>
              <input
                className="min-w-60 rounded-md border border-gray-300 px-3 py-2 dark:border-gray-800"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="relative mt-4 max-h-fit min-h-0 flex-1 overflow-auto rounded border border-gray-200 dark:border-gray-800">
            <table className="w-full min-w-[880px] bg-white text-left text-sm dark:bg-gray-950 dark:text-gray-100">
              <thead className="sticky top-0 bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
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
                  label={getSectionLabel(section)}
                  collapsible={
                    isSectionCollapsible(section) || section === activeFilter
                  }
                  drivers={searchedDriversBySection.get(section)}
                  now={now}
                  onSelectDriver={onSelectDriver}
                  acknowledgedIds={acknowledgedIds}
                />
              ))}
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
