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
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-xl font-semibold">Active Shift</h1>
      <StatusFilters
        driversBySection={driversBySection}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <div className="mt-4 overflow-x-auto rounded border border-gray-200 dark:border-gray-800">
        <table className="w-full min-w-[760px] table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th scope="col" className="w-[18%] p-3">
                Driver
              </th>
              <th scope="col" className="w-[22%] p-3">
                Status
              </th>
              <th scope="col" className="w-[10%] truncate p-3" title="Time Remaining">
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
