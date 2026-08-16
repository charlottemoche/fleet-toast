import { useMemo, useState } from 'react'
import { Dashboard } from './components/dashboard/Dashboard.jsx'
import { AlertToastStack } from './components/alerts/AlertToastStack.jsx'
import { DriverDrillIn } from './components/driver-detail/DriverDrillIn.jsx'
import { mockDrivers } from './data/mockDrivers.js'
import { getTierById, sectionOrder, statusConfig } from './data/statusConfig.js'
import { useClockTick } from './hooks/useClockTick.js'
import { useTierAlerts } from './hooks/useTierAlerts.js'
import { groupDriversBySection } from './utils/hos.js'

const TICK_INTERVAL_MS = 5_000
const CRITICAL_TIER = getTierById('critical')
const VIOLATION_TIER = getTierById('violation')

export default function App() {
  const now = useClockTick(TICK_INTERVAL_MS)
  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set())
  const driversBySection = useMemo(
    () => groupDriversBySection(mockDrivers, now, statusConfig, sectionOrder),
    [now],
  )
  const criticalAlerts = useTierAlerts(
    driversBySection.get('critical'),
    CRITICAL_TIER,
  )
  const violationAlerts = useTierAlerts(
    driversBySection.get('violation'),
    VIOLATION_TIER,
  )
  const toasts = [...violationAlerts.toasts, ...criticalAlerts.toasts]

  function dismissToast(toastId) {
    criticalAlerts.dismissToast(toastId)
    violationAlerts.dismissToast(toastId)
  }
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
    <main className="relative mx-auto flex h-screen flex-col bg-gray-100/20 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <nav className="sticky top-0 z-10 bg-gray-50 p-3 shadow dark:bg-gray-950">
        <div>
          <ul className="m-0 flex w-full flex-1 list-none items-center justify-between gap-2 p-0">
            <li>
              <a href="/">
                <img
                  src="/charlotte-truck.png"
                  alt="Logo"
                  className="h-10 w-10 dark:invert"
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
