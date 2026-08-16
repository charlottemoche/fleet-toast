import { useEffect, useRef, useState } from 'react'
import { getTierById } from '../../data/statusConfig.js'
import { useClockTick } from '../../hooks/useClockTick.js'
import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { minutesSincePing } from '../../utils/hos.js'
import { formatEta, formatMinutesAgo } from '../../utils/format.js'
import { StatusBadge } from '../status/StatusBadge.jsx'
import { Timer } from '../shared/Timer.jsx'

// Faster than the dashboard's own tick, since only one driver is being
// watched here — the countdown should visibly move while this is open.
const DRILL_IN_TICK_INTERVAL_MS = 1_000

export function DriverDrillIn({
  driver,
  onClose,
  isAcknowledged,
  onToggleAcknowledged,
}) {
  const dialogRef = useRef(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const now = useClockTick(DRILL_IN_TICK_INTERVAL_MS)
  const { tierId, remainingMinutes } = useDriverStatus(driver, now)
  const tier = getTierById(tierId)

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
        {driver.location && (
          <div className="mt-4 h-60 w-full overflow-hidden rounded border border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-800">
            <iframe
              title="Driver location map"
              src={`https://www.google.com/maps?q=${driver.location.lat},${driver.location.lng}&z=15&output=embed`}
              onLoad={() => setIsMapLoaded(true)}
              className={`h-full w-full rounded transition-opacity duration-500 ${isMapLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
        )}
        <dl className="mt-4 grid grid-cols-3 gap-y-3 text-sm">
          <dt className="text-gray-500">Truck</dt>
          <dd className="col-span-2">{driver.truckId}</dd>

          <dt className="text-gray-500">Status</dt>
          <dd className="col-span-2">
            <StatusBadge tier={tier} />
          </dd>

          <dt className="text-gray-500">Last ping</dt>
          <dd className="col-span-2">
            {formatMinutesAgo(minutesSincePing(driver.lastPing, now))}
          </dd>

          <dt className="text-gray-500">HOS remaining</dt>
          <dd className="col-span-2">
            <Timer remainingMinutes={remainingMinutes} />
          </dd>

          <dt className="text-gray-500">Location</dt>
          <dd className="col-span-2">{driver.location.label}</dd>

          <dt className="text-gray-500">Delivery</dt>
          <dd className="col-span-2">
            {driver.currentDelivery
              ? `${driver.currentDelivery.id} — ETA ${formatEta(driver.currentDelivery.eta)}`
              : 'No active delivery'}
          </dd>

          {driver.currentDelivery && (
            <>
              <dt className="text-gray-500">Cargo</dt>
              <dd className="col-span-2">
                {driver.currentDelivery.loads}{' '}
                {driver.currentDelivery.loads === 1 ? 'load' : 'loads'} ·{' '}
                {driver.currentDelivery.isPerishable
                  ? 'Perishable'
                  : 'Non-perishable'}
              </dd>
            </>
          )}
        </dl>
        <div className="mt-4 flex gap-2 lg:mt-6">
          <a
            href={`tel:${driver.phone}`}
            className="flex-1 rounded bg-gray-800 p-2 text-center text-sm font-medium text-white transition-colors duration-500 hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white"
          >
            Call driver ({driver.phone})
          </a>
          {(tierId === 'critical' || tierId === 'violation') && (
            <button
              type="button"
              onClick={onToggleAcknowledged}
              className={
                isAcknowledged
                  ? 'rounded px-3 text-sm font-medium text-emerald-700 dark:text-emerald-400'
                  : 'rounded bg-[var(--color-action)]/80 px-3 text-sm font-medium text-white transition-colors duration-500 hover:bg-[var(--color-action)]'
              }
            >
              {isAcknowledged ? '✓ Acknowledged' : 'Acknowledge'}
            </button>
          )}
        </div>
      </div>
    </dialog>
  )
}
