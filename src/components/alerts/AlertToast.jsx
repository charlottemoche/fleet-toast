import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { Timer } from '../shared/Timer.jsx'

export function AlertToast({ driver, now, onDismiss, onSelectDriver }) {
  const { remainingMinutes } = useDriverStatus(driver, now)

  function handleOpen() {
    onSelectDriver(driver.id)
    onDismiss()
  }

  return (
    <div className="flex w-72 items-start gap-3 rounded-lg border-2 border-red-700 bg-white p-3 shadow-lg dark:bg-red-950 dark:text-white">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{driver.name}</p>
        <p className="text-xs">
          {driver.truckId} is now critical —{' '}
          <Timer remainingMinutes={remainingMinutes} /> remaining
        </p>
        <button
          type="button"
          onClick={handleOpen}
          className="mt-1 text-xs font-semibold underline underline-offset-2"
        >
          View driver →
        </button>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-red-700"
      >
        &times;
      </button>
    </div>
  )
}
