import { getTierById } from '../../data/alertConfig.js'
import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { formatEta } from '../../utils/format.js'
import { AlertBadge } from '../alerts/AlertBadge.jsx'
import { Timer } from '../shared/Timer.jsx'

export function DriverRow({ driver, now, onSelectDriver }) {
  const { tierId, remainingMinutes } = useDriverStatus(driver, now)
  const tier = getTierById(tierId)

  return (
    <tr
      className={`${tier.rowClassName} hover:bg-gray-100 dark:hover:bg-gray-800/60`}
    >
      <td className="p-3">
        <button
          type="button"
          onClick={() => onSelectDriver(driver.id)}
          className="font-medium underline-offset-2 hover:underline"
        >
          {driver.name}
        </button>
        <div className="text-sm text-gray-500">{driver.truckId}</div>
      </td>
      <td className="p-3">
        <AlertBadge tier={tier} />
      </td>
      <td className="p-3">
        <Timer remainingMinutes={remainingMinutes} />
      </td>
      <td className="p-3">
        {driver.currentDelivery ? (
          <>
            <div>{driver.currentDelivery.id}</div>
            <div className="text-sm text-gray-500">
              ETA {formatEta(driver.currentDelivery.eta)}
            </div>
          </>
        ) : (
          <span className="text-gray-500">No active delivery</span>
        )}
      </td>
      <td className="p-3">{driver.location.label}</td>
    </tr>
  )
}
