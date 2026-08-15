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
    badgeClassName: 'bg-red-600 text-white',
    rowClassName: 'bg-red-50 dark:bg-red-950/40',
  },
  {
    id: 'approaching',
    label: 'Approaching',
    maxMinutesRemaining: 120,
    section: 'approaching',
    alwaysExpanded: true,
    badgeClassName: 'bg-amber-500 text-white',
    rowClassName: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    id: 'on-track',
    label: 'On Track',
    maxMinutesRemaining: Infinity,
    section: 'on-track',
    alwaysExpanded: false,
    badgeClassName: 'bg-emerald-600 text-white',
    rowClassName: '',
  },
]

export const offlineTier = {
  id: 'offline',
  label: 'Offline',
  section: 'offline',
  alwaysExpanded: false,
  badgeClassName: 'bg-gray-400 text-white',
  rowClassName: 'opacity-50',
}

export const sectionOrder = ['critical', 'approaching', 'on-track', 'offline']

export const staleAfterMinutes = 10

export const alertConfig = { alertTiers, offlineTier, staleAfterMinutes }
