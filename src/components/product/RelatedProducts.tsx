import { useMemo } from 'react'
import { fetchProducts } from '../../api/products.api'
import { useCart } from '../../context/CartContext'
import { useFetch } from '../../hooks/useFetch'
import type { Product } from '../../types/product'
import { ProductGrid } from './ProductGrid'
import { ProductGridSkeleton } from './ProductGridSkeleton'

interface RelatedProductsProps {
  product: Product
}

const RELATED_LIMIT = 4

export function RelatedProducts({ product }: RelatedProductsProps) {
  const { addItem } = useCart()

  // One extra product is requested because the current product is filtered out.
  const { state } = useFetch(`related-${product.id}-${product.category}`, (signal) =>
    fetchProducts({ category: product.category, limit: RELATED_LIMIT + 1, skip: 0 }, signal),
  )

  const related = useMemo(
    () =>
      state.status === 'success'
        ? state.data.products.filter((item) => item.id !== product.id).slice(0, RELATED_LIMIT)
        : [],
    [state, product.id],
  )

  // Related products are an extra: if they fail or there are none, the page shows nothing.
  if (state.status === 'error' || (state.status === 'success' && related.length === 0)) {
    return null
  }

  return (
    <section aria-labelledby="related-heading" className="mt-16">
      <h2 id="related-heading" className="mb-6 text-2xl font-extrabold tracking-tight">
        Related products
      </h2>
      {state.status === 'loading' ? (
        <ProductGridSkeleton count={RELATED_LIMIT} announce={false} />
      ) : (
        <ProductGrid products={related} onAdd={(item) => addItem(item, 1)} />
      )}
    </section>
  )
}
