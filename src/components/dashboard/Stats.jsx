import { getTierById } from '../../data/statusConfig.js'
import { trucks } from '../../data/trucks.js'

function countActiveDeliveries(driversBySection) {
  let count = 0
  for (const drivers of driversBySection.values()) {
    count += drivers.filter((driver) => driver.currentDelivery !== null).length
  }
  return count
}

function countTrucksAvailable(driversBySection) {
  return trucks.length - countActiveDeliveries(driversBySection)
}

function countByAlertableTier(driversBySection) {
  const counts = {}
  for (const [tierId, drivers] of driversBySection) {
    const tier = getTierById(tierId)
    if (!tier.alertMessage) continue
    counts[tierId] = drivers.length
  }
  return counts
}

export function Stats({ driversBySection, onOpenReview }) {
  const deliveriesCompleted = countActiveDeliveries(driversBySection)
  const needsReviewByTier = countByAlertableTier(driversBySection)
  const trucksAvailable = countTrucksAvailable(driversBySection)

  // Illustrative — no delivery-completion/history tracking exists in the
  // data model, so "completed today" can't be derived from a live snapshot.
  const DELIVERIES_TODAY = '812'

  const clickable = needsReviewByTier['critical'] > 0 || needsReviewByTier['violation'] > 0

  return (
    <section>
      <div className="flex flex-col pt-1 pb-3">
        <div className="grid w-full gap-3 text-sm md:shrink-0 xl:grid xl:grid-cols-2">
          <button
            type="button"
            onClick={onOpenReview}
            className={`rounded border bg-white/90 px-2 py-1 text-center transition-colors duration-300 dark:text-gray-100 dark:hover:bg-gray-900 ${clickable ? 'border-error hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-950' : 'border-gray-200 dark:border-gray-800'}`}
            disabled={!clickable}
          >
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
          </button>
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
            <div className="text-lg font-semibold">
              {trucksAvailable} / {trucks.length}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
