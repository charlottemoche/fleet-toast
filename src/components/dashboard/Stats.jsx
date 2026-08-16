export function Stats() {
  // Illustrative only — the exercise's fleet (50 trucks, 1,000+ deliveries/day)
  // is far larger than this app's 14-driver sample, so these aren't derived
  // from mockDrivers.js. They exist to show where fleet-wide throughput would
  // live in the UI, not to model it.
  const TRUCKS_AVAILABLE = '47 / 50'
  const DELIVERIES_TODAY = '812'

  return (
    <div className="flex flex-col gap-2 py-2 md:flex-row md:items-center md:justify-between">
      <div className="grid gap-4 text-sm md:shrink-0 xl:flex xl:flex-row">
        <div className="rounded border border-gray-200 px-3 py-1 text-center dark:border-gray-800">
          <div className="text-xs text-gray-600/90">Trucks available</div>
          <div className="text-lg font-semibold">{TRUCKS_AVAILABLE}</div>
        </div>
        <div className="rounded border border-gray-200 px-3 py-1 text-center dark:border-gray-800">
          <div className="text-xs text-gray-600/90">Deliveries today</div>
          <div className="text-lg font-semibold">{DELIVERIES_TODAY}</div>
        </div>
      </div>
    </div>
  )
}
