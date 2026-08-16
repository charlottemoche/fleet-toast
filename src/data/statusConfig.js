export const statusTiers = [
  {
    id: 'critical',
    label: 'Critical',
    maxMinutesRemaining: 20,
    section: 'critical',
    alwaysExpanded: true,
    color: 'error',
  },
  {
    id: 'approaching',
    label: 'Approaching',
    maxMinutesRemaining: 120,
    section: 'approaching',
    alwaysExpanded: true,
    color: 'warning',
  },
  {
    id: 'on-track',
    label: 'On track',
    maxMinutesRemaining: Infinity,
    section: 'on-track',
    alwaysExpanded: false,
    color: 'success',
  },
]

export const offlineTier = {
  id: 'offline',
  label: 'Offline',
  section: 'offline',
  alwaysExpanded: false,
  color: 'info',
}

export const sectionOrder = ['critical', 'approaching', 'on-track', 'offline']

export const staleAfterMinutes = 10

export const statusConfig = { statusTiers, offlineTier, staleAfterMinutes }

const allTiers = [...statusTiers, offlineTier]

export function getTierById(tierId) {
  return allTiers.find((tier) => tier.id === tierId)
}

export function getSectionLabel(sectionId) {
  return allTiers.find((tier) => tier.section === sectionId)?.label
}

export function isSectionAlwaysExpanded(sectionId) {
  return allTiers.some(
    (tier) => tier.section === sectionId && tier.alwaysExpanded,
  )
}

export function getSectionColor(sectionId) {
  return allTiers.find((tier) => tier.section === sectionId)?.color
}
