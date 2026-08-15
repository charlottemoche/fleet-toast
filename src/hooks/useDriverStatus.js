import { useMemo } from 'react'
import { alertConfig as defaultAlertConfig } from '../data/alertConfig.js'
import { getDriverStatus } from '../utils/hos.js'

export function useDriverStatus(driver, now, config = defaultAlertConfig) {
  return useMemo(
    () => getDriverStatus(driver, now, config),
    [driver, now, config],
  )
}
