import { useState } from 'react'

const variants = {
  default: {
    pingLabel: 'Ping',
    pingClassName:
      'bg-brand rounded px-5 py-1.5 text-sm font-medium text-white dark:bg-gray-200 dark:text-gray-900',
    logNoteClassName:
      'rounded border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors duration-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800',
    rowClassName: 'flex items-center gap-2',
  },
  block: {
    pingLabel: 'Ping driver',
    pingClassName:
      'bg-brand flex-1 rounded p-2 text-center text-sm font-medium text-white transition-colors duration-500 hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white',
    logNoteClassName:
      'flex-1 rounded border border-gray-300 p-2 text-center text-sm font-medium transition-colors duration-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800',
    rowClassName: 'flex gap-2',
  },
}

export function DriverActions({
  driver,
  tierId,
  onLogNote,
  variant = 'default',
}) {
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const { pingLabel, pingClassName, logNoteClassName, rowClassName } =
    variants[variant]

  function toggleNote() {
    setIsNoteOpen((open) => !open)
    setNoteText('')
  }

  function submitNote(event) {
    event.preventDefault()
    const trimmed = noteText.trim()
    if (!trimmed) return
    onLogNote(driver.id, tierId, trimmed)
    setIsNoteOpen(false)
    setNoteText('')
  }

  return (
    <div className="flex flex-col gap-2">
      <div className={rowClassName}>
        <a
          href={`tel:${driver.phone}`}
          aria-label={`Ping ${driver.name}`}
          className={pingClassName}
        >
          {pingLabel}
        </a>
        <button
          type="button"
          aria-expanded={isNoteOpen}
          onClick={toggleNote}
          className={logNoteClassName}
        >
          Log note
        </button>
      </div>
      {isNoteOpen && (
        <form onSubmit={submitNote} className="flex gap-2">
          <input
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            placeholder="What did you do about this?"
            aria-label={`Note for ${driver.name}`}
            className="h-8 min-w-0 flex-1 rounded border border-gray-300 px-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
          <button
            type="submit"
            disabled={!noteText.trim()}
            className="shrink-0 rounded bg-gray-800 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-gray-200 dark:text-gray-900"
          >
            Log
          </button>
        </form>
      )}
    </div>
  )
}
