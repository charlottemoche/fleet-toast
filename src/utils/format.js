function splitHoursAndMinutes(minutes) {
  const wholeMinutes = Math.max(Math.floor(minutes), 0)
  return {
    hours: Math.floor(wholeMinutes / 60),
    remainderMinutes: wholeMinutes % 60,
  }
}

// Flooring `minutes` straight to whole minutes would make anything under a
// minute but still (legally) above zero read identically to a driver who
// has genuinely hit the limit — "0m" either way. Carving out the open
// interval keeps "0m" meaning what it says: the driver is really at zero.
export function formatMinutesRemaining(minutes) {
  if (minutes > 0 && minutes < 1) return 'Less than 1m'
  const { hours, remainderMinutes } = splitHoursAndMinutes(minutes)
  return hours === 0 ? `${remainderMinutes}m` : `${hours}h ${remainderMinutes}m`
}

export function formatMinutesRemainingLong(minutes) {
  if (minutes > 0 && minutes < 1) return 'Less than 1m'
  const { hours, remainderMinutes } = splitHoursAndMinutes(minutes)
  const hourPart = hours === 1 ? '1 hour' : `${hours} hours`
  const minutePart =
    remainderMinutes === 1 ? '1 minute' : `${remainderMinutes} minutes`
  return hours === 0 ? minutePart : `${hourPart} ${minutePart}`
}

export function formatMinutesAgo(minutes) {
  const { hours, remainderMinutes } = splitHoursAndMinutes(minutes)
  if (hours === 0 && remainderMinutes < 1) return 'Just now'
  if (hours === 0) return `${remainderMinutes}m ago`
  return remainderMinutes === 0
    ? `${hours}h ago`
    : `${hours}h ${remainderMinutes}m ago`
}

export function formatEta(eta) {
  return new Date(eta).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}
