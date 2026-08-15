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

  const selectedDriver = mockDrivers.find(
    (driver) => driver.id === selectedDriverId,
  )

  const visibleSections = activeFilter
    ? sectionOrder.filter((section) => section === activeFilter)
    : sectionOrder

  return (
    <div className="mx-auto flex h-full min-h-0 max-w-6xl flex-col p-4">
      <h1 className="mb-4 shrink-0 text-xl font-semibold">Active Shift</h1>
      <div className="shrink-0">
        <StatusFilters
          driversBySection={driversBySection}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>
      <div className="relative mt-4 min-h-0 max-h-fit flex-1 overflow-auto rounded border border-gray-200 dark:border-gray-800">
        <table className="w-full min-w-[760px] table-fixed bg-white text-left text-sm dark:bg-gray-900">
          <thead className="sticky top-0 bg-gray-100 text-gray-900 dark:bg-[#121212] dark:text-gray-100">
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th scope="col" className="w-[18%] p-3">
                Driver
              </th>
              <th scope="col" className="w-[18%] p-3 lg:w-[16%]">
                Status
              </th>
              <th
                scope="col"
                className="w-[14%] truncate p-3"
                title="Time Remaining"
              >
                Time Remaining
              </th>
              <th scope="col" className="w-[22%] p-3">
                Delivery
              </th>
              <th scope="col" className="w-[28%] p-3">
                Location
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
            />
          ))}
        </table>
      </div>
      {selectedDriver && (
        <DriverDrillIn
          driver={selectedDriver}
          onClose={() => setSelectedDriverId(null)}
        />
      )}
    </div>
  )
}
