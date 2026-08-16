function splitHoursAndMinutes(minutes) {
  const wholeMinutes = Math.max(Math.floor(minutes), 0)
  return {
    hours: Math.floor(wholeMinutes / 60),
    remainderMinutes: wholeMinutes % 60,
  }
}

export function formatMinutesRemaining(minutes) {
  const { hours, remainderMinutes } = splitHoursAndMinutes(minutes)
  return hours === 0 ? `${remainderMinutes}m` : `${hours}h ${remainderMinutes}m`
}

export function formatMinutesRemainingLong(minutes) {
  const { hours, remainderMinutes } = splitHoursAndMinutes(minutes)
  const hourPart = hours === 1 ? '1 hour' : `${hours} hours`
  const minutePart =
    remainderMinutes === 1 ? '1 minute' : `${remainderMinutes} minutes`
  return hours === 0 ? minutePart : `${hourPart} ${minutePart}`
}

export function formatMinutesAgo(minutes) {
  const wholeMinutes = Math.max(Math.floor(minutes), 0)
  if (wholeMinutes < 1) return 'Just now'
  if (wholeMinutes < 60) return `${wholeMinutes}m ago`
  const hours = Math.floor(wholeMinutes / 60)
  const remainderMinutes = wholeMinutes % 60
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
