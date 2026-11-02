import type { Product } from '../types/product'

export const PAGE_SIZE = 12

export type SortValue = '' | 'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc'

export interface SortOption {
  value: SortValue
  label: string
  sortBy?: 'price' | 'rating' | 'title'
  order?: 'asc' | 'desc'
}

export const SORT_OPTIONS: SortOption[] = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: low to high', sortBy: 'price', order: 'asc' },
  { value: 'price-desc', label: 'Price: high to low', sortBy: 'price', order: 'desc' },
  { value: 'rating-desc', label: 'Rating: high to low', sortBy: 'rating', order: 'desc' },
  { value: 'title-asc', label: 'Name A→Z', sortBy: 'title', order: 'asc' },
]

export interface CatalogParams {
  q: string
  category: string
  sort: SortValue
  page: number
}

export function parseCatalogParams(searchParams: URLSearchParams): CatalogParams {
  const q = (searchParams.get('q') ?? '').trim()
  // Search and category exclude each other: the search wins.
  const category = q ? '' : (searchParams.get('category') ?? '').trim()
  const rawSort = searchParams.get('sort') ?? ''
  const sort = SORT_OPTIONS.find((option) => option.value === rawSort)?.value ?? ''
  const rawPage = searchParams.get('page') ?? ''
  const page = /^[1-9]\d*$/.test(rawPage) ? Number(rawPage) : 1

  return { q, category, sort, page }
}

export function buildCatalogSearch(params: CatalogParams): URLSearchParams {
  const search = new URLSearchParams()

  if (params.q) {
    search.set('q', params.q)
  } else if (params.category) {
    search.set('category', params.category)
  }
  if (params.sort) {
    search.set('sort', params.sort)
  }
  if (params.page > 1) {
    search.set('page', String(params.page))
  }

  return search
}

export function hasActiveFilters(params: CatalogParams): boolean {
  return params.q !== '' || params.category !== '' || params.sort !== '' || params.page > 1
}

// The API already sorts, but if an endpoint ignores sortBy this keeps the visible page in order.
export function sortProducts(products: Product[], sort: SortValue): Product[] {
  switch (sort) {
    case 'price-asc':
      return [...products].sort((a, b) => a.price - b.price)
    case 'price-desc':
      return [...products].sort((a, b) => b.price - a.price)
    case 'rating-desc':
      return [...products].sort((a, b) => b.rating - a.rating)
    case 'title-asc':
      return [...products].sort((a, b) => a.title.localeCompare(b.title))
    default:
      return products
  }
}
