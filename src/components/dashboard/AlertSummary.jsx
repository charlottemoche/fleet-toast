import { getSectionLabel, sectionOrder } from '../../data/alertConfig.js'

// sectionOrder is urgency-sorted, so the first section is the one that
// deserves an assertive screen-reader announcement when its count changes.
const mostUrgentSection = sectionOrder[0]

export function AlertSummary({ driversBySection }) {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      {sectionOrder.map((section) => (
        <span
          key={section}
          aria-live={section === mostUrgentSection ? 'assertive' : undefined}
        >
          <strong>{driversBySection.get(section).length}</strong>{' '}
          {getSectionLabel(section)}
        </span>
      ))}
    </div>
  )
}
