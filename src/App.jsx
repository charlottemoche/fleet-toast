import { Dashboard } from './components/dashboard/Dashboard.jsx'

export default function App() {
  return (
    <>
      <nav className="flex items-center justify-between p-4">
        <ul className="m-0 list-none p-0">
          <li>
            <a href="/">
              <img
                src="/charlotte-truck.png"
                alt="Logo"
                className="h-10 w-10 lg:h-12 lg:w-12"
              />
            </a>
          </li>
        </ul>
      </nav>
      <Dashboard />
    </>
  )
}
