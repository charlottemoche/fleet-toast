import { Component } from 'react'

// No hook equivalent exists for catching render errors in child
// components — this has to be a class component.
export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error(error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-3 bg-gray-100 p-6 text-center text-gray-900 dark:bg-gray-900 dark:text-gray-100">
          <p className="text-lg font-semibold">Something went wrong.</p>
          <p className="max-w-md text-sm text-gray-500">
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white dark:bg-gray-200 dark:text-gray-900"
          >
            Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
