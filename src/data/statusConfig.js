// Sorted ascending by maxMinutesRemaining — resolveStatusTier's array-order
// scan relies on this order to act as the severity logic. Add a new tier by
// inserting one object here; nothing else needs to change.
export const statusTiers = [
  {
    id: 'critical',
    label: 'Critical',
    maxMinutesRemaining: 20,
    section: 'critical',
    alwaysExpanded: true,
    badgeClassName:
      'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-950',
    activeBadgeClassName: 'bg-red-700 text-white',
    rowClassName:
      'bg-gray-50/60 dark:bg-gray-800/50 transition-colors duration-300',
  },
  {
    id: 'approaching',
    label: 'Approaching',
    maxMinutesRemaining: 120,
    section: 'approaching',
    alwaysExpanded: true,
    badgeClassName:
      'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-200 dark:bg-amber-950',
    activeBadgeClassName: 'bg-amber-700 text-white',
    rowClassName:
      'bg-gray-50/60 dark:bg-gray-800/50 transition-colors duration-300',
  },
  {
    id: 'on-track',
    label: 'On track',
    maxMinutesRemaining: Infinity,
    section: 'on-track',
    alwaysExpanded: false,
    badgeClassName:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:bg-emerald-950',
    activeBadgeClassName: 'bg-emerald-700 text-white',
    rowClassName:
      'bg-gray-50/60 dark:bg-gray-800/50 transition-colors duration-300',
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
  rowClassName: 'text-gray-400 bg-gray-50/60 dark:bg-gray-900',
}

export const sectionOrder = ['critical', 'approaching', 'on-track', 'offline']

export const staleAfterMinutes = 10

export const statusConfig = { statusTiers, offlineTier, staleAfterMinutes }

const allTiers = [...statusTiers, offlineTier]

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
