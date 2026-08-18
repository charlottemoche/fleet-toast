import { minutesSincePing } from '../../utils/hos.js'
import {
  formatEta,
  formatMinutesAgo,
  formatMinutesRemainingLong,
} from '../../utils/format.js'
import { StatusBadge } from '../status/StatusBadge.jsx'
import { Timer } from '../shared/Timer.jsx'

export const driverColumns = [
  {
    key: 'driver',
    label: 'Driver',
    headerClassName:
      'sticky left-0 z-20 w-[14%] bg-gray-100 dark:border-gray-800 dark:bg-gray-950',
    cellClassName:
      'sticky left-0 z-10 shadow dark:border-gray-800 bg-white group-hover:bg-gray-100 dark:bg-gray-900 dark:group-hover:bg-gray-800 transition-colors duration-300',
    render: ({ driver, onSelectDriver }) => (
      <>
        <button
          type="button"
          onClick={() => onSelectDriver(driver.id)}
          title={driver.name}
          className="block w-full truncate text-left font-medium underline-offset-2"
        >
          {driver.name}
        </button>
        <div className="truncate text-sm text-gray-500">{driver.truckId}</div>
      </>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    headerClassName: 'w-[18%] lg:w-[12%]',
    cellClassName: 'truncate border-r border-gray-100/80 dark:border-gray-800',
    render: ({ tier }) => <StatusBadge tier={tier} />,
  },
  {
    key: 'timeRemaining',
    label: 'Time remaining',
    headerClassName: 'w-[12%] truncate',
    cellClassName: 'truncate border-r border-gray-100/80 dark:border-gray-800',
    title: ({ remainingMinutes }) =>
      formatMinutesRemainingLong(remainingMinutes),
    render: ({ remainingMinutes }) => (
      <Timer remainingMinutes={remainingMinutes} />
    ),
  },
  {
    key: 'lastPing',
    label: 'Last ping',
    headerClassName: 'w-[10%] truncate',
    cellClassName: 'truncate border-r border-gray-100/80 dark:border-gray-800',
    render: ({ driver, now }) =>
      formatMinutesAgo(minutesSincePing(driver.lastPing, now)),
  },
  {
    key: 'delivery',
    label: 'Delivery',
    headerClassName: 'w-[14%]',
    cellClassName: 'truncate border-r border-gray-100/80 dark:border-gray-800',
    render: ({ driver }) =>
      driver.currentDelivery ? (
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
      ),
  },
  {
    key: 'location',
    label: 'Location',
    headerClassName: 'w-[20%]',
    cellClassName: 'truncate border-r border-gray-100/80 dark:border-gray-800',
    title: ({ driver }) => driver.location.label,
    render: ({ driver }) => driver.location.label,
  },
  {
    key: 'logs',
    label: 'Logs',
    headerClassName: 'w-[16%]',
    cellClassName: 'truncate dark:border-gray-800',
    title: ({ driver }) => driver.logs.map((log) => log.message).join(' · '),
    render: ({ driver }) => {
      if (driver.logs.length === 0) {
        return <span className="text-gray-500">—</span>
      }
      const latest = driver.logs[driver.logs.length - 1]
      return (
        <>
          <div className="truncate">{latest.message}</div>
          {driver.logs.length > 1 && (
            <div className="text-sm text-gray-500">
              +{driver.logs.length - 1} more
            </div>
          )}
        </>
      )
    },
  },
]
