import { Link } from 'react-router-dom'
import { buttonClasses } from '../ui/buttonStyles'
import { formatPrice } from '../../utils/format'

interface CartSummaryProps {
  itemCount: number
  subtotal: number
}

export function CartSummary({ itemCount, subtotal }: CartSummaryProps) {
  return (
    <aside
      aria-label="Order summary"
      className="h-fit rounded-2xl border-2 border-neutral-950 bg-lime-300 p-5 shadow-[6px_6px_0_0_#0a0a0a] lg:sticky lg:top-6"
    >
      <h2 className="text-2xl font-extrabold tracking-tight">Summary</h2>
      <dl className="mt-4 space-y-2 text-sm font-medium">
        <div className="flex justify-between">
          <dt>Items</dt>
          <dd>{itemCount}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t-2 border-neutral-950 pt-4">
        <span className="font-bold">Total</span>
        <span data-display className="text-3xl font-extrabold">
          {formatPrice(subtotal)}
        </span>
      </div>
      <Link to="/checkout" className={`${buttonClasses('dark', 'md', true)} mt-5`}>
        Proceed to checkout
      </Link>
    </aside>
  )
}
