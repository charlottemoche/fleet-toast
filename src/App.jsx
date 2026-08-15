import { useMemo, useState } from 'react'
import { Dashboard } from './components/dashboard/Dashboard.jsx'
import { AlertToastStack } from './components/alerts/AlertToastStack.jsx'
import { DriverDrillIn } from './components/driver-detail/DriverDrillIn.jsx'
import { mockDrivers } from './data/mockDrivers.js'
import { sectionOrder, statusConfig } from './data/statusConfig.js'
import { useClockTick } from './hooks/useClockTick.js'
import { useCriticalAlerts } from './hooks/useCriticalAlerts.js'
import { groupDriversBySection } from './utils/hos.js'

const TICK_INTERVAL_MS = 30_000

export default function App() {
  const now = useClockTick(TICK_INTERVAL_MS)
  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set())
  const driversBySection = useMemo(
    () => groupDriversBySection(mockDrivers, now, statusConfig, sectionOrder),
    [now],
  )
  const { toasts, dismissToast } = useCriticalAlerts(
    driversBySection.get('critical'),
  )
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

  return (
    <main className="relative mx-auto flex h-screen flex-col bg-gray-100/20 text-gray-900 dark:bg-[#121212] dark:text-gray-100">
      <nav className="sticky top-0 z-10 bg-[#f8f8f5] p-3 shadow dark:bg-[#000000]">
        <div>
          <ul className="m-0 flex w-full flex-1 list-none items-center justify-between gap-2 p-0">
            <li>
              <a href="/">
                <img
                  src="/charlotte-truck.png"
                  alt="Logo"
                  className="h-10 w-10"
                />
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="mx-auto min-h-0 w-full flex-1">
        <Dashboard
          now={now}
          driversBySection={driversBySection}
          onSelectDriver={setSelectedDriverId}
          acknowledgedIds={acknowledgedIds}
          onToggleAcknowledged={toggleAcknowledged}
        />
      </div>
      <AlertToastStack
        toasts={toasts}
        now={now}
        onDismiss={dismissToast}
        onSelectDriver={setSelectedDriverId}
      />
      {selectedDriver && (
        <DriverDrillIn
          driver={selectedDriver}
          onClose={() => setSelectedDriverId(null)}
          isAcknowledged={acknowledgedIds.has(selectedDriver.id)}
          onToggleAcknowledged={() => toggleAcknowledged(selectedDriver.id)}
        />
      )}
    </main>
  )
}
