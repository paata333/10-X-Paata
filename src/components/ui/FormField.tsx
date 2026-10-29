import type { ChangeEvent } from 'react'

interface FormFieldProps {
  id: string
  label: string
  type?: 'text' | 'password' | 'email'
  value: string
  error?: string
  autoComplete?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export function FormField({
  id,
  label,
  type = 'text',
  value,
  error,
  autoComplete,
  onChange,
}: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-700"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-lg border-2 bg-white px-3.5 py-2.5 text-base outline-none transition-shadow focus:shadow-[3px_3px_0_0_#0a0a0a] motion-reduce:transition-none ${
          error ? 'border-red-600' : 'border-neutral-950'
        }`}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-red-700"
        >
          <span
            aria-hidden="true"
            className="grid size-4 shrink-0 place-items-center rounded-full bg-red-600 text-[10px] font-extrabold text-white"
          >
            !
          </span>
          {error}
        </p>
      )}
    </div>
  )
}
