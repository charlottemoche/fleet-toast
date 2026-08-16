import { useState } from 'react'
import {
  getSectionLabel,
  isSectionAlwaysExpanded,
  sectionOrder,
} from '../../data/statusConfig.js'
import { StatusFilters } from './StatusFilters.jsx'
import { DriverSection } from './DriverSection.jsx'

// Illustrative only — the exercise's fleet (50 trucks, 1,000+ deliveries/day)
// is far larger than this app's 14-driver sample, so these aren't derived
// from mockDrivers.js. They exist to show where fleet-wide throughput would
// live in the UI, not to model it.
const TRUCKS_AVAILABLE = '47 / 50'
const DELIVERIES_TODAY = '812'

// Illustrative only — side panel nav items
const NAV_ITEMS = ['Dashboard', 'Traffic', 'Incidents', 'Map view']
const SELECTED_NAV_ITEM = NAV_ITEMS[0]

export function Dashboard({
  now,
  driversBySection,
  onSelectDriver,
  acknowledgedIds,
}) {
  const [activeFilter, setActiveFilter] = useState(null)

  const visibleSections = activeFilter
    ? sectionOrder.filter((section) => section === activeFilter)
    : sectionOrder

  return (
    <div className="mx-auto flex h-full min-h-0 flex-col">
      <div className="flex h-full min-h-0 flex-1 gap-4 overflow-hidden">
        <aside className="sticky top-0 flex hidden w-1/6 flex-col gap-2 self-start pr-4 lg:block">
          <ul className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <button
                  className={[
                    'w-full rounded p-4 text-left transition-colors duration-500 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800',
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
          <div className="flex shrink-0 flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
            <StatusFilters
              driversBySection={driversBySection}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex shrink-0 gap-4 text-sm">
                <div className="rounded border border-gray-200 px-3 py-1 dark:border-gray-800">
                  <div className="text-xs text-gray-600/90">
                    Trucks available
                  </div>
                  <div className="text-lg font-semibold">
                    {TRUCKS_AVAILABLE}
                  </div>
                </div>
                <div className="rounded border border-gray-200 px-3 py-1 dark:border-gray-800">
                  <div className="text-xs text-gray-600/90">
                    Deliveries today
                  </div>
                  <div className="text-lg font-semibold">
                    {DELIVERIES_TODAY}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mt-4 max-h-fit min-h-0 flex-1 overflow-auto rounded border border-gray-200 dark:border-gray-800">
            <table className="w-full min-w-[760px] table-fixed bg-white text-left text-sm dark:bg-gray-950 dark:text-gray-100">
              <thead className="sticky top-0 bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th scope="col" className="w-[16%] p-3">
                    Driver
                  </th>
                  <th scope="col" className="w-[18%] p-3 lg:w-[16%]">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="w-[14%] truncate p-3"
                    title="Time remaining"
                  >
                    Time remaining
                  </th>
                  <th scope="col" className="w-[14%] p-3">
                    Delivery
                  </th>
                  <th scope="col" className="w-[20%] p-3">
                    Location
                  </th>
                  <th scope="col" className="w-[12%] p-3">
                    Acknowledged
                  </th>
                </tr>
              </thead>
              {visibleSections.map((section) => (
                <DriverSection
                  key={section}
                  label={getSectionLabel(section)}
                  alwaysExpanded={
                    isSectionAlwaysExpanded(section) || section === activeFilter
                  }
                  drivers={driversBySection.get(section)}
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
