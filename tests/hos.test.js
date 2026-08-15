import { describe, expect, it } from 'vitest'
import {
  HOS_LIMIT_MINUTES,
  getDriverStatus,
  groupDriversBySection,
  isStale,
  minutesRemaining,
  minutesSincePing,
  resolveStatusTier,
} from '../src/utils/hos.js'

const NOW = new Date('2026-08-15T12:00:00.000Z').getTime()

function minutesBeforeNow(minutes) {
  return new Date(NOW - minutes * 60_000).toISOString()
}

const testTiers = [
  { id: 'critical', maxMinutesRemaining: 20 },
  { id: 'approaching', maxMinutesRemaining: 120 },
  { id: 'on-track', maxMinutesRemaining: Infinity },
]
const testOfflineTier = { id: 'offline' }
const testConfig = {
  statusTiers: testTiers,
  offlineTier: testOfflineTier,
  staleAfterMinutes: 10,
}

describe('minutesRemaining', () => {
  it('subtracts elapsed shift time from the HOS limit', () => {
    const shiftStart = minutesBeforeNow(60)
    expect(minutesRemaining(shiftStart, NOW)).toBe(HOS_LIMIT_MINUTES - 60)
  })

  it('clamps at zero once the shift has exceeded the HOS limit', () => {
    const shiftStart = minutesBeforeNow(HOS_LIMIT_MINUTES + 30)
    expect(minutesRemaining(shiftStart, NOW)).toBe(0)
  })
})

describe('minutesSincePing', () => {
  it('returns elapsed minutes since the last ping', () => {
    expect(minutesSincePing(minutesBeforeNow(5), NOW)).toBe(5)
  })
})

describe('isStale', () => {
  it('is false when the last ping is within the staleness window', () => {
    expect(isStale(minutesBeforeNow(5), NOW, 10)).toBe(false)
  })

  it('is true once the last ping exceeds the staleness window', () => {
    expect(isStale(minutesBeforeNow(15), NOW, 10)).toBe(true)
  })

  it('treats the exact staleness boundary as stale', () => {
    expect(isStale(minutesBeforeNow(10), NOW, 10)).toBe(true)
  })
})

describe('resolveStatusTier', () => {
  it('picks the first tier whose ceiling covers the remaining minutes', () => {
    expect(resolveStatusTier(12, testTiers).id).toBe('critical')
    expect(resolveStatusTier(90, testTiers).id).toBe('approaching')
    expect(resolveStatusTier(400, testTiers).id).toBe('on-track')
  })
})

describe('groupDriversBySection', () => {
  it('sorts drivers within a section by ascending time remaining, most urgent first', () => {
    const drivers = [
      {
        id: 'a',
        shiftStart: minutesBeforeNow(HOS_LIMIT_MINUTES - 17),
        lastPing: minutesBeforeNow(1),
      },
      {
        id: 'b',
        shiftStart: minutesBeforeNow(HOS_LIMIT_MINUTES - 4),
        lastPing: minutesBeforeNow(1),
      },
      {
        id: 'c',
        shiftStart: minutesBeforeNow(HOS_LIMIT_MINUTES - 11),
        lastPing: minutesBeforeNow(1),
      },
    ]

    const bySection = groupDriversBySection(drivers, NOW, testConfig, [
      'critical',
      'approaching',
      'on-track',
      'offline',
    ])

    expect(bySection.get('critical').map((driver) => driver.id)).toEqual([
      'b',
      'c',
      'a',
    ])
  })
})

describe('getDriverStatus', () => {
  it('resolves a driver with plenty of time left to on-track', () => {
    const driver = {
      shiftStart: minutesBeforeNow(30),
      lastPing: minutesBeforeNow(1),
    }
    expect(getDriverStatus(driver, NOW, testConfig).tierId).toBe('on-track')
  })

  it('resolves a driver under the critical threshold to critical', () => {
    const driver = {
      shiftStart: minutesBeforeNow(HOS_LIMIT_MINUTES - 12),
      lastPing: minutesBeforeNow(1),
    }
    expect(getDriverStatus(driver, NOW, testConfig).tierId).toBe('critical')
  })

  it('overrides an otherwise-critical status with offline when the ping is stale', () => {
    const driver = {
      shiftStart: minutesBeforeNow(HOS_LIMIT_MINUTES - 15),
      lastPing: minutesBeforeNow(45),
    }
    expect(getDriverStatus(driver, NOW, testConfig).tierId).toBe('offline')
  })
})
