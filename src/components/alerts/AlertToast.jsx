import { useState } from 'react'
import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { Timer } from '../shared/Timer.jsx'

const TOAST_OUT_DURATION_MS = 200

export function AlertToast({ driver, tier, now, onDismiss, onSelectDriver }) {
  const { remainingMinutes } = useDriverStatus(driver, now)
  const [isExiting, setIsExiting] = useState(false)

  function dismiss() {
    setIsExiting(true)
    setTimeout(onDismiss, TOAST_OUT_DURATION_MS)
  }

  function handleOpen() {
    onSelectDriver(driver.id)
    dismiss()
  }

  return (
    <div
      className={`flex w-72 items-start gap-3 rounded-lg border-3 border-[var(--tier)] bg-white p-3 shadow-lg dark:bg-gray-800 dark:text-white ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}
      style={{ '--tier': `var(--color-${tier.color})` }}
    >
      <div className="my-auto shrink-0">
        <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--tier)]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{driver.name}</p>
        <p className="text-xs">
          {driver.truckId} {tier.alertMessage} —{' '}
          <Timer remainingMinutes={remainingMinutes} /> remaining
        </p>
        <button
          type="button"
          onClick={handleOpen}
          className="mt-3 h-9 rounded border bg-white px-2 py-1 text-sm font-medium transition-colors duration-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-900"
        >
          View driver →
        </button>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 text-[var(--tier)]"
      >
        &times;
      </button>
    </div>
  )
}
