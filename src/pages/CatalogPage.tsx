import { useEffect, useState } from 'react'
import { fetchProducts } from '../api/products.api'
import { ProductGrid } from '../components/product/ProductGrid'
import { Page } from '../components/ui/Page'
import { StatusMessage } from '../components/ui/StatusMessage'
import type { Product } from '../types/product'

const PAGE_SIZE = 12

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetchProducts(PAGE_SIZE, 0, controller.signal)
      .then((data) => {
        setProducts(data.products)
        setTotal(data.total)
        setError(null)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return
        }
        setError(err instanceof Error ? err.message : 'Something went wrong')
        setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  const subtitle = !isLoading && !error && total > 0 ? `${total} products` : undefined

  return (
    <Page title="Catalog" subtitle={subtitle}>
      {isLoading && <StatusMessage variant="loading" title="Loading products…" />}

      {error && (
        <StatusMessage variant="error" title="Could not load products">
          {error}. Please check your connection and reload the page.
        </StatusMessage>
      )}

      {!isLoading && !error && products.length === 0 && (
        <StatusMessage variant="empty" title="No products found." />
      )}

      {!isLoading && !error && products.length > 0 && (
        <>
          <ProductGrid products={products} />
          <p className="mt-8 text-sm font-medium text-neutral-600">
            Showing {products.length} of {total} products
          </p>
        </>
      )}
    </Page>
  )
}
