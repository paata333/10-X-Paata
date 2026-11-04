import { useEffect } from 'react'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastViewportProps {
  toasts: ToastMessage[]
  onDismiss: (id: number) => void
}

const AUTO_DISMISS_MS = 3500

const variantClasses: Record<ToastVariant, string> = {
  success: 'bg-lime-300',
  error: 'bg-red-200',
  info: 'bg-white',
}

interface ToastItemProps {
  toast: ToastMessage
  onDismiss: (id: number) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-xl border-2 border-neutral-950 py-1 pl-4 pr-1 text-sm font-bold shadow-[4px_4px_0_0_#0a0a0a] ${variantClasses[toast.variant]}`}
    >
      <span>{toast.message}</span>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="grid size-11 shrink-0 place-items-center rounded-lg text-xl leading-none hover:bg-neutral-950/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-950"
      >
        <span aria-hidden="true">×</span>
      </button>
    </li>
  )
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:right-4 sm:justify-end"
    >
      <ul className="pointer-events-auto flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </ul>
    </div>
  )
}
