import { useState } from 'react'
import { getTierById } from '../../data/statusConfig.js'
import { getTruckById } from '../../data/trucks.js'
import { useClockTick } from '../../hooks/useClockTick.js'
import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { minutesSincePing } from '../../utils/hos.js'
import { formatEta, formatMinutesAgo } from '../../utils/format.js'
import { StatusBadge } from '../status/StatusBadge.jsx'
import { Timer } from '../shared/Timer.jsx'
import { Modal } from '../shared/Modal.jsx'

// Faster than the dashboard's own tick, since only one driver is being
// watched here — the countdown should visibly move while this is open.
const DRILL_IN_TICK_INTERVAL_MS = 1_000

export function DriverDrillIn({ driver, onClose }) {
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const now = useClockTick(DRILL_IN_TICK_INTERVAL_MS)
  const { tierId, remainingMinutes } = useDriverStatus(driver, now)
  const tier = getTierById(tierId)
  const truck = getTruckById(driver.truckId)

  return (
    <Modal
      titleId="driver-drill-in-heading"
      title={driver.name}
      onClose={onClose}
      widthClassName="w-[min(28rem,90vw)]"
    >
      {driver.location && (
        <div className="mt-4 h-48 w-full overflow-hidden rounded border border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-800">
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
        <dd className="col-span-2">
          {driver.truckId}
          {truck && ` — ${truck.year} ${truck.make} ${truck.model}`}
        </dd>

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
      <div className="mt-4 lg:mt-6">
        <h3 className="text-sm font-semibold">Logs</h3>
        {driver.logs.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No logged activity.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {driver.logs.map((log) => (
              <li key={log.timestamp} className="text-sm">
                <span className="text-gray-500">
                  {formatMinutesAgo(minutesSincePing(log.timestamp, now))}
                </span>{' '}
                — {log.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-4 flex gap-2 lg:mt-6">
        <a
          href={`tel:${driver.phone}`}
          className="bg-brand flex-1 rounded p-2 text-center text-sm font-medium text-white transition-colors duration-500 hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white"
        >
          Call driver ({driver.phone})
        </a>
      </div>
    </Modal>
  )
}
