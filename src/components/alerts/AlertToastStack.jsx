import { AlertToast } from './AlertToast.jsx'

export function AlertToastStack({ toasts, now, onDismiss, onSelectDriver }) {
  if (toasts.length === 0) return null

  return (
    <output className="fixed top-20 right-4 z-30 flex flex-col gap-2">
      {toasts.map((toast) => (
        <AlertToast
          key={toast.id}
          driver={toast.driver}
          now={now}
          onDismiss={() => onDismiss(toast.id)}
          onSelectDriver={onSelectDriver}
        />
      ))}
    </output>
  )
}
