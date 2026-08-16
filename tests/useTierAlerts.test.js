import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTierAlerts } from '../src/hooks/useTierAlerts.js'

const driverA = { id: 'd1', name: 'Marcus Reyes' }
const driverB = { id: 'd2', name: 'Priya Natarajan' }

function bySection(entries) {
  return new Map(entries)
}

describe('useTierAlerts', () => {
  it('fires no toast for a driver already in an alertable tier on the first render', () => {
    const { result } = renderHook(
      ({ driversBySection }) => useTierAlerts(driversBySection),
      {
        initialProps: {
          driversBySection: bySection([['critical', [driverA]]]),
        },
      },
    )

    expect(result.current.toasts).toHaveLength(0)
  })

  it('fires a toast when a driver newly enters an alertable tier', async () => {
    const { result, rerender } = renderHook(
      ({ driversBySection }) => useTierAlerts(driversBySection),
      {
        initialProps: {
          driversBySection: bySection([['critical', [driverA]]]),
        },
      },
    )

    await act(async () => {
      rerender({
        driversBySection: bySection([['critical', [driverA, driverB]]]),
      })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].driver).toBe(driverB)
    expect(result.current.toasts[0].tier.id).toBe('critical')
  })

  it('does not refire for a driver that stays in the same tier across renders', async () => {
    const { result, rerender } = renderHook(
      ({ driversBySection }) => useTierAlerts(driversBySection),
      {
        initialProps: {
          driversBySection: bySection([['critical', [driverA]]]),
        },
      },
    )

    await act(async () => {
      rerender({ driversBySection: bySection([['critical', [driverA]]]) })
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('fires again when a driver escalates from one alertable tier to a more urgent one', async () => {
    const { result, rerender } = renderHook(
      ({ driversBySection }) => useTierAlerts(driversBySection),
      {
        initialProps: {
          driversBySection: bySection([['critical', [driverA]]]),
        },
      },
    )

    await act(async () => {
      rerender({ driversBySection: bySection([['violation', [driverA]]]) })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].tier.id).toBe('violation')
  })

  it('does not fire when a driver moves to a tier with no alertMessage', async () => {
    const { result, rerender } = renderHook(
      ({ driversBySection }) => useTierAlerts(driversBySection),
      {
        initialProps: {
          driversBySection: bySection([['critical', [driverA]]]),
        },
      },
    )

    await act(async () => {
      rerender({ driversBySection: bySection([['approaching', [driverA]]]) })
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('removes a toast via dismissToast', async () => {
    const { result, rerender } = renderHook(
      ({ driversBySection }) => useTierAlerts(driversBySection),
      {
        initialProps: {
          driversBySection: bySection([['critical', [driverA]]]),
        },
      },
    )

    await act(async () => {
      rerender({
        driversBySection: bySection([['critical', [driverA, driverB]]]),
      })
    })
    expect(result.current.toasts).toHaveLength(1)

    const toastId = result.current.toasts[0].id
    act(() => {
      result.current.dismissToast(toastId)
    })

    expect(result.current.toasts).toHaveLength(0)
  })
})
