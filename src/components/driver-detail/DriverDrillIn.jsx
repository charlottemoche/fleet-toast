import { useEffect, useRef } from 'react'
import { getTierById } from '../../data/statusConfig.js'
import { useClockTick } from '../../hooks/useClockTick.js'
import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { formatEta } from '../../utils/format.js'
import { StatusBadge } from '../status/StatusBadge.jsx'
import { Timer } from '../shared/Timer.jsx'

// Faster than the dashboard's own tick, since only one driver is being
// watched here — the countdown should visibly move while this is open.
const DRILL_IN_TICK_INTERVAL_MS = 1_000

export function DriverDrillIn({ driver, onClose }) {
  const dialogRef = useRef(null)
  const now = useClockTick(DRILL_IN_TICK_INTERVAL_MS)
  const { tierId, remainingMinutes } = useDriverStatus(driver, now)
  const tier = getTierById(tierId)

  // Mount-only: this component only exists while a driver is selected, so
  // mounting is opening. Runs once — never re-fires when onClose changes.
  // Backdrop-click-to-close is wired here too (imperatively, not as a JSX
  // onClick) since <dialog> has the ARIA "window" role, not a widget role —
  // it isn't an interactive element, so this shouldn't be a JSX click prop.
  useEffect(() => {
    const dialog = dialogRef.current

    function closeIfBackdropClicked(event) {
      if (event.target === dialog) {
        dialog.close()
      }
    }

    dialog.showModal()
    dialog.addEventListener('click', closeIfBackdropClicked)
    return () => dialog.removeEventListener('click', closeIfBackdropClicked)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.addEventListener('close', onClose)
    return () => dialog.removeEventListener('close', onClose)
  }, [onClose])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="driver-drill-in-heading"
      className="fixed inset-0 m-auto rounded-lg p-0 backdrop:bg-black/50"
    >
      <div className="w-[min(28rem,90vw)] p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="driver-drill-in-heading" className="text-lg font-semibold">
            {driver.name}
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current.close()}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
          <dt className="text-gray-500">Truck</dt>
          <dd>{driver.truckId}</dd>

          <dt className="text-gray-500">Status</dt>
          <dd>
            <StatusBadge tier={tier} />
          </dd>

          <dt className="text-gray-500">HOS remaining</dt>
          <dd>
            <Timer remainingMinutes={remainingMinutes} />
          </dd>

          <dt className="text-gray-500">Location</dt>
          <dd>{driver.location.label}</dd>

          <dt className="text-gray-500">Delivery</dt>
          <dd>
            {driver.currentDelivery
              ? `${driver.currentDelivery.id} — ETA ${formatEta(driver.currentDelivery.eta)}`
              : 'No active delivery'}
          </dd>
        </dl>
      </div>
    </dialog>
  )
}
