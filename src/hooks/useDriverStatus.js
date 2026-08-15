import { useMemo } from 'react'
import { statusConfig as defaultStatusConfig } from '../data/statusConfig.js'
import { getDriverStatus } from '../utils/hos.js'

export function useDriverStatus(driver, now, config = defaultStatusConfig) {
  return useMemo(
    () => getDriverStatus(driver, now, config),
    [driver, now, config],
  )
}
