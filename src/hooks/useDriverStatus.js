import { useMemo } from 'react'
import { statusConfig } from '../data/statusConfig.js'
import { getDriverStatus } from '../utils/hos.js'

export function useDriverStatus(driver, now) {
  return useMemo(
    () => getDriverStatus(driver, now, statusConfig),
    [driver, now],
  )
}
