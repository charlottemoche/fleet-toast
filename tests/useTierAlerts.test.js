import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTierAlerts } from '../src/hooks/useTierAlerts.js'

const driverA = { id: 'd1', name: 'Marcus Reyes' }
const driverB = { id: 'd2', name: 'Priya Natarajan' }
const testTier = { id: 'critical', alertMessage: 'is now critical' }

describe('useTierAlerts', () => {
  it('fires no toast for drivers already in the tier on the first render', () => {
    const { result } = renderHook(
      ({ drivers }) => useTierAlerts(drivers, testTier),
      { initialProps: { drivers: [driverA] } },
    )

    expect(result.current.toasts).toHaveLength(0)
  })

  it('fires a toast when a driver newly enters the tier', async () => {
    const { result, rerender } = renderHook(
      ({ drivers }) => useTierAlerts(drivers, testTier),
      { initialProps: { drivers: [driverA] } },
    )

    await act(async () => {
      rerender({ drivers: [driverA, driverB] })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].driver).toBe(driverB)
    expect(result.current.toasts[0].tier).toBe(testTier)
  })

  it('does not refire for a driver that stays in the tier across renders', async () => {
    const { result, rerender } = renderHook(
      ({ drivers }) => useTierAlerts(drivers, testTier),
      { initialProps: { drivers: [driverA] } },
    )

    await act(async () => {
      rerender({ drivers: [driverA] })
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('removes a toast via dismissToast', async () => {
    const { result, rerender } = renderHook(
      ({ drivers }) => useTierAlerts(drivers, testTier),
      { initialProps: { drivers: [driverA] } },
    )

    await act(async () => {
      rerender({ drivers: [driverA, driverB] })
    })
    expect(result.current.toasts).toHaveLength(1)

    const toastId = result.current.toasts[0].id
    act(() => {
      result.current.dismissToast(toastId)
    })

    expect(result.current.toasts).toHaveLength(0)
  })
})
