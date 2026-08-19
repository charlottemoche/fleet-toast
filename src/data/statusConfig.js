export const statusTiers = [
  {
    id: 'violation',
    label: 'Violation',
    maxMinutesRemaining: 0,
    type: 'error',
    alertMessage: 'is now over the HOS limit — must stop driving',
  },
  {
    id: 'critical',
    label: 'Critical',
    maxMinutesRemaining: 20,
    type: 'critical',
    alertMessage: 'is now 20 minutes from their HOS limit',
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
