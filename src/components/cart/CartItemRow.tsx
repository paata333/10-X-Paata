import { Link } from 'react-router-dom'
import type { CartItem } from '../../types/cart'
import { getLineTotal, getUnitPrice } from '../../utils/cart'
import { formatPrice } from '../../utils/format'
import { QuantityStepper } from '../ui/QuantityStepper'

interface CartItemRowProps {
  item: CartItem
  onQuantityChange: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  const productUrl = `/products/${item.productId}`

  return (
    <article className="grid grid-cols-[5rem_1fr] gap-x-4 gap-y-3 rounded-2xl border-2 border-neutral-950 bg-white p-4 shadow-[4px_4px_0_0_#0a0a0a] sm:grid-cols-[6rem_1fr_auto]">
      <Link
        to={productUrl}
        className="row-span-2 self-start overflow-hidden rounded-xl border-2 border-neutral-950 bg-lime-200 sm:row-span-1"
      >
        <img
          src={item.thumbnail}
          alt={item.title}
          width={96}
          height={96}
          className="aspect-square w-full object-contain p-1"
        />
      </Link>

      <div className="min-w-0">
        <h3 className="text-lg font-bold leading-tight">
          <Link to={productUrl} className="hover:underline">
            {item.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-neutral-600">{formatPrice(getUnitPrice(item))} each</p>
        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          aria-label={`Remove ${item.title} from cart`}
          className="mt-2 text-sm font-bold text-red-700 underline decoration-2 underline-offset-4 hover:bg-red-100"
        >
          Remove
        </button>
      </div>

      <div className="col-span-2 flex items-center justify-between gap-4 sm:col-span-1 sm:flex-col sm:items-end sm:justify-between">
        <QuantityStepper
          value={item.quantity}
          max={item.stock}
          itemName={item.title}
          onChange={(quantity) => onQuantityChange(item.productId, quantity)}
        />
        <p data-display className="text-xl font-extrabold">
          {formatPrice(getLineTotal(item))}
        </p>
      </div>
    </article>
  )
}
