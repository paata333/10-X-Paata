interface StarDisplayProps {
  rating: number
}

export function StarDisplay({ rating }: StarDisplayProps) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)))

  return (
    <span className="inline-flex items-center leading-none">
      <span aria-hidden="true" className="text-lg tracking-tight">
        {'★'.repeat(filled)}
        <span className="text-neutral-300">{'★'.repeat(5 - filled)}</span>
      </span>
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
    </span>
  )
}

interface StarInputProps {
  value: number
  error?: string
  onChange: (value: number) => void
}

export function StarInput({ value, error, onChange }: StarInputProps) {
  return (
    <div>
      <span
        id="review-rating-label"
        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-700"
      >
        Rating
      </span>
      <div
        role="radiogroup"
        aria-labelledby="review-rating-label"
        aria-describedby={error ? 'review-rating-error' : undefined}
        className="flex"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange(star)}
            className={`grid size-11 place-items-center text-3xl leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-950 motion-reduce:transition-none ${
              star <= value ? 'text-neutral-950' : 'text-neutral-300 hover:text-neutral-500'
            }`}
          >
            <span aria-hidden="true">★</span>
          </button>
        ))}
      </div>
      {error && (
        <p
          id="review-rating-error"
          role="alert"
          className="mt-1.5 text-sm font-semibold text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  )
}
