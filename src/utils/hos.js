export const HOS_LIMIT_MINUTES = 11 * 60

// Floored at zero — a driver can't have negative legal drive time left.
// format.js has a matching (0, 1) display guard so "0m" isn't shown a
// full minute before this floor is actually reached.
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

// Sorts defensively so classification doesn't depend on tiers being
// listed in ascending threshold order.
export function resolveStatusTier(remainingMinutes, tiers) {
  const ascending = [...tiers].sort(
    (a, b) => a.maxMinutesRemaining - b.maxMinutesRemaining,
  )
  return ascending.find((tier) => remainingMinutes <= tier.maxMinutesRemaining)
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

// Uses getDriverStatus directly, not the hook — hooks can't run in a loop.
// Sorts each section ascending by time remaining, most urgent first.
export function groupDriversBySection(drivers, now, config, sectionOrder) {
  const driversBySection = new Map(sectionOrder.map((section) => [section, []]))
  const remainingMinutesById = new Map()

  for (const driver of drivers) {
    const { tierId, remainingMinutes } = getDriverStatus(driver, now, config)
    driversBySection.get(tierId).push(driver)
    remainingMinutesById.set(driver.id, remainingMinutes)
  }

  for (const sectionDrivers of driversBySection.values()) {
    sectionDrivers.sort(
      (a, b) => remainingMinutesById.get(a.id) - remainingMinutesById.get(b.id),
    )
  }

  return driversBySection
}
