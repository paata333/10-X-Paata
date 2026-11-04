import type { OrderStatus } from '../../types/order'
import { ORDER_STATUSES } from '../../utils/orders'

interface OrderStatusTimelineProps {
  status: OrderStatus
}

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  const currentIndex = ORDER_STATUSES.indexOf(status)

  return (
    <ol aria-label="Order progress" className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {ORDER_STATUSES.map((step, index) => {
        const isDone = index <= currentIndex
        return (
          <li key={step} className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full border-2 border-neutral-950 px-3 py-1 text-sm font-bold ${
                isDone ? 'bg-lime-300' : 'bg-white text-neutral-600'
              }`}
            >
              <span aria-hidden="true">{isDone ? '✓' : '○'}</span>
              {step}
              <span className="sr-only">{isDone ? ' (done)' : ' (waiting)'}</span>
            </span>
            {index < ORDER_STATUSES.length - 1 && (
              <span aria-hidden="true" className="font-bold">
                →
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
