import { getTierById } from '../../data/statusConfig.js'

function countActiveDeliveries(driversBySection) {
  let count = 0
  for (const drivers of driversBySection.values()) {
    count += drivers.filter((driver) => driver.currentDelivery !== null).length
  }
  return count
}

function countNeedsAcknowledgmentByTier(driversBySection, acknowledgedIds) {
  const counts = {}
  for (const [tierId, drivers] of driversBySection) {
    const tier = getTierById(tierId)
    if (!tier.alertMessage) continue
    counts[tierId] = drivers.filter(
      (driver) => !acknowledgedIds.has(driver.id),
    ).length
  }
  return counts
}

export function Stats({ driversBySection, acknowledgedIds }) {
  const deliveriesCompleted = countActiveDeliveries(driversBySection)
  const needsReviewByTier = countNeedsAcknowledgmentByTier(
    driversBySection,
    acknowledgedIds,
  )

  // Illustrative only, not derived from mockDrivers.js — the real fleet
  // (50 trucks, 1,000+ deliveries/day) is much larger than this sample.
  const TRUCKS_AVAILABLE = '47 / 50'
  const DELIVERIES_TODAY = '812'

  return (
    <section>
      <div className="flex flex-col pt-1 pb-3">
        <div className="grid w-full gap-3 text-sm md:shrink-0 xl:grid xl:grid-cols-2">
          <div className="rounded border border-gray-200 bg-white/90 px-2 py-1 text-center dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">
            <div className="text-xs text-gray-600/90">Needs review</div>
            <div className="flex items-center justify-center gap-3">
              {['critical', 'violation'].map((tierId) => {
                const tier = getTierById(tierId)
                return (
                  <div
                    key={tierId}
                    style={{ '--tier': `var(--color-${tier.color})` }}
                  >
                    <div
                      className={
                        (needsReviewByTier[tierId] ?? 0) > 0
                          ? 'text-lg font-semibold text-[var(--tier)]'
                          : 'text-lg font-semibold text-gray-600'
                      }
                    >
                      {needsReviewByTier[tierId] ?? 0}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {tier.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="rounded border border-gray-200 bg-white/90 px-2 py-1 text-center dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">
            <div className="text-xs text-gray-600/90">Deliveries completed</div>
            <div className="text-lg font-semibold">{DELIVERIES_TODAY}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="grid w-full gap-3 text-sm md:shrink-0 xl:grid xl:grid-cols-2">
          <div className="rounded border border-gray-200 bg-white/90 px-2 py-1 text-center dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">
            <div className="text-xs text-gray-600/90">Current deliveries</div>
            <div className="text-lg font-semibold">{deliveriesCompleted}</div>
          </div>
          <div className="rounded border border-gray-200 bg-white/90 px-2 py-1 text-center dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">
            <div className="text-xs text-gray-600/90">Trucks available</div>
            <div className="text-lg font-semibold">{TRUCKS_AVAILABLE}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
