import { useMemo, useState } from 'react'
import {
  alertConfig,
  getSectionLabel,
  getTierById,
  isSectionAlwaysExpanded,
  sectionOrder,
} from '../../data/alertConfig.js'
import { mockDrivers } from '../../data/mockDrivers.js'
import { DriverDrillIn } from '../driver-detail/DriverDrillIn.jsx'
import { useClockTick } from '../../hooks/useClockTick.js'
import { getDriverStatus } from '../../utils/hos.js'
import { AlertSummary } from './AlertSummary.jsx'
import { DriverSection } from './DriverSection.jsx'

const TICK_INTERVAL_MS = 30_000

// Runs getDriverStatus directly (not the useDriverStatus hook) since this
// groups the whole driver list in one pass — hooks can't be called in a loop.
function groupDriversBySection(drivers, now) {
  const driversBySection = new Map(sectionOrder.map((section) => [section, []]))

  for (const driver of drivers) {
    const { tierId } = getDriverStatus(driver, now, alertConfig)
    const section = getTierById(tierId).section
    driversBySection.get(section).push(driver)
  }

  return driversBySection
}

export function Dashboard() {
  const now = useClockTick(TICK_INTERVAL_MS)
  const [selectedDriverId, setSelectedDriverId] = useState(null)

  const driversBySection = useMemo(
    () => groupDriversBySection(mockDrivers, now),
    [now],
  )

  const selectedDriver = mockDrivers.find(
    (driver) => driver.id === selectedDriverId,
  )

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-xl font-semibold">Active Shift</h1>
      <AlertSummary driversBySection={driversBySection} />
      <div className="mt-4 overflow-x-auto rounded border border-gray-200 dark:border-gray-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th scope="col" className="p-3">
                Driver
              </th>
              <th scope="col" className="p-3">
                Status
              </th>
              <th scope="col" className="p-3">
                Time Remaining
              </th>
              <th scope="col" className="p-3">
                Delivery
              </th>
              <th scope="col" className="p-3">
                Location
              </th>
            </tr>
          </thead>
          {sectionOrder.map((section) => (
            <DriverSection
              key={section}
              label={getSectionLabel(section)}
              alwaysExpanded={isSectionAlwaysExpanded(section)}
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
