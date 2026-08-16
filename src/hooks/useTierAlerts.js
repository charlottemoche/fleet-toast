import { useEffect, useRef, useState } from 'react'
import { getTierById } from '../data/statusConfig.js'

// A tier is "alertable" if it has an alertMessage (statusConfig.js).
// previousTierByIdRef stays null until the effect first runs, which
// distinguishes page load from a real transition.
export function useTierAlerts(driversBySection) {
  const previousTierByIdRef = useRef(null)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const currentTierById = new Map()
    for (const [tierId, drivers] of driversBySection) {
      for (const driver of drivers) {
        currentTierById.set(driver.id, { driver, tierId })
      }
    }

    if (previousTierByIdRef.current !== null) {
      const newAlerts = []
      for (const [driverId, { driver, tierId }] of currentTierById) {
        const tier = getTierById(tierId)
        if (!tier.alertMessage) continue

        const previousTierId = previousTierByIdRef.current.get(driverId)?.tierId
        if (previousTierId !== tierId) {
          newAlerts.push({ id: `${driverId}-${Date.now()}`, driver, tier })
        }
      }

      if (newAlerts.length > 0) {
        setToasts((current) => [...current, ...newAlerts])
      }
    }

    previousTierByIdRef.current = currentTierById
  }, [driversBySection])

  function dismissToast(toastId) {
    setToasts((current) => current.filter((toast) => toast.id !== toastId))
  }

  return { toasts, dismissToast }
}
