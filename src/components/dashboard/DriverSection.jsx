import { useState } from 'react'
import { DriverRow } from './DriverRow.jsx'

const COLUMN_COUNT = 6 // driver, status, time remaining, delivery, location, acknowledged — matches DriverRow

export function DriverSection({
  label,
  alwaysExpanded,
  drivers,
  now,
  onSelectDriver,
  acknowledgedIds,
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const showRows = alwaysExpanded || isExpanded
  const isToggleable = !alwaysExpanded && drivers.length > 0

  return (
    <tbody>
      <tr className="bg-gray-50 dark:bg-[#1A1A1A]">
        <th scope="rowgroup" colSpan={COLUMN_COUNT} className="p-0 text-left">
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
            <div className="flex items-center justify-between border-b border-gray-100 p-3 dark:border-gray-800">
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
