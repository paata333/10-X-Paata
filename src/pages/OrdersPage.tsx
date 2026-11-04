import { useState } from 'react'
import { Link } from 'react-router-dom'
import { OrderStatusBadge } from '../components/orders/OrderStatusBadge'
import { buttonClasses } from '../components/ui/buttonStyles'
import { Page } from '../components/ui/Page'
import { useNow } from '../hooks/useNow'
import { formatDate, formatPrice } from '../utils/format'
import { getOrderStatus, sortNewestFirst } from '../utils/orders'
import { loadOrders } from '../utils/storage'

const STATUS_REFRESH_MS = 30_000

export function OrdersPage() {
  const [orders] = useState(() => sortNewestFirst(loadOrders()))
  const now = useNow(STATUS_REFRESH_MS)

  return (
    <Page title="Orders" subtitle={orders.length > 0 ? `${orders.length} total` : undefined}>
      {orders.length === 0 ? (
        <div className="rounded-2xl border-2 border-neutral-950 bg-white px-6 py-14 text-center shadow-[5px_5px_0_0_#0a0a0a]">
          <p data-display className="text-2xl font-bold">
            You have no orders yet.
          </p>
          <Link to="/" className={`${buttonClasses('primary')} mt-6`}>
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="space-y-5">
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
            return (
              <li key={order.id}>
                <article className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl border-2 border-neutral-950 bg-white p-5 shadow-[4px_4px_0_0_#0a0a0a] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#0a0a0a] motion-reduce:transition-none">
                  <div>
                    <h2 data-display className="text-xl font-extrabold">
                      <Link
                        to={`/orders/${order.id}`}
                        className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
                      >
                        #{order.number}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-neutral-600">
                      {formatDate(order.placedAt)} · {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <OrderStatusBadge status={getOrderStatus(order.placedAt, now)} />
                    <p data-display className="text-xl font-extrabold">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </Page>
  )
}
