// Sorted ascending by maxMinutesRemaining — resolveAlertTier's array-order
// scan relies on this order to act as the severity logic. Add a new tier by
// inserting one object here; nothing else needs to change.
export const alertTiers = [
  {
    id: 'critical',
    label: 'Critical',
    maxMinutesRemaining: 20,
    section: 'critical',
    alwaysExpanded: true,
    badgeClassName:
      'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300',
    activeBadgeClassName: 'bg-red-600 text-white',
    rowClassName: 'bg-red-50 dark:bg-red-950/40',
  },
  {
    id: 'approaching',
    label: 'Approaching',
    maxMinutesRemaining: 120,
    section: 'approaching',
    alwaysExpanded: true,
    badgeClassName:
      'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    activeBadgeClassName: 'bg-amber-700 text-white',
    rowClassName: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    id: 'on-track',
    label: 'On Track',
    maxMinutesRemaining: Infinity,
    section: 'on-track',
    alwaysExpanded: false,
    badgeClassName:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    activeBadgeClassName: 'bg-emerald-700 text-white',
    rowClassName: '',
  },
]

export const offlineTier = {
  id: 'offline',
  label: 'Offline',
  section: 'offline',
  alwaysExpanded: false,
  badgeClassName:
    'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  activeBadgeClassName: 'bg-gray-700 text-white',
  rowClassName: 'opacity-50',
}

export const sectionOrder = ['critical', 'approaching', 'on-track', 'offline']

export const staleAfterMinutes = 10

export const alertConfig = { alertTiers, offlineTier, staleAfterMinutes }

const allTiers = [...alertTiers, offlineTier]

export function getTierById(tierId) {
  return allTiers.find((tier) => tier.id === tierId)
}

// A section's label/expanded behavior is derived from whichever tiers
// belong to it, rather than assumed from the tier id, so a section stays
// correct even if a future tier addition splits it into more than one tier.
export function getSectionLabel(sectionId) {
  return allTiers.find((tier) => tier.section === sectionId)?.label
}

export function isSectionAlwaysExpanded(sectionId) {
  return allTiers.some(
    (tier) => tier.section === sectionId && tier.alwaysExpanded,
  )
}

export function getSectionBadgeClassName(sectionId) {
  return allTiers.find((tier) => tier.section === sectionId)?.badgeClassName
}

export function getSectionActiveClassName(sectionId) {
  return allTiers.find((tier) => tier.section === sectionId)
    ?.activeBadgeClassName
}
