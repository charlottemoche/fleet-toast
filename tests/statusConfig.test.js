import { describe, expect, it } from 'vitest'
import { getTierById } from '../src/data/statusConfig.js'

describe('getTierById', () => {
  it('finds a status tier by id', () => {
    expect(getTierById('critical').label).toBe('Critical')
  })

  it('finds the violation tier', () => {
    expect(getTierById('violation').label).toBe('Violation')
  })

  it('finds the offline tier too', () => {
    expect(getTierById('offline').label).toBe('Offline')
  })

  it('returns undefined for an unknown id', () => {
    expect(getTierById('nonexistent')).toBeUndefined()
  })

  it('exposes label and type for a known tier', () => {
    expect(getTierById('violation').type).toBe('error')
    expect(getTierById('on-track').type).toBe('success')
  })
})
