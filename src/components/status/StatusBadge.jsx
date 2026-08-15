export function StatusBadge({ tier }) {
  return (
    // pointer-events-none: this badge is purely informational, not a
    // control — the hover styling in tier.badgeClassName exists for the
    // filter buttons in StatusFilters.jsx, which share this class string.
    // Disabling pointer events here stops :hover from firing on the badge
    // itself without touching that shared style.
    <span
      className={`pointer-events-none inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tier.badgeClassName}`}
    >
      {tier.label}
    </span>
  )
}
