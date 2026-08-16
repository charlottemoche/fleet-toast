export const statusTiers = [
  {
    id: 'violation',
    label: 'Violation',
    maxMinutesRemaining: 0,
    section: 'violation',
    color: 'error',
    alertMessage: 'is now over the HOS limit — must stop driving',
  },
  {
    id: 'critical',
    label: 'Critical',
    maxMinutesRemaining: 20,
    section: 'critical',
    color: 'critical',
    alertMessage: 'is now critical',
  },
  {
    id: 'approaching',
    label: 'Approaching',
    maxMinutesRemaining: 120,
    section: 'approaching',
    color: 'warning',
  },
  {
    id: 'on-track',
    label: 'On track',
    maxMinutesRemaining: Infinity,
    section: 'on-track',
    color: 'success',
  },
]

export const offlineTier = {
  id: 'offline',
  label: 'Offline',
  section: 'offline',
  color: 'info',
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

export function getSectionLabel(sectionId) {
  return allTiers.find((tier) => tier.section === sectionId)?.label
}

export function getSectionColor(sectionId) {
  return allTiers.find((tier) => tier.section === sectionId)?.color
}
