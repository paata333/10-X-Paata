import type { CartItem } from '../../types/cart'
import { getLineTotal } from '../../utils/cart'
import { formatPrice } from '../../utils/format'

interface OrderItemsListProps {
  items: CartItem[]
  total: number
}

export function OrderItemsList({ items, total }: OrderItemsListProps) {
  return (
    <div>
      <ul className="divide-y-2 divide-dashed divide-neutral-950/25">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-3 py-3">
            <img
              src={item.thumbnail}
              alt=""
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-lg border-2 border-neutral-950 bg-lime-200 object-contain p-0.5"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{item.title}</p>
              <p className="text-xs text-neutral-600">Qty {item.quantity}</p>
            </div>
            <p className="text-sm font-bold">{formatPrice(getLineTotal(item))}</p>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-baseline justify-between border-t-2 border-neutral-950 pt-4">
        <span className="font-bold">Total</span>
        <span data-display className="text-3xl font-extrabold">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  )
}
