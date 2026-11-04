import type { CartItem } from '../../types/cart'
import type { OrderTotals } from '../../types/order'
import { getLineTotal } from '../../utils/cart'
import { formatPrice } from '../../utils/format'
import { TotalsList } from '../ui/TotalsList'

interface OrderItemsListProps {
  items: CartItem[]
  totals: OrderTotals
  promoLabel?: string
}

export function OrderItemsList({ items, totals, promoLabel }: OrderItemsListProps) {
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
      <div className="mt-2 border-t-2 border-neutral-950 pt-4">
        <TotalsList
          subtotal={totals.subtotal}
          discount={totals.discount}
          shipping={totals.shippingCost}
          total={totals.total}
          promoLabel={promoLabel}
        />
      </div>
    </div>
  )
}
