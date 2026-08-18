import { getTierById } from '../../data/statusConfig.js'
import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { minutesSincePing } from '../../utils/hos.js'
import {
  formatEta,
  formatMinutesAgo,
  formatMinutesRemainingLong,
} from '../../utils/format.js'
import { StatusBadge } from '../status/StatusBadge.jsx'
import { Timer } from '../shared/Timer.jsx'

export function DriverRow({ driver, now, onSelectDriver }) {
  const { tierId, remainingMinutes } = useDriverStatus(driver, now)
  const tier = getTierById(tierId)
  const latestLog =
    driver.logs.length > 0 ? driver.logs[driver.logs.length - 1] : null

  return (
    <tr
      onClick={() => onSelectDriver(driver.id)}
      className={`group cursor-pointer bg-gray-50/10 transition-colors duration-300 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800/60 ${tierId === 'offline' ? 'text-gray-400' : ''}`}
    >
      <td className="sticky left-0 z-10 overflow-hidden border-b border-gray-100/70 bg-white px-3 py-1.5 shadow transition-colors duration-300 group-hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:group-hover:bg-gray-800">
        <button
          type="button"
          onClick={() => onSelectDriver(driver.id)}
          title={driver.name}
          className="block w-full truncate text-left font-medium underline-offset-2"
        >
          {driver.name}
        </button>
        <div className="truncate text-sm text-gray-500">{driver.truckId}</div>
      </td>

      <td className="truncate overflow-hidden border-r border-b border-gray-100/80 px-3 py-1.5 dark:border-gray-800">
        <StatusBadge tier={tier} />
      </td>

      <td
        title={formatMinutesRemainingLong(remainingMinutes)}
        className="truncate overflow-hidden border-r border-b border-gray-100/80 px-3 py-1.5 dark:border-gray-800"
      >
        <Timer remainingMinutes={remainingMinutes} />
      </td>

      <td className="truncate overflow-hidden border-r border-b border-gray-100/80 px-3 py-1.5 dark:border-gray-800">
        {formatMinutesAgo(minutesSincePing(driver.lastPing, now))}
      </td>

      <td className="truncate overflow-hidden border-r border-b border-gray-100/80 px-3 py-1.5 dark:border-gray-800">
        {driver.currentDelivery ? (
          <>
            <div title={driver.currentDelivery.id} className="truncate">
              {driver.currentDelivery.id}
            </div>
            <div className="text-sm text-gray-500">
              ETA {formatEta(driver.currentDelivery.eta)}
            </div>
          </>
        ) : (
          <span className="text-gray-500">No active delivery</span>
        )}
      </td>

      <td
        title={driver.location.label}
        className="truncate overflow-hidden border-r border-b border-gray-100/80 px-3 py-1.5 dark:border-gray-800"
      >
        {driver.location.label}
      </td>

      <td
        title={driver.logs.map((log) => log.message).join(' · ')}
        className="truncate overflow-hidden border-b border-gray-100/70 px-3 py-1.5 dark:border-gray-700"
      >
        {latestLog ? (
          <>
            <div className="truncate">{latestLog.message}</div>
            {driver.logs.length > 1 && (
              <div className="text-sm text-gray-500">
                +{driver.logs.length - 1} more
              </div>
            )}
          </>
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </td>
    </tr>
  )
}
