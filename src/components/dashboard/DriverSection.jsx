import { driverColumns } from './DriverColumns.jsx'
import { DriverRow } from './DriverRow.jsx'

export function DriverSection({ label, drivers, now, onSelectDriver }) {
  return (
    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
      <tr className="relative z-30 bg-gray-50 dark:bg-gray-900">
        <th
          scope="rowgroup"
          colSpan={driverColumns.length}
          aria-label={`${label} (${drivers.length})`}
          className="p-0 text-left"
        >
          <div className="flex items-center justify-between px-3 py-1.5 dark:border-gray-800">
            <span className="text-xs font-semibold">
              {label} <span className="text-gray-500">({drivers.length})</span>
            </span>
          </div>
        </th>
      </tr>
      {drivers.map((driver) => (
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
