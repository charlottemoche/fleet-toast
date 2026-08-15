export function StatusBadge({ tier }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tier.badgeClassName}`}
    >
      {tier.label}
    </span>
  )
}
