import { useState } from 'react'
import { DriverRow } from './DriverRow.jsx'

const COLUMN_COUNT = 5 // driver, status, time remaining, delivery, location — matches DriverRow

export function DriverSection({
  label,
  alwaysExpanded,
  drivers,
  now,
  onSelectDriver,
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const showRows = alwaysExpanded || isExpanded

  return (
    <tbody>
      <tr className="bg-gray-50 dark:bg-gray-900">
        <th scope="rowgroup" colSpan={COLUMN_COUNT} className="p-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">
              {label} <span className="text-gray-500">({drivers.length})</span>
            </span>
            {!alwaysExpanded && drivers.length > 0 && (
              <button
                type="button"
                onClick={() => setIsExpanded((expanded) => !expanded)}
                aria-expanded={isExpanded}
              >
                {isExpanded ? 'Hide' : 'Show'}
              </button>
            )}
          </div>
        </th>
      </tr>
      {showRows &&
        drivers.map((driver) => (
          <DriverRow
            key={driver.id}
            driver={driver}
            now={now}
            onSelectDriver={onSelectDriver}
          />
        ))}
    </tbody>
  )
}
