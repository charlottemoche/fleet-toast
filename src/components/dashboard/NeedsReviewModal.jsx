import { useRef } from 'react'
import { getTierById } from '../../data/statusConfig.js'
import { StatusBadge } from '../status/StatusBadge.jsx'
import { Modal } from '../shared/Modal.jsx'

function getUrgentDrivers(driversBySection) {
  const result = []
  for (const [tierId, drivers] of driversBySection) {
    const tier = getTierById(tierId)
    if (!tier.alertMessage) continue
    for (const driver of drivers) {
      result.push({ driver, tier })
    }
  }
  return result
}

export function NeedsReviewModal({
  driversBySection,
  onSelectDriver,
  onClose,
}) {
  const modalRef = useRef(null)
  const drivers = getUrgentDrivers(driversBySection)

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
      widthClassName="w-[min(24rem,90vw)]"
    >
      {drivers.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          Nothing needs review right now.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {drivers.map(({ driver, tier }) => (
            <li
              key={driver.id}
              className="flex items-center justify-between gap-3 py-2"
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
              <a
                href={`tel:${driver.phone}`}
                aria-label={`Call ${driver.name}`}
                className="shrink-0 rounded bg-gray-800 px-3 py-1.5 text-sm font-medium text-white dark:bg-gray-200 dark:text-gray-900"
              >
                Call
              </a>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
