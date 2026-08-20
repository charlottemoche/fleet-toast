import { useMemo, useState } from 'react'
import { Dashboard } from './components/dashboard/Dashboard.jsx'
import { NeedsReviewModal } from './components/dashboard/NeedsReviewModal.jsx'
import { AlertToast } from './components/alerts/AlertToast.jsx'
import { DriverDrillIn } from './components/detail/DriverDrillIn.jsx'
import { mockDrivers } from './data/mockDrivers.js'
import { sectionOrder, statusConfig } from './data/statusConfig.js'
import { useClockTick } from './hooks/useClockTick.js'
import { useAlertToasts } from './hooks/useAlertToasts.js'
import { groupDriversBySection } from './utils/hos.js'

const TICK_INTERVAL_MS = 5_000

export default function App() {
  const now = useClockTick(TICK_INTERVAL_MS)
  const [drivers, setDrivers] = useState(mockDrivers)
  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewedTierByDriverId, setReviewedTierByDriverId] = useState(
    new Map(),
  )
  const driversBySection = useMemo(
    () => groupDriversBySection(drivers, now, statusConfig, sectionOrder),
    [drivers, now],
  )

  function appendDriverLog(driverId, message) {
    setDrivers((current) =>
      current.map((driver) =>
        driver.id === driverId
          ? {
              ...driver,
              logs: [
                ...driver.logs,
                { timestamp: new Date(now).toISOString(), message },
              ],
            }
          : driver,
      ),
    )
  }

  function handleDriverMessaged(driverId, driverMessage) {
    appendDriverLog(
      driverId,
      `Automated message sent to driver: "${driverMessage}"`,
    )
  }

  function handleLogNote(driverId, tierId, note) {
    appendDriverLog(driverId, note)
    setReviewedTierByDriverId((current) =>
      new Map(current).set(driverId, tierId),
    )
  }

  const { toasts, dismissToast } = useAlertToasts(
    driversBySection,
    handleDriverMessaged,
  )
  const selectedDriver = drivers.find(
    (driver) => driver.id === selectedDriverId,
  )

  return (
    <main className="relative mx-auto flex h-screen flex-col bg-gray-100/20 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <nav className="bg-brand dark:bg-brand sticky top-0 z-10 p-2 shadow">
        <ul className="m-0 flex w-full flex-1 list-none items-center justify-between gap-2 p-0">
          <li>
            <a href="/" className="ml-1 flex items-center gap-2">
              <img
                src="/charlotte-truck-white.png"
                alt=""
                className="h-9 w-9 dark:invert"
              />
              <span className="text-lg font-semibold tracking-tight text-white dark:text-white">
                Fleetline
              </span>
            </a>
          </li>
        </ul>
      </nav>
      <div className="mx-auto min-h-0 w-full flex-1">
        <Dashboard
          now={now}
          driversBySection={driversBySection}
          reviewedTierByDriverId={reviewedTierByDriverId}
          onSelectDriver={setSelectedDriverId}
          onOpenReview={() => setIsReviewModalOpen(true)}
        />
      </div>
      {toasts.length > 0 && (
        <output className="fixed top-4 right-4 z-40 flex flex-col gap-2">
          {toasts.map((toast) => (
            <AlertToast
              key={toast.id}
              driver={toast.driver}
              message={toast.message}
              type={toast.type}
              now={now}
              driverMessaged={toast.driverMessaged}
              onDismiss={() => dismissToast(toast.id)}
              onSelectDriver={setSelectedDriverId}
            />
          ))}
        </output>
      )}
      {selectedDriver && (
        <DriverDrillIn
          driver={selectedDriver}
          onClose={() => setSelectedDriverId(null)}
        />
      )}
      {isReviewModalOpen && (
        <NeedsReviewModal
          driversBySection={driversBySection}
          reviewedTierByDriverId={reviewedTierByDriverId}
          onSelectDriver={(driverId) => {
            setIsReviewModalOpen(false)
            setSelectedDriverId(driverId)
          }}
          onLogNote={handleLogNote}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
    </main>
  )
}
