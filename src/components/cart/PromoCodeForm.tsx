import { useState, type FormEvent } from 'react'
import { Button } from '../ui/Button'

interface PromoCodeFormProps {
  promoCode: string | null
  onApply: (code: string) => boolean
  onRemove: () => void
}

export function PromoCodeForm({ promoCode, onApply, onRemove }: PromoCodeFormProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (onApply(code)) {
      setCode('')
      setError(null)
    } else {
      setError('Invalid promo code')
    }
  }

  if (promoCode) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border-2 border-neutral-950 bg-white px-3 py-1 text-sm font-bold">
        <span>Code {promoCode} applied</span>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex min-h-11 items-center px-1 text-red-700 underline decoration-2 underline-offset-4 hover:bg-red-100"
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label
        htmlFor="promo-code"
        className="mb-1.5 block text-xs font-bold uppercase tracking-wider"
      >
        Promo code
      </label>
      <div className="flex gap-2">
        <input
          id="promo-code"
          type="text"
          value={code}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'promo-code-error' : undefined}
          onChange={(event) => {
            setCode(event.target.value)
            setError(null)
          }}
          className={`min-h-11 min-w-0 flex-1 rounded-lg border-2 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 ${
            error ? 'border-red-600' : 'border-neutral-950'
          }`}
        />
        <Button type="submit" variant="dark" size="sm">
          Apply
        </Button>
      </div>
      {error && (
        <p
          id="promo-code-error"
          role="alert"
          className="mt-1.5 text-sm font-bold text-red-800"
        >
          {error}
        </p>
      )}
    </form>
  )
}
