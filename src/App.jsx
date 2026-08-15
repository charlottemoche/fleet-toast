import { useMemo } from 'react'
import { Dashboard } from './components/dashboard/Dashboard.jsx'
import { AlertToastStack } from './components/alerts/AlertToastStack.jsx'
import { mockDrivers } from './data/mockDrivers.js'
import { sectionOrder, statusConfig } from './data/statusConfig.js'
import { useClockTick } from './hooks/useClockTick.js'
import { useCriticalAlerts } from './hooks/useCriticalAlerts.js'
import { groupDriversBySection } from './utils/hos.js'

const TICK_INTERVAL_MS = 30_000

export default function App() {
  const now = useClockTick(TICK_INTERVAL_MS)
  const driversBySection = useMemo(
    () => groupDriversBySection(mockDrivers, now, statusConfig, sectionOrder),
    [now],
  )
  const { toasts, dismissToast } = useCriticalAlerts(
    driversBySection.get('critical'),
  )

  return (
    <main className="relative mx-auto flex h-screen flex-col bg-gray-100 text-gray-900 dark:bg-[#121212] dark:text-gray-100">
      <nav className="sticky top-0 z-10 bg-gray-800 p-4 shadow dark:bg-[#000000]">
        <div>
          <ul className="m-0 flex w-full flex-1 list-none items-center justify-between gap-2 p-0">
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
        </div>
      </nav>
      <div className="mx-auto min-h-0 w-full max-w-6xl flex-1">
        <Dashboard now={now} driversBySection={driversBySection} />
      </div>
      <AlertToastStack toasts={toasts} now={now} onDismiss={dismissToast} />
    </main>
  )
}
