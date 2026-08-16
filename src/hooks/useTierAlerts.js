import { useEffect, useRef, useState } from 'react'

// Fires a toast only on the transition into this tier, not for drivers who
// are already in it when this first runs — that's existing state, not an
// event. previousIdsRef stays null until the effect has run once, which is
// what distinguishes "page just loaded" from a real transition.
export function useTierAlerts(drivers, tier) {
  const previousIdsRef = useRef(null)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const currentIds = new Set(drivers.map((driver) => driver.id))

    if (previousIdsRef.current !== null) {
      const newlyEntered = drivers.filter(
        (driver) => !previousIdsRef.current.has(driver.id),
      )

      if (newlyEntered.length > 0) {
        setToasts((current) => [
          ...current,
          ...newlyEntered.map((driver) => ({
            id: `${driver.id}-${Date.now()}`,
            driver,
            tier,
          })),
        ])
      }
    }

    previousIdsRef.current = currentIds
  }, [drivers, tier])

  function dismissToast(toastId) {
    setToasts((current) => current.filter((toast) => toast.id !== toastId))
  }

  return { toasts, dismissToast }
}
