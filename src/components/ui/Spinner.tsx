interface SpinnerProps {
  label?: string
}

export function Spinner({ label = 'Loading…' }: SpinnerProps) {
  return (
    <div role="status" className="grid min-h-[40vh] place-items-center">
      <span
        aria-hidden="true"
        className="size-10 animate-spin rounded-full border-4 border-neutral-950 border-t-lime-300 motion-reduce:animate-none"
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
