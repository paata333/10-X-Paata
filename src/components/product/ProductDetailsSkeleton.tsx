export function ProductDetailsSkeleton() {
  return (
    <div>
      <p role="status" className="sr-only">
        Loading product…
      </p>
      <div
        aria-hidden="true"
        className="grid animate-pulse gap-8 motion-reduce:animate-none lg:grid-cols-2 lg:gap-12"
      >
        <div>
          <div className="aspect-square rounded-2xl border-2 border-neutral-950 bg-neutral-200" />
          <div className="mt-5 flex gap-3">
            <div className="size-16 rounded-lg bg-neutral-200" />
            <div className="size-16 rounded-lg bg-neutral-200" />
            <div className="size-16 rounded-lg bg-neutral-200" />
          </div>
        </div>
        <div className="space-y-5">
          <div className="h-3 w-1/3 rounded bg-neutral-200" />
          <div className="h-10 w-4/5 rounded bg-neutral-200" />
          <div className="h-10 w-1/3 rounded bg-neutral-200" />
          <div className="h-4 w-1/4 rounded bg-neutral-200" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-2/3 rounded bg-neutral-200" />
          </div>
          <div className="h-11 w-2/3 rounded-lg bg-neutral-200" />
        </div>
      </div>
    </div>
  )
}
