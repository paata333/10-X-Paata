import type { Category } from '../../types/product'
import { SORT_OPTIONS, type SortValue } from '../../utils/catalogParams'

interface CatalogToolbarProps {
  searchText: string
  onSearchChange: (value: string) => void
  category: string
  categories: Category[]
  onCategoryChange: (slug: string) => void
  sort: SortValue
  onSortChange: (sort: SortValue) => void
}

const labelClasses = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-700'
const controlClasses =
  'min-h-11 w-full rounded-lg border-2 border-neutral-950 bg-white px-3.5 py-2.5 text-base transition-shadow focus-visible:shadow-[3px_3px_0_0_#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 motion-reduce:transition-none'

export function CatalogToolbar({
  searchText,
  onSearchChange,
  category,
  categories,
  onCategoryChange,
  sort,
  onSortChange,
}: CatalogToolbarProps) {
  return (
    <div className="mb-8 grid gap-4 rounded-2xl border-2 border-neutral-950 bg-white p-4 shadow-[4px_4px_0_0_#0a0a0a] sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="catalog-search" className={labelClasses}>
          Search
        </label>
        <input
          id="catalog-search"
          type="search"
          value={searchText}
          placeholder="Search products…"
          autoComplete="off"
          onChange={(event) => onSearchChange(event.target.value)}
          className={controlClasses}
        />
      </div>
      <div>
        <label htmlFor="catalog-category" className={labelClasses}>
          Category
        </label>
        <select
          id="catalog-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className={controlClasses}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="catalog-sort" className={labelClasses}>
          Sort by
        </label>
        <select
          id="catalog-sort"
          value={sort}
          onChange={(event) => {
            const selected = SORT_OPTIONS.find((option) => option.value === event.target.value)
            onSortChange(selected ? selected.value : '')
          }}
          className={controlClasses}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
