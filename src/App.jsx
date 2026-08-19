import { useMemo, useState } from 'react'
import { Dashboard } from './components/dashboard/Dashboard.jsx'
import { NeedsReviewModal } from './components/dashboard/NeedsReviewModal.jsx'
import { AlertToastStack } from './components/alerts/AlertToastStack.jsx'
import { DriverDrillIn } from './components/detail/DriverDrillIn.jsx'
import { mockDrivers } from './data/mockDrivers.js'
import { sectionOrder, statusConfig } from './data/statusConfig.js'
import { useClockTick } from './hooks/useClockTick.js'
import { useTierAlerts } from './hooks/useTierAlerts.js'
import { groupDriversBySection } from './utils/hos.js'

const TICK_INTERVAL_MS = 5_000

export default function App() {
  const now = useClockTick(TICK_INTERVAL_MS)
  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const driversBySection = useMemo(
    () => groupDriversBySection(mockDrivers, now, statusConfig, sectionOrder),
    [now],
  )
  const { toasts, dismissToast } = useTierAlerts(driversBySection)
  const selectedDriver = mockDrivers.find(
    (driver) => driver.id === selectedDriverId,
  )

  return (
    <main className="relative mx-auto flex h-screen flex-col bg-gray-100/20 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <nav className="sticky top-0 z-10 bg-gray-100 p-2 shadow dark:bg-gray-950">
        <ul className="m-0 flex w-full flex-1 list-none items-center justify-between gap-2 p-0">
          <li>
            <a href="/">
              <img
                src="/charlotte-truck.png"
                alt="Logo"
                className="ml-1 h-9 w-9 dark:invert"
              />
            </a>
          </li>
        </ul>
      </nav>
      <div className="mx-auto min-h-0 w-full flex-1">
        <Dashboard
          now={now}
          driversBySection={driversBySection}
          onSelectDriver={setSelectedDriverId}
          onOpenReview={() => setIsReviewModalOpen(true)}
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
        />
      )}
      {isReviewModalOpen && (
        <NeedsReviewModal
          driversBySection={driversBySection}
          onSelectDriver={(driverId) => {
            setIsReviewModalOpen(false)
            setSelectedDriverId(driverId)
          }}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
    </main>
  )
}
