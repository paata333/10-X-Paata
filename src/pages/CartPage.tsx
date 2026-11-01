import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CartItemRow } from '../components/cart/CartItemRow'
import { CartSummary } from '../components/cart/CartSummary'
import { buttonClasses } from '../components/ui/buttonStyles'
import { Page } from '../components/ui/Page'
import { useCart } from '../context/CartContext'

function getNotice(state: unknown): string | null {
  if (
    typeof state === 'object' &&
    state !== null &&
    'notice' in state &&
    typeof state.notice === 'string'
  ) {
    return state.notice
  }
  return null
}

export function CartPage() {
  const { items, itemCount, subtotal, setQuantity, removeItem, clearCart } = useCart()
  const location = useLocation()
  const [removedTitle, setRemovedTitle] = useState<string | null>(null)
  const redirectNotice = getNotice(location.state)

  const handleRemove = (productId: number) => {
    const item = items.find((cartItem) => cartItem.productId === productId)
    setRemovedTitle(item ? item.title : null)
    removeItem(productId)
  }

  const handleClear = () => {
    if (window.confirm('Clear the cart? This cannot be undone.')) {
      setRemovedTitle(null)
      clearCart()
    }
  }

  return (
    <Page title="Cart" subtitle={itemCount > 0 ? `${itemCount} items` : undefined}>
      {redirectNotice && items.length === 0 && (
        <p
          role="status"
          className="mb-6 rounded-lg border-2 border-neutral-950 bg-yellow-200 px-4 py-3 text-sm font-semibold"
        >
          {redirectNotice}
        </p>
      )}

      {removedTitle && (
        <p
          role="status"
          className="mb-6 rounded-lg border-2 border-neutral-950 bg-white px-4 py-3 text-sm font-semibold"
        >
          Removed from cart: {removedTitle}
        </p>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border-2 border-neutral-950 bg-white px-6 py-14 text-center shadow-[5px_5px_0_0_#0a0a0a]">
          <p data-display className="text-2xl font-bold">
            Your cart is empty.
          </p>
          <p className="mt-2 text-neutral-600">Pick something you like from the catalog.</p>
          <Link to="/" className={`${buttonClasses('primary')} mt-6`}>
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.productId}>
                  <CartItemRow
                    item={item}
                    onQuantityChange={setQuantity}
                    onRemove={handleRemove}
                  />
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleClear}
              className="mt-6 text-sm font-bold text-neutral-700 underline decoration-2 underline-offset-4 hover:bg-red-100 hover:text-red-700"
            >
              Clear cart
            </button>
          </div>
          <CartSummary itemCount={itemCount} subtotal={subtotal} />
        </div>
      )}
    </Page>
  )
}
