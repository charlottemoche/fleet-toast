import { getTierById } from '../../data/statusConfig.js'
import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { formatEta, formatMinutesRemainingLong } from '../../utils/format.js'
import { StatusBadge } from '../status/StatusBadge.jsx'
import { Timer } from '../shared/Timer.jsx'

export function DriverRow({ driver, now, onSelectDriver }) {
  const { tierId, remainingMinutes } = useDriverStatus(driver, now)
  const tier = getTierById(tierId)

  return (
    <tr
      className={`${tier.rowClassName} hover:bg-gray-100 dark:hover:bg-gray-800/60`}
    >
      <td className="overflow-hidden p-3">
        <button
          type="button"
          onClick={() => onSelectDriver(driver.id)}
          title={driver.name}
          className="block w-full truncate text-left font-medium underline-offset-2 hover:underline"
        >
          {driver.name}
        </button>
        <div className="truncate text-sm text-gray-500">{driver.truckId}</div>
      </td>
      <td className="overflow-hidden p-3">
        <StatusBadge tier={tier} />
      </td>
      <td
        title={formatMinutesRemainingLong(remainingMinutes)}
        className="truncate overflow-hidden p-3"
      >
        <Timer remainingMinutes={remainingMinutes} />
      </td>
      <td className="overflow-hidden p-3">
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
        className="truncate overflow-hidden p-3"
      >
        {driver.location.label}
      </td>
    </tr>
  )
}
