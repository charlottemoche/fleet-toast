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
