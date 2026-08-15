import { getTierById } from '../../data/alertConfig.js'
import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { StatusDot } from '../shared/StatusDot.jsx'
import { Timer } from '../shared/Timer.jsx'

function formatEta(eta) {
  return new Date(eta).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function DriverRow({ driver, now, onSelectDriver }) {
  const { tierId, remainingMinutes } = useDriverStatus(driver, now)
  const tier = getTierById(tierId)

  return (
    <tr className={tier.rowClassName}>
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
        <span className="inline-flex items-center gap-2">
          <StatusDot colorClassName={tier.badgeClassName} />
          {tier.label}
        </span>
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
