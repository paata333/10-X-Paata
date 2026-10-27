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
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-stone-700">
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
        className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-stone-300 focus:border-teal-600 focus:ring-teal-100'
        }`}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
