export function StatusBadge({ tier }) {
  return (
    <span
      className="pointer-events-none inline-flex items-center rounded-full border border-[var(--tier)] bg-[var(--tier)]/30 px-2.5 py-0.5 text-xs font-medium font-semibold dark:bg-[var(--tier)]/60 dark:text-white"
      style={{ '--tier': `var(--color-${tier.color})` }}
    >
      {tier.label}
    </span>
  )
}
