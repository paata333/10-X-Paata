import { formatPrice } from '../../utils/format'

interface TotalsListProps {
  subtotal: number
  discount: number
  shipping: number
  total: number
  promoLabel?: string
}

export function TotalsList({ subtotal, discount, shipping, total, promoLabel }: TotalsListProps) {
  return (
    <div>
      <dl className="space-y-2 text-sm font-medium">
        <div className="flex justify-between gap-4">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between gap-4">
            <dt>{promoLabel ?? 'Discount'}</dt>
            <dd>−{formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
        </div>
      </dl>
      <div className="mt-4 flex items-baseline justify-between gap-4 border-t-2 border-neutral-950 pt-4">
        <span className="font-bold">Total</span>
        <span data-display className="text-3xl font-extrabold">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  )
}
