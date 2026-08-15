import { getTierById } from '../data/statusConfig.js'

export const HOS_LIMIT_MINUTES = 11 * 60

export function minutesRemaining(shiftStart, now) {
  const elapsedMinutes = (now - new Date(shiftStart).getTime()) / 60_000
  return Math.max(HOS_LIMIT_MINUTES - elapsedMinutes, 0)
}

export function minutesSincePing(lastPing, now) {
  return (now - new Date(lastPing).getTime()) / 60_000
}

export function isStale(lastPing, now, staleAfterMinutes) {
  return minutesSincePing(lastPing, now) >= staleAfterMinutes
}

export function resolveStatusTier(remainingMinutes, tiers) {
  return tiers.find((tier) => remainingMinutes <= tier.maxMinutesRemaining)
}

// Staleness is checked first: an unreachable driver's HOS reading can't be
// trusted, so a stale ping overrides whatever the timer math would say.
export function getDriverStatus(driver, now, config) {
  const remainingMinutes = minutesRemaining(driver.shiftStart, now)

  if (isStale(driver.lastPing, now, config.staleAfterMinutes)) {
    return { tierId: config.offlineTier.id, remainingMinutes }
  }

  const tier = resolveStatusTier(remainingMinutes, config.statusTiers)
  return { tierId: tier.id, remainingMinutes }
}

// Runs getDriverStatus directly (not the useDriverStatus hook) since this
// groups the whole driver list in one pass — hooks can't be called in a loop.
export function groupDriversBySection(drivers, now, config, sectionOrder) {
  const driversBySection = new Map(sectionOrder.map((section) => [section, []]))

  for (const driver of drivers) {
    const { tierId } = getDriverStatus(driver, now, config)
    const section = getTierById(tierId).section
    driversBySection.get(section).push(driver)
  }

  return driversBySection
}
