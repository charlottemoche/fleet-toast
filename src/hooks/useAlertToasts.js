import { useEffect, useRef, useState } from 'react'
import { getTierById } from '../data/statusConfig.js'

// pushAlert's `type` must be one of: success, error, critical, warning, info
// — each is a --color-* custom property in src/index.css.
export function useAlertToasts(driversBySection) {
  const previousTierByIdRef = useRef(null)
  const [toasts, setToasts] = useState([])

  function pushAlert(message, type, driver = null) {
    setToasts((current) => [
      ...current,
      { id: `${Date.now()}-${Math.random()}`, driver, message, type },
    ])
  }

  function dismissToast(toastId) {
    setToasts((current) => current.filter((toast) => toast.id !== toastId))
  }

  useEffect(() => {
    const currentTierById = new Map()
    for (const [tierId, drivers] of driversBySection) {
      for (const driver of drivers) {
        currentTierById.set(driver.id, { driver, tierId })
      }
    }

    if (previousTierByIdRef.current !== null) {
      for (const [driverId, { driver, tierId }] of currentTierById) {
        const tier = getTierById(tierId)
        if (!tier.alertMessage) continue

        const previousTierId = previousTierByIdRef.current.get(driverId)?.tierId
        if (previousTierId !== tierId) {
          pushAlert(tier.alertMessage, tier.type, driver)
        }
      }
    }

    previousTierByIdRef.current = currentTierById
  }, [driversBySection])

  return { toasts, pushAlert, dismissToast }
}
