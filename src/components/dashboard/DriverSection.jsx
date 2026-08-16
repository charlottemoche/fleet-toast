import { useState } from 'react'
import { driverColumns } from './driverColumns.jsx'
import { DriverRow } from './DriverRow.jsx'

export function DriverSection({
  label,
  collapsible,
  drivers,
  now,
  onSelectDriver,
  acknowledgedIds,
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const showRows = !collapsible || isExpanded
  const isToggleable = collapsible && drivers.length > 0

  return (
    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
      <tr className="bg-gray-100/60 dark:bg-gray-900">
        <th
          scope="rowgroup"
          colSpan={driverColumns.length}
          className="p-0 text-left"
        >
          {isToggleable ? (
            <button
              type="button"
              onClick={() => setIsExpanded((expanded) => !expanded)}
              aria-expanded={isExpanded}
              className="flex w-full items-center justify-between p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800/60"
            >
              <span className="text-sm font-semibold">
                {label}{' '}
                <span className="text-gray-500">({drivers.length})</span>
              </span>
              <span>{isExpanded ? 'Hide' : 'Show'}</span>
            </button>
          ) : (
            <div className="flex items-center justify-between p-3 dark:border-gray-800">
              <span className="text-sm font-semibold">
                {label}{' '}
                <span className="text-gray-500">({drivers.length})</span>
              </span>
            </div>
          )}
        </th>
      </tr>
      {showRows &&
        drivers.map((driver) => (
          <DriverRow
            key={driver.id}
            driver={driver}
            now={now}
            onSelectDriver={onSelectDriver}
            isAcknowledged={acknowledgedIds.has(driver.id)}
          />
        ))}
    </tbody>
  )
}
