import { getTierById } from '../../data/statusConfig.js'
import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { driverColumns } from './DriverCols.jsx'

export function DriverRow({ driver, now, onSelectDriver }) {
  const { tierId, remainingMinutes } = useDriverStatus(driver, now)
  const tier = getTierById(tierId)
  const context = {
    driver,
    now,
    onSelectDriver,
    tier,
    remainingMinutes,
  }

  return (
    <tr
      onClick={() => onSelectDriver(driver.id)}
      className={`group cursor-pointer bg-gray-50/10 transition-colors duration-300 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800/60 ${tierId === 'offline' ? 'text-gray-400' : ''}`}
    >
      {driverColumns.map((column) => (
        <td
          key={column.key}
          title={column.title?.(context)}
          className={`overflow-hidden border-b border-gray-100/70 px-3 py-1.5 dark:border-gray-700 ${column.cellClassName ?? ''}`}
        >
          {column.render(context)}
        </td>
      ))}
    </tr>
  )
}
