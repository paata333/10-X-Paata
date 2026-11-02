import { useEffect, useState } from 'react'
import { fetchProducts } from '../../api/products.api'
import { useCart } from '../../context/CartContext'
import type { Product } from '../../types/product'
import { ProductGrid } from './ProductGrid'
import { ProductGridSkeleton } from './ProductGridSkeleton'

interface RelatedProductsProps {
  product: Product
}

const RELATED_LIMIT = 4

export function RelatedProducts({ product }: RelatedProductsProps) {
  const { addItem } = useCart()
  const [related, setRelated] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)

    // One extra product is requested because the current product is filtered out.
    fetchProducts({ category: product.category, limit: RELATED_LIMIT + 1, skip: 0 }, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) {
          return
        }
        setRelated(data.products.filter((item) => item.id !== product.id).slice(0, RELATED_LIMIT))
        setIsLoading(false)
      })
      .catch(() => {
        if (controller.signal.aborted) {
          return
        }
        // Related products are an extra: if they fail, the page simply shows nothing.
        setRelated([])
        setIsLoading(false)
      })

    return () => controller.abort()
  }, [product.id, product.category])

  if (!isLoading && related.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="related-heading" className="mt-16">
      <h2 id="related-heading" className="mb-6 text-2xl font-extrabold tracking-tight">
        Related products
      </h2>
      {isLoading ? (
        <ProductGridSkeleton count={RELATED_LIMIT} announce={false} />
      ) : (
        <ProductGrid products={related} onAdd={(item) => addItem(item, 1)} />
      )}
    </section>
  )
}
