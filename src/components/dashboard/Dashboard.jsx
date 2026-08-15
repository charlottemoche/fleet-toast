import { useState } from 'react'
import {
  getSectionLabel,
  isSectionAlwaysExpanded,
  sectionOrder,
} from '../../data/statusConfig.js'
import { mockDrivers } from '../../data/mockDrivers.js'
import { DriverDrillIn } from '../driver-detail/DriverDrillIn.jsx'
import { StatusFilters } from './StatusFilters.jsx'
import { DriverSection } from './DriverSection.jsx'

export function Dashboard({ now, driversBySection }) {
  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set())

  const selectedDriver = mockDrivers.find(
    (driver) => driver.id === selectedDriverId,
  )

  function toggleAcknowledged(driverId) {
    setAcknowledgedIds((current) => {
      const next = new Set(current)
      if (next.has(driverId)) {
        next.delete(driverId)
      } else {
        next.add(driverId)
      }
      return next
    })
  }

  const visibleSections = activeFilter
    ? sectionOrder.filter((section) => section === activeFilter)
    : sectionOrder

  return (
    <div className="mx-auto flex h-full min-h-0 flex-col">
      <div className="flex h-full min-h-0 flex-1 gap-4 overflow-hidden">
        <aside className="sticky top-0 flex hidden w-1/6 flex-col gap-2 self-start pr-4 lg:block">
          <ul className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
            <li>
              <button className="w-full rounded p-4 text-left font-bold transition-colors duration-500 hover:bg-gray-200 dark:hover:bg-gray-800">
                Dashboard
              </button>
            </li>
            <li>
              <button className="w-full rounded p-4 text-left text-gray-600 transition-colors duration-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800">
                Traffic
              </button>
            </li>
            <li>
              <button className="w-full rounded p-4 text-left text-gray-600 transition-colors duration-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800">
                Incidents
              </button>
            </li>
            <li>
              <button className="w-full rounded p-4 text-left text-gray-600 transition-colors duration-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800">
                Map view
              </button>
            </li>
          </ul>
        </aside>
        <section className="flex min-w-0 flex-1 flex-col p-4 lg:pr-8">
          <h1 className="mb-4 shrink-0 text-xl font-semibold">Dashboard</h1>
          <div className="shrink-0">
            <StatusFilters
              driversBySection={driversBySection}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
          <div className="relative mt-4 max-h-fit min-h-0 flex-1 overflow-auto rounded border border-gray-200 dark:border-gray-800">
            <table className="w-full min-w-[760px] table-fixed bg-white text-left text-sm dark:bg-[#121212] dark:text-gray-100">
              <thead className="sticky top-0 bg-gray-100 text-gray-900 dark:bg-[#121212] dark:text-gray-100">
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
                  onSelectDriver={setSelectedDriverId}
                  acknowledgedIds={acknowledgedIds}
                />
              ))}
            </table>
          </div>
          {selectedDriver && (
            <DriverDrillIn
              driver={selectedDriver}
              onClose={() => setSelectedDriverId(null)}
              isAcknowledged={acknowledgedIds.has(selectedDriver.id)}
              onToggleAcknowledged={() => toggleAcknowledged(selectedDriver.id)}
            />
          )}
        </section>
      </div>
    </div>
  )
}
