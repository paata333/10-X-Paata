import { Link } from 'react-router-dom'
import { Cart } from '../../models/Cart'
import { formatPrice } from '../../utils/format'
import { TotalsList } from '../ui/TotalsList'
import { buttonClasses } from '../ui/buttonStyles'
import { PromoCodeForm } from './PromoCodeForm'

interface CartSummaryProps {
  cart: Cart
  promoCode: string | null
  onApplyPromo: (code: string) => boolean
  onRemovePromo: () => void
}

export function CartSummary({ cart, promoCode, onApplyPromo, onRemovePromo }: CartSummaryProps) {
  const promoLabel = `Discount (${Cart.PROMO_CODE} −${Math.round(Cart.PROMO_RATE * 100)}%)`

  return (
    <aside
      aria-label="Order summary"
      className="h-fit rounded-2xl border-2 border-neutral-950 bg-lime-300 p-5 shadow-[6px_6px_0_0_#0a0a0a] lg:sticky lg:top-6"
    >
      <h2 className="text-2xl font-extrabold tracking-tight">Summary</h2>
      <p className="mt-2 text-sm font-medium">
        {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
      </p>
      <div className="mt-4">
        <PromoCodeForm promoCode={promoCode} onApply={onApplyPromo} onRemove={onRemovePromo} />
      </div>
      <div className="mt-5">
        <TotalsList
          subtotal={cart.subtotal()}
          discount={cart.discount()}
          shipping={cart.shipping()}
          total={cart.total()}
          promoLabel={promoLabel}
        />
      </div>
      <p className="mt-3 text-xs font-semibold">
        Free shipping from {formatPrice(Cart.FREE_SHIPPING_FROM)}.
      </p>
      <Link to="/checkout" className={`${buttonClasses('dark', 'md', true)} mt-5`}>
        Proceed to checkout
      </Link>
    </aside>
  )
}
