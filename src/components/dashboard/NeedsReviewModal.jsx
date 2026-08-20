import { useRef, useState } from 'react'
import { getTierById } from '../../data/statusConfig.js'
import { StatusBadge } from '../status/StatusBadge.jsx'
import { Modal } from '../shared/Modal.jsx'

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
  const [openNoteDriverId, setOpenNoteDriverId] = useState(null)
  const [noteText, setNoteText] = useState('')

  function handleSelectDriver(driverId) {
    onSelectDriver(driverId)
    modalRef.current.close()
  }

  function toggleNote(driverId) {
    setOpenNoteDriverId((current) => (current === driverId ? null : driverId))
    setNoteText('')
  }

  function submitNote(event, driverId, tierId) {
    event.preventDefault()
    const trimmed = noteText.trim()
    if (!trimmed) return
    onLogNote(driverId, tierId, trimmed)
    setOpenNoteDriverId(null)
    setNoteText('')
  }

  return (
    <Modal
      ref={modalRef}
      titleId="needs-review-heading"
      title="Needs review"
      onClose={onClose}
      widthClassName="max-w-4xl"
    >
      {drivers.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          Nothing needs review right now.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {drivers.map(({ driver, tier }) => (
            <li key={driver.id} className="flex flex-col gap-2 py-2">
              <div className="flex items-center justify-between gap-3">
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
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={`tel:${driver.phone}`}
                    aria-label={`Ping ${driver.name}`}
                    className="bg-brand rounded px-5 py-1.5 text-sm font-medium text-white dark:bg-gray-200 dark:text-gray-900"
                  >
                    Ping
                  </a>
                  <button
                    type="button"
                    aria-expanded={openNoteDriverId === driver.id}
                    onClick={() => toggleNote(driver.id)}
                    className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors duration-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    Log note
                  </button>
                </div>
              </div>
              {openNoteDriverId === driver.id && (
                <form
                  onSubmit={(event) => submitNote(event, driver.id, tier.id)}
                  className="flex gap-2"
                >
                  <input
                    value={noteText}
                    onChange={(event) => setNoteText(event.target.value)}
                    placeholder="What did you do about this?"
                    aria-label={`Note for ${driver.name}`}
                    className="h-8 min-w-0 flex-1 rounded border border-gray-300 px-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                  />
                  <button
                    type="submit"
                    disabled={!noteText.trim()}
                    className="shrink-0 rounded bg-gray-800 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-gray-200 dark:text-gray-900"
                  >
                    Log
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
