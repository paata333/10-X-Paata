interface ProductGridSkeletonProps {
  count?: number
  announce?: boolean
}

export function ProductGridSkeleton({ count = 12, announce = true }: ProductGridSkeletonProps) {
  return (
    <div>
      {announce && (
        <p role="status" className="sr-only">
          Loading products…
        </p>
      )}
      <ul
        aria-hidden="true"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {Array.from({ length: count }, (_, index) => (
          <li
            key={index}
            className="animate-pulse overflow-hidden rounded-2xl border-2 border-neutral-950 bg-white shadow-[4px_4px_0_0_#0a0a0a] motion-reduce:animate-none"
          >
            <div className="aspect-square border-b-2 border-neutral-950 bg-neutral-200" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-1/2 rounded bg-neutral-200" />
              <div className="h-5 w-4/5 rounded bg-neutral-200" />
              <div className="h-7 w-1/3 rounded bg-neutral-200" />
              <div className="h-11 w-full rounded-lg bg-neutral-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
