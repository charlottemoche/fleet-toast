export function StatusBadge({ tier }) {
  return (
    <span
      className="pointer-events-none inline-flex items-center rounded-full bg-[var(--tier)]/30 px-2.5 py-0.5 text-xs font-medium text-gray-900 dark:bg-[var(--tier)]/60 dark:text-white"
      style={{ '--tier': `var(--color-${tier.color})` }}
    >
      {tier.label}
    </span>
  )
}
