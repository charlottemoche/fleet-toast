import { useState } from 'react'
import { useDriverStatus } from '../../hooks/useDriverStatus.js'
import { Timer } from '../shared/Timer.jsx'

const TOAST_OUT_DURATION_MS = 200

function DriverAlertDetails({ driver, message, now, onOpen }) {
  const { remainingMinutes } = useDriverStatus(driver, now)

  return (
    <>
      <p className="truncate text-sm font-semibold">{driver.name}</p>
      <p className="mt-1 text-xs">
        {driver.truckId} {message} —{' '}
        <Timer remainingMinutes={remainingMinutes} /> remaining
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="h-7 text-sm font-medium text-gray-700 underline underline-offset-4 transition-colors duration-300 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
      >
        View driver →
      </button>
    </>
  )
}

export function AlertToast({
  driver,
  message,
  color,
  now,
  onDismiss,
  onSelectDriver,
}) {
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
      className={`flex w-72 items-start gap-3 rounded-lg border-3 border-[var(--tier)] bg-white px-2 py-1 shadow-lg dark:bg-gray-800 dark:text-white ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}
      style={{ '--tier': `var(--color-${color})` }}
    >
      <div className="my-auto shrink-0">
        <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--tier)]" />
      </div>
      <div className="min-w-0 flex-1">
        {driver ? (
          <DriverAlertDetails
            driver={driver}
            message={message}
            now={now}
            onOpen={handleOpen}
          />
        ) : (
          <p className="mt-1 text-xs">{message}</p>
        )}
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
