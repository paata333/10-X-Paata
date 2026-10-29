import type { ReactNode } from 'react'

type StatusVariant = 'loading' | 'error' | 'empty'

interface StatusMessageProps {
  variant: StatusVariant
  title: string
  children?: ReactNode
}

const variantClasses: Record<StatusVariant, string> = {
  loading: 'bg-white',
  error: 'bg-red-200',
  empty: 'bg-yellow-200',
}

export function StatusMessage({ variant, title, children }: StatusMessageProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-neutral-950 px-6 py-14 text-center shadow-[5px_5px_0_0_#0a0a0a] ${variantClasses[variant]}`}
    >
      {variant === 'loading' && (
        <span
          aria-hidden="true"
          className="size-9 animate-spin rounded-full border-4 border-neutral-950 border-t-lime-300"
        />
      )}
      <p data-display className="text-xl font-bold">
        {title}
      </p>
      {children && <p className="max-w-md text-neutral-700">{children}</p>}
    </div>
  )
}
