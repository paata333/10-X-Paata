import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../api/ApiError'
import { fetchProduct } from '../api/products.api'
import { ProductDetails } from '../components/product/ProductDetails'
import { ProductDetailsSkeleton } from '../components/product/ProductDetailsSkeleton'
import { RelatedProducts } from '../components/product/RelatedProducts'
import { Button } from '../components/ui/Button'
import { StatusMessage } from '../components/ui/StatusMessage'
import type { Product } from '../types/product'
import { NotFoundPage } from './NotFoundPage'

function parseProductId(id: string | undefined): number | null {
  if (id === undefined || !/^[1-9]\d*$/.test(id)) {
    return null
  }
  return Number(id)
}

export function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const productId = parseProductId(id)

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isNotFound, setIsNotFound] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (productId === null) {
      return
    }

    const controller = new AbortController()
    setProduct(null)
    setIsLoading(true)
    setError(null)
    setIsNotFound(false)

    fetchProduct(productId, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) {
          return
        }
        setProduct(data)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return
        }
        if (err instanceof ApiError && err.status === 404) {
          setIsNotFound(true)
        } else {
          setError(err instanceof Error ? err.message : 'Something went wrong')
        }
        setIsLoading(false)
      })

    return () => controller.abort()
  }, [productId, reloadKey])

  if (productId === null || isNotFound) {
    return <NotFoundPage />
  }

  const handleBack = () => {
    // "default" is the key of the first history entry: there is nothing to go back to.
    if (location.key === 'default') {
      navigate('/')
    } else {
      navigate(-1)
    }
  }

  return (
    <section>
      <button
        type="button"
        onClick={handleBack}
        className="mb-4 inline-flex min-h-11 items-center px-1 text-sm font-bold underline decoration-2 underline-offset-4 hover:bg-lime-300"
      >
        ← Back to catalog
      </button>

      {isLoading && <ProductDetailsSkeleton />}

      {error && (
        <StatusMessage
          variant="error"
          title="Could not load this product"
          action={
            <Button variant="dark" onClick={() => setReloadKey((key) => key + 1)}>
              Retry
            </Button>
          }
        >
          {error}. Please check your connection and try again.
        </StatusMessage>
      )}

      {product && (
        <>
          <ProductDetails key={product.id} product={product} />
          <RelatedProducts key={`related-${product.id}`} product={product} />
        </>
      )}
    </section>
  )
}
