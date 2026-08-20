import { useRef } from 'react'
import { getTierById } from '../../data/statusConfig.js'
import { StatusBadge } from '../status/StatusBadge.jsx'
import { Modal } from '../shared/Modal.jsx'
import { DriverActions } from '../shared/DriverActions.jsx'

function getUrgentDrivers(driversBySection, reviewedTierByDriverId) {
  const result = []
  for (const [tierId, drivers] of driversBySection) {
    const tier = getTierById(tierId)
    if (!tier.alertMessage) continue
    for (const driver of drivers) {
      if (reviewedTierByDriverId.get(driver.id) === tierId) continue
      result.push({ driver, tier })
    }
  }
  return result
}

export function NeedsReviewModal({
  driversBySection,
  reviewedTierByDriverId,
  onSelectDriver,
  onLogNote,
  onClose,
}) {
  const modalRef = useRef(null)
  const drivers = getUrgentDrivers(driversBySection, reviewedTierByDriverId)

  function handleSelectDriver(driverId) {
    onSelectDriver(driverId)
    modalRef.current.close()
  }

  return (
    <Modal
      ref={modalRef}
      titleId="needs-review-heading"
      title="Needs review"
      onClose={onClose}
      widthClassName="w-[min(40rem,92vw)]"
    >
      {drivers.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          Nothing needs review right now.
        </p>
      ) : (
        <ul className="mt-6 flex max-h-[65vh] flex-col divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
          {drivers.map(({ driver, tier }) => (
            <li
              key={driver.id}
              className="flex items-start justify-between gap-6 py-4"
            >
              <div className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDriver(driver.id)}
                  className="block truncate text-left text-sm font-medium underline-offset-2 hover:underline"
                >
                  {driver.name}
                </button>
                <StatusBadge tier={tier} />
              </div>
              <DriverActions
                driver={driver}
                tierId={tier.id}
                onLogNote={onLogNote}
              />
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
