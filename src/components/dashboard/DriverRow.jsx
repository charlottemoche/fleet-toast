import { getTierById } from '../../data/statusConfig.js'
import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { driverColumns } from './driverColumns.jsx'

export function DriverRow({ driver, now, onSelectDriver, isAcknowledged }) {
  const { tierId, remainingMinutes } = useDriverStatus(driver, now)
  const tier = getTierById(tierId)
  const context = {
    driver,
    now,
    onSelectDriver,
    isAcknowledged,
    tier,
    remainingMinutes,
  }

  return (
    <tr
      onClick={() => onSelectDriver(driver.id)}
      className={`cursor-pointer bg-gray-50/10 transition-colors duration-300 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800/60 ${tierId === 'offline' ? 'text-gray-400' : ''}`}
    >
      {driverColumns.map((column) => (
        <td
          key={column.key}
          title={column.title?.(context)}
          className={`overflow-hidden p-3 ${column.cellClassName ?? ''}`}
        >
          {column.render(context)}
        </td>
      ))}
    </tr>
  )
}
