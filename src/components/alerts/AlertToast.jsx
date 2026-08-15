import { useEffect } from 'react'
import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { Timer } from '../shared/Timer.jsx'

const AUTO_DISMISS_MS = 10_000

export function AlertToast({ driver, now, onDismiss }) {
  const { remainingMinutes } = useDriverStatus(driver, now)

  // Mount-only: onDismiss is a fresh closure every render (it's bound to
  // this toast's id up in AlertToastStack), but it always does the same
  // thing, so the timer only needs to start once and doesn't need it in
  // the dependency array.
  useEffect(() => {
    const timeoutId = setTimeout(onDismiss, AUTO_DISMISS_MS)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex w-72 items-start gap-3 rounded-lg border border-red-800 bg-red-950 p-3 text-white shadow-lg">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{driver.name}</p>
        <p className="text-xs text-red-200">
          {driver.truckId} is now critical —{' '}
          <Timer remainingMinutes={remainingMinutes} /> remaining
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-red-300 hover:text-white"
      >
        &times;
      </button>
    </div>
  )
}
