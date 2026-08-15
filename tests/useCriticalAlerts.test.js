import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCriticalAlerts } from '../src/hooks/useCriticalAlerts.js'

const driverA = { id: 'd1', name: 'Marcus Reyes' }
const driverB = { id: 'd2', name: 'Priya Natarajan' }

describe('useCriticalAlerts', () => {
  it('fires no toast for drivers already critical on the first render', () => {
    const { result } = renderHook(
      ({ criticalDrivers }) => useCriticalAlerts(criticalDrivers),
      { initialProps: { criticalDrivers: [driverA] } },
    )

    expect(result.current.toasts).toHaveLength(0)
  })

  it('fires a toast when a driver newly enters the critical list', async () => {
    const { result, rerender } = renderHook(
      ({ criticalDrivers }) => useCriticalAlerts(criticalDrivers),
      { initialProps: { criticalDrivers: [driverA] } },
    )

    await act(async () => {
      rerender({ criticalDrivers: [driverA, driverB] })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].driver).toBe(driverB)
  })

  it('does not refire for a driver that stays critical across renders', async () => {
    const { result, rerender } = renderHook(
      ({ criticalDrivers }) => useCriticalAlerts(criticalDrivers),
      { initialProps: { criticalDrivers: [driverA] } },
    )

    await act(async () => {
      rerender({ criticalDrivers: [driverA] })
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('removes a toast via dismissToast', async () => {
    const { result, rerender } = renderHook(
      ({ criticalDrivers }) => useCriticalAlerts(criticalDrivers),
      { initialProps: { criticalDrivers: [driverA] } },
    )

    await act(async () => {
      rerender({ criticalDrivers: [driverA, driverB] })
    })
    expect(result.current.toasts).toHaveLength(1)

    const toastId = result.current.toasts[0].id
    act(() => {
      result.current.dismissToast(toastId)
    })

    expect(result.current.toasts).toHaveLength(0)
  })
})
