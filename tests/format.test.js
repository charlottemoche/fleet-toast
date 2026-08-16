import { describe, expect, it } from 'vitest'
import {
  formatEta,
  formatMinutesAgo,
  formatMinutesRemaining,
  formatMinutesRemainingLong,
} from '../src/utils/format.js'

describe('formatMinutesRemaining', () => {
  it('shows minutes only under an hour', () => {
    expect(formatMinutesRemaining(45)).toBe('45m')
  })

  it('shows hours and minutes over an hour', () => {
    expect(formatMinutesRemaining(75)).toBe('1h 15m')
  })

  it('floors fractional minutes', () => {
    expect(formatMinutesRemaining(45.9)).toBe('45m')
  })

  it('clamps negative minutes to zero', () => {
    expect(formatMinutesRemaining(-5)).toBe('0m')
  })

  it('shows "Less than 1m" for a driver with time left but under a minute, distinct from actually being at zero', () => {
    expect(formatMinutesRemaining(0.5)).toBe('Less than 1m')
    expect(formatMinutesRemaining(0)).toBe('0m')
  })

  // DEMO — intentionally wrong expectation. Remove `.skip` to run it and
  // watch it fail, then correct the expected value (or the code) to show
  // the red-to-green loop live.
  it.skip('DEMO fails on purpose — flip `it.skip` to `it` to show a red test', () => {
    expect(formatMinutesRemaining(75)).toBe('1h 30m') // actually '1h 15m'
  })
})

describe('formatMinutesRemainingLong', () => {
  it('pluralizes minutes and hours', () => {
    expect(formatMinutesRemainingLong(75)).toBe('1 hour 15 minutes')
    expect(formatMinutesRemainingLong(125)).toBe('2 hours 5 minutes')
  })

  it('uses singular minute/hour at exactly 1', () => {
    expect(formatMinutesRemainingLong(61)).toBe('1 hour 1 minute')
  })

  it('omits the hour part under an hour', () => {
    expect(formatMinutesRemainingLong(30)).toBe('30 minutes')
  })

  it('shows "Less than 1 minute" for a driver with time left but under a minute', () => {
    expect(formatMinutesRemainingLong(0.5)).toBe('Less than 1m')
    expect(formatMinutesRemainingLong(0)).toBe('0 minutes')
  })
})

describe('formatMinutesAgo', () => {
  it('says "Just now" for under a minute', () => {
    expect(formatMinutesAgo(0.5)).toBe('Just now')
  })

  it('shows minutes under an hour', () => {
    expect(formatMinutesAgo(9)).toBe('9m ago')
  })

  it('shows hours and minutes over an hour', () => {
    expect(formatMinutesAgo(90)).toBe('1h 30m ago')
  })

  it('omits minutes on an exact hour', () => {
    expect(formatMinutesAgo(120)).toBe('2h ago')
  })
})

describe('formatEta', () => {
  it('returns a formatted time string', () => {
    const eta = new Date('2026-08-15T21:05:00.000Z').toISOString()
    expect(formatEta(eta)).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/i)
  })
})
