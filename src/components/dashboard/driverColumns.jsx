import { formatEta, formatMinutesRemainingLong } from '../../utils/format.js'
import { StatusBadge } from '../status/StatusBadge.jsx'
import { Timer } from '../shared/Timer.jsx'

export const driverColumns = [
  {
    key: 'driver',
    label: 'Driver',
    headerClassName: 'w-[14%]',
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
    headerClassName: 'w-[18%] lg:w-[14%]',
    cellClassName: 'truncate border-l border-gray-100/80 dark:border-gray-800',
    render: ({ tier }) => <StatusBadge tier={tier} />,
  },
  {
    key: 'timeRemaining',
    label: 'Time remaining',
    headerClassName: 'w-[12%] truncate',
    cellClassName: 'truncate border-l border-gray-100/80 dark:border-gray-800',
    title: ({ remainingMinutes }) =>
      formatMinutesRemainingLong(remainingMinutes),
    render: ({ remainingMinutes }) => (
      <Timer remainingMinutes={remainingMinutes} />
    ),
  },
  {
    key: 'delivery',
    label: 'Delivery',
    headerClassName: 'w-[12%]',
    cellClassName: 'truncate border-l border-gray-100/80 dark:border-gray-800',
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
    headerClassName: 'w-[18%]',
    cellClassName: 'truncate border-l border-gray-100/80 dark:border-gray-800',
    title: ({ driver }) => driver.location.label,
    render: ({ driver }) => driver.location.label,
  },
  {
    key: 'perishable',
    label: 'Perishables',
    headerClassName: 'w-[8%]',
    cellClassName: 'border-l border-gray-100/80 dark:border-gray-800',
    render: ({ driver }) =>
      driver.currentDelivery
        ? driver.currentDelivery.isPerishable
          ? 'Yes'
          : 'No'
        : '—',
  },
  {
    key: 'loads',
    label: 'Loads',
    headerClassName: 'w-[5%]',
    cellClassName: 'border-l border-gray-100/80 dark:border-gray-800',
    render: ({ driver }) => driver.currentDelivery?.loads ?? '—',
  },
  {
    key: 'acknowledged',
    label: 'Acknowledged',
    headerClassName: 'w-[12%]',
    cellClassName:
      'text-center border-l border-gray-100/80 dark:border-gray-800',
    render: ({ isAcknowledged }) =>
      isAcknowledged && (
        <span
          title="Acknowledged"
          aria-label="Acknowledged"
          className="text-lg text-emerald-600 dark:text-emerald-400"
        >
          ✓
        </span>
      ),
  },
]
