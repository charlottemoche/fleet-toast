import { describe, expect, it } from 'vitest'
import {
  getSectionColor,
  getSectionLabel,
  getTierById,
} from '../src/data/statusConfig.js'

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
})

describe('getSectionLabel', () => {
  it('returns the label for a known section', () => {
    expect(getSectionLabel('approaching')).toBe('Approaching')
  })

  it('returns undefined for an unknown section', () => {
    expect(getSectionLabel('nonexistent')).toBeUndefined()
  })
})

describe('getSectionColor', () => {
  it('returns the color for a known section', () => {
    expect(getSectionColor('violation')).toBe('error')
    expect(getSectionColor('critical')).toBe('critical')
    expect(getSectionColor('on-track')).toBe('success')
    expect(getSectionColor('offline')).toBe('info')
  })
})
