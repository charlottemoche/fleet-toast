export const statusTiers = [
  {
    id: 'critical',
    label: 'Critical',
    maxMinutesRemaining: 20,
    section: 'critical',
    collapsible: false,
    color: 'critical',
    alertMessage: 'is now critical',
  },
  {
    id: 'violation',
    label: 'Violation',
    maxMinutesRemaining: 0,
    section: 'violation',
    collapsible: false,
    color: 'error',
    alertMessage: 'is now over the HOS limit — must stop driving',
  },
  {
    id: 'approaching',
    label: 'Approaching',
    maxMinutesRemaining: 120,
    section: 'approaching',
    collapsible: false,
    color: 'warning',
  },
  {
    id: 'on-track',
    label: 'On track',
    maxMinutesRemaining: Infinity,
    section: 'on-track',
    collapsible: true,
    color: 'success',
  },
]

export const offlineTier = {
  id: 'offline',
  label: 'Offline',
  section: 'offline',
  collapsible: true,
  color: 'info',
}

export const sectionOrder = [
  'critical',
  'violation',
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

export function isSectionCollapsible(sectionId) {
  return allTiers.some((tier) => tier.section === sectionId && tier.collapsible)
}

export function getSectionColor(sectionId) {
  return allTiers.find((tier) => tier.section === sectionId)?.color
}
