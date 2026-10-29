export function Footer() {
  return (
    <footer className="border-t-2 border-neutral-950 bg-lime-300">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm font-semibold sm:px-6">
        <p data-display className="text-2xl font-extrabold tracking-tight">
          10X Shop
        </p>
        <p>© {new Date().getFullYear()} · Graduation project · Product data from DummyJSON</p>
      </div>
    </footer>
  )
}
