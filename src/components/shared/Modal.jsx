import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export const Modal = forwardRef(function Modal(
  { titleId, title, onClose, widthClassName, children },
  ref,
) {
  const dialogRef = useRef(null)

  useImperativeHandle(ref, () => ({
    close: () => dialogRef.current.close(),
  }))

  useEffect(() => {
    const dialog = dialogRef.current

    function closeIfBackdropClicked(event) {
      if (event.target === dialog) {
        dialog.close()
      }
    }

    dialog.showModal()
    dialog.addEventListener('click', closeIfBackdropClicked)
    return () => dialog.removeEventListener('click', closeIfBackdropClicked)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.addEventListener('close', onClose)
    return () => dialog.removeEventListener('close', onClose)
  }, [onClose])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="fixed inset-0 m-auto rounded-lg p-0 backdrop:bg-black/50"
    >
      <div className={`${widthClassName} p-6`}>
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current.close()}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
})
