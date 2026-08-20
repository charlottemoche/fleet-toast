// driverMessage is a fixed template, not AI-generated — sent automatically
// the moment a driver enters that tier. It's a stand-in for what a real
// system could do here: draft a message from the driver's live context
// (route, weather, cargo, delivery window) instead of one static string.
export const statusTiers = [
  {
    id: 'violation',
    label: 'Violation',
    maxMinutesRemaining: 0,
    type: 'error',
    alertMessage: 'is now over the HOS limit — must stop driving',
    driverMessage:
      'You are over your HOS limit. Stop driving now and find a safe location.',
  },
  {
    id: 'critical',
    label: 'Critical',
    maxMinutesRemaining: 20,
    type: 'critical',
    alertMessage: 'is now 20 minutes from their HOS limit',
    driverMessage:
      "You're 20 minutes from your HOS limit. Start looking for a safe place to stop.",
  },
  {
    id: 'approaching',
    label: 'Approaching',
    maxMinutesRemaining: 120,
    type: 'warning',
  },
  {
    id: 'on-track',
    label: 'On track',
    maxMinutesRemaining: Infinity,
    type: 'success',
  },
]

export const offlineTier = {
  id: 'offline',
  label: 'Offline',
  type: 'info',
}

export const sectionOrder = [
  'violation',
  'critical',
  'approaching',
  'on-track',
  'offline',
]

export const staleAfterMinutes = 10

export const statusConfig = { statusTiers, offlineTier, staleAfterMinutes }

const allTiers = [...statusTiers, offlineTier]

export function getTierById(tierId) {
  return allTiers.find((tier) => tier.id === tierId)
}
