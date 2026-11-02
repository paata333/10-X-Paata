interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

type PageItem = number | 'gap-before' | 'gap-after'

function getPageItems(page: number, totalPages: number): PageItem[] {
  const wanted = [1, page - 1, page, page + 1, totalPages].filter(
    (value) => value >= 1 && value <= totalPages,
  )
  const pages = [...new Set(wanted)].sort((a, b) => a - b)
  const items: PageItem[] = []

  pages.forEach((value, index) => {
    const previous = pages[index - 1]
    if (previous !== undefined && value - previous > 1) {
      items.push(index === pages.length - 1 ? 'gap-after' : 'gap-before')
    }
    items.push(value)
  })

  return items
}

const controlClasses =
  'grid size-11 place-items-center rounded-lg border-2 border-neutral-950 text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none'

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={`${controlClasses} bg-white hover:bg-lime-100 disabled:hover:bg-white`}
      >
        ‹
      </button>
      {getPageItems(page, totalPages).map((item) =>
        typeof item === 'number' ? (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
            className={`${controlClasses} ${
              item === page
                ? 'bg-lime-300 shadow-[3px_3px_0_0_#0a0a0a]'
                : 'bg-white hover:bg-lime-100'
            }`}
          >
            {item}
          </button>
        ) : (
          <span key={item} aria-hidden="true" className="grid size-11 place-items-center font-bold">
            …
          </span>
        ),
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className={`${controlClasses} bg-white hover:bg-lime-100 disabled:hover:bg-white`}
      >
        ›
      </button>
    </nav>
  )
}
