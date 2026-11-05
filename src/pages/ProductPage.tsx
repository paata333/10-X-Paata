import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchProduct } from '../api/products.api'
import { ProductDetails } from '../components/product/ProductDetails'
import { ProductDetailsSkeleton } from '../components/product/ProductDetailsSkeleton'
import { RelatedProducts } from '../components/product/RelatedProducts'
import { Button } from '../components/ui/Button'
import { StatusMessage } from '../components/ui/StatusMessage'
import { useFetch } from '../hooks/useFetch'
import { isApiError } from '../utils/guards'
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

  // An invalid id is never sent to the API.
  const { state, reload } = useFetch(
    `product-${productId}`,
    (signal) => fetchProduct(productId ?? 0, signal),
    productId !== null,
  )

  if (productId === null) {
    return <NotFoundPage />
  }
  if (state.status === 'error' && isApiError(state.error) && state.error.status === 404) {
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

      {state.status === 'loading' && <ProductDetailsSkeleton />}

      {state.status === 'error' && (
        <StatusMessage
          variant="error"
          title="Could not load this product"
          action={
            <Button variant="dark" onClick={reload}>
              Retry
            </Button>
          }
        >
          {state.error.message}. Please check your connection and try again.
        </StatusMessage>
      )}

      {state.status === 'success' && (
        <>
          <ProductDetails key={state.data.id} product={state.data} />
          <RelatedProducts key={`related-${state.data.id}`} product={state.data} />
        </>
      )}
    </section>
  )
}
