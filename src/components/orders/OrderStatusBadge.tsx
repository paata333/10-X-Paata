import type { OrderStatus } from '../../types/order'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

const statusClasses: Record<OrderStatus, string> = {
  Processing: 'bg-neutral-200',
  Shipped: 'bg-sky-300',
  Delivered: 'bg-green-300',
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full border-2 border-neutral-950 px-2.5 py-0.5 text-xs font-bold ${statusClasses[status]}`}
    >
      {status}
    </span>
  )
}
