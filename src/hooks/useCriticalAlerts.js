import { useEffect, useRef, useState } from 'react'

// Fires a toast only on the transition into critical, not for drivers who
// are already critical when this first runs — that's existing state, not
// an event. previousIdsRef stays null until the effect has run once, which
// is what distinguishes "page just loaded" from a real transition.
export function useCriticalAlerts(criticalDrivers) {
  const previousIdsRef = useRef(null)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const currentIds = new Set(criticalDrivers.map((driver) => driver.id))

    if (previousIdsRef.current !== null) {
      const newlyCritical = criticalDrivers.filter(
        (driver) => !previousIdsRef.current.has(driver.id),
      )

      if (newlyCritical.length > 0) {
        setToasts((current) => [
          ...current,
          ...newlyCritical.map((driver) => ({
            id: `${driver.id}-${Date.now()}`,
            driver,
          })),
        ])
      }
    }

    previousIdsRef.current = currentIds
  }, [criticalDrivers])

  function dismissToast(toastId) {
    setToasts((current) => current.filter((toast) => toast.id !== toastId))
  }

  return { toasts, dismissToast }
}
