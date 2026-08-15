import { useMemo } from 'react'
import { Dashboard } from './components/dashboard/Dashboard.jsx'
import { mockDrivers } from './data/mockDrivers.js'
import { sectionOrder, statusConfig } from './data/statusConfig.js'
import { useClockTick } from './hooks/useClockTick.js'
import { groupDriversBySection } from './utils/hos.js'

const TICK_INTERVAL_MS = 30_000

export default function App() {
  const now = useClockTick(TICK_INTERVAL_MS)
  const driversBySection = useMemo(
    () => groupDriversBySection(mockDrivers, now, statusConfig, sectionOrder),
    [now],
  )
  const criticalCount = driversBySection.get('critical').length

  return (
    <main className="relative mx-auto min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <nav className="sticky top-0 z-10 flex items-center justify-between bg-gray-800 dark:bg-gray-950 p-4 shadow">
        <div className="flex max-w-6xl items-center gap-3">
          <ul className="m-0 list-none p-0">
            <li>
              <a href="/">
                <img
                  src="/charlotte-truck-white.png"
                  alt="Logo"
                  className="h-10 w-10 lg:h-12 lg:w-12"
                />
              </a>
            </li>
          </ul>
          {criticalCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-700 px-2.5 py-0.5 text-xs font-medium text-white">
              <span aria-live="assertive">{criticalCount}</span>&nbsp;critical
            </span>
          )}
        </div>
      </nav>
      <div className="mx-auto max-w-6xl pb-10 lg:pb-20">
        <Dashboard now={now} driversBySection={driversBySection} />
      </div>
    </main>
  )
}
