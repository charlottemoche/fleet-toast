import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { Timer } from '../shared/Timer.jsx'

export function AlertToast({ driver, tier, now, onDismiss, onSelectDriver }) {
  const { remainingMinutes } = useDriverStatus(driver, now)

  function handleOpen() {
    onSelectDriver(driver.id)
    onDismiss()
  }

  return (
    <div
      className="flex w-72 items-start gap-3 rounded-lg border-2 border-[var(--tier)] bg-white p-3 shadow-lg dark:bg-gray-800 dark:text-white"
      style={{ '--tier': `var(--color-${tier.color})` }}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{driver.name}</p>
        <p className="text-xs">
          {driver.truckId} {tier.alertMessage} —{' '}
          <Timer remainingMinutes={remainingMinutes} /> remaining
        </p>
        <button
          type="button"
          onClick={handleOpen}
          className="mt-3 min-w-40 rounded border border-[var(--tier)] bg-[var(--tier)]/20 px-2 py-1 text-sm transition-colors duration-500 hover:bg-[var(--tier)]/50 dark:bg-[var(--tier)]/20 dark:hover:bg-[var(--tier)]/30"
        >
          View driver →
        </button>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-[var(--tier)]"
      >
        &times;
      </button>
    </div>
  )
}
