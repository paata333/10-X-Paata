import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchCategories, fetchProducts } from '../api/products.api'
import { CatalogToolbar } from '../components/catalog/CatalogToolbar'
import { ProductGrid } from '../components/product/ProductGrid'
import { ProductGridSkeleton } from '../components/product/ProductGridSkeleton'
import { Button } from '../components/ui/Button'
import { buttonClasses } from '../components/ui/buttonStyles'
import { Page } from '../components/ui/Page'
import { Pagination } from '../components/ui/Pagination'
import { StatusMessage } from '../components/ui/StatusMessage'
import { useCart } from '../context/CartContext'
import { useDebounce } from '../hooks/useDebounce'
import { useFetch } from '../hooks/useFetch'
import {
  PAGE_SIZE,
  buildCatalogSearch,
  hasActiveFilters,
  parseCatalogParams,
  sortProducts,
  type CatalogParams,
  type SortValue,
} from '../utils/catalogParams'

const SEARCH_DEBOUNCE_MS = 400

export function CatalogPage() {
  const { addItem } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  const params = parseCatalogParams(searchParams)
  const { q, category, sort, page } = params

  const { state, reload } = useFetch(`${q}|${category}|${sort}|${page}`, (signal) =>
    fetchProducts({ q, category, sort, limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }, signal),
  )
  // The filter still works without the list: only "All categories" is shown.
  const { state: categoriesState } = useFetch('categories', fetchCategories)

  const isLoading = state.status === 'loading'
  const error = state.status === 'error' ? state.error.message : null
  const products = useMemo(() => (state.status === 'success' ? state.data.products : []), [state])
  const total = state.status === 'success' ? state.data.total : 0
  const categories = categoriesState.status === 'success' ? categoriesState.data : []

  // The input keeps its own text so typing never lags; the URL follows after a pause.
  const [searchText, setSearchText] = useState(q)
  const debouncedText = useDebounce(searchText, SEARCH_DEBOUNCE_MS)
  const pushedQuery = useRef(q)

  const updateParams = (patch: Partial<CatalogParams>, replace = false) => {
    setSearchParams(buildCatalogSearch({ ...params, ...patch }), { replace })
  }

  // Always read the newest sort and setter without making them triggers of the effect below:
  // it must run only when the debounced text changes, otherwise an old text could be re-applied.
  const latest = useRef({ sort, setSearchParams })
  useEffect(() => {
    latest.current = { sort, setSearchParams }
  })

  useEffect(() => {
    const trimmed = debouncedText.trim()
    if (trimmed === pushedQuery.current) {
      return
    }
    pushedQuery.current = trimmed
    const { sort: currentSort, setSearchParams: setParams } = latest.current
    setParams(buildCatalogSearch({ q: trimmed, category: '', sort: currentSort, page: 1 }), {
      replace: true,
    })
  }, [debouncedText])

  // Back / Forward or "Clear filters" changed the URL: bring the input in line with it.
  useEffect(() => {
    if (q !== pushedQuery.current) {
      pushedQuery.current = q
      setSearchText(q)
    }
  }, [q])

  const visibleProducts = useMemo(() => sortProducts(products, sort), [products, sort])
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const firstShown = (page - 1) * PAGE_SIZE + 1
  const lastShown = (page - 1) * PAGE_SIZE + products.length
  const subtitle = !isLoading && !error && total > 0 ? `${total} products` : undefined

  const handlePageChange = (nextPage: number) => {
    updateParams({ page: nextPage })
    window.scrollTo(0, 0)
  }

  return (
    <Page title="Catalog" subtitle={subtitle}>
      <CatalogToolbar
        searchText={searchText}
        onSearchChange={setSearchText}
        category={category}
        categories={categories}
        onCategoryChange={(slug) => updateParams({ category: slug, q: '', page: 1 })}
        sort={sort}
        onSortChange={(nextSort: SortValue) => updateParams({ sort: nextSort, page: 1 })}
      />

      {isLoading && <ProductGridSkeleton />}

      {error && (
        <StatusMessage
          variant="error"
          title="Could not load products"
          action={
            <Button variant="dark" onClick={reload}>
              Retry
            </Button>
          }
        >
          {error}. Please check your connection and try again.
        </StatusMessage>
      )}

      {!isLoading && !error && products.length === 0 && (
        <StatusMessage
          variant="empty"
          title="No products found."
          action={
            hasActiveFilters(params) ? (
              <Link to="/" className={buttonClasses('dark')}>
                Clear filters
              </Link>
            ) : undefined
          }
        />
      )}

      {!isLoading && !error && products.length > 0 && (
        <>
          <ProductGrid products={visibleProducts} onAdd={(product) => addItem(product, 1)} />
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
          <p className="mt-8 text-center text-sm font-medium text-neutral-600">
            Showing {firstShown}–{lastShown} of {total}
          </p>
        </>
      )}
    </Page>
  )
}
