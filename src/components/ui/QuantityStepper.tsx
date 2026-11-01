interface QuantityStepperProps {
  value: number
  max: number
  min?: number
  disabled?: boolean
  itemName?: string
  onChange: (value: number) => void
}

const stepButtonClasses =
  'grid size-11 place-items-center text-xl font-bold transition-colors hover:bg-lime-200 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-neutral-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent motion-reduce:transition-none'

export function QuantityStepper({
  value,
  max,
  min = 1,
  disabled = false,
  itemName,
  onChange,
}: QuantityStepperProps) {
  const suffix = itemName ? ` of ${itemName}` : ''

  return (
    <div
      role="group"
      aria-label={`Quantity${suffix}`}
      className="inline-flex items-stretch overflow-hidden rounded-lg border-2 border-neutral-950 bg-white"
    >
      <button
        type="button"
        aria-label={`Decrease quantity${suffix}`}
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        className={`${stepButtonClasses} border-r-2 border-neutral-950`}
      >
        −
      </button>
      <span className="grid min-w-12 place-items-center px-2 font-bold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase quantity${suffix}`}
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className={`${stepButtonClasses} border-l-2 border-neutral-950`}
      >
        +
      </button>
    </div>
  )
}
