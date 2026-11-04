import { useMemo } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { OrderStatusBadge } from '../components/orders/OrderStatusBadge'
import { OrderStatusTimeline } from '../components/orders/OrderStatusTimeline'
import { Button } from '../components/ui/Button'
import { TotalsList } from '../components/ui/TotalsList'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useNow } from '../hooks/useNow'
import { Cart } from '../models/Cart'
import { getLineTotal, getUnitPrice } from '../utils/cart'
import { formatDate, formatPrice } from '../utils/format'
import { getOrderStatus } from '../utils/orders'
import { loadOrders } from '../utils/storage'
import { NotFoundPage } from './NotFoundPage'

const STATUS_REFRESH_MS = 30_000

function wasJustPlaced(state: unknown): boolean {
  return (
    typeof state === 'object' &&
    state !== null &&
    'justPlaced' in state &&
    state.justPlaced === true
  )
}

export function OrderDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { addItems } = useCart()
  const { showToast } = useToast()
  const now = useNow(STATUS_REFRESH_MS)

  const order = useMemo(() => {
    if (id === undefined || !/^\d+$/.test(id)) {
      return undefined
    }
    return loadOrders().find((candidate) => candidate.id === Number(id))
  }, [id])

  if (order === undefined) {
    return <NotFoundPage />
  }

  const status = getOrderStatus(order.placedAt, now)
  const promoLabel = `Discount (${Cart.PROMO_CODE} −${Math.round(Cart.PROMO_RATE * 100)}%)`

  const handleReorder = () => {
    const { added, skipped } = addItems(
      order.items.map((item) => ({
        product: {
          id: item.productId,
          title: item.title,
          thumbnail: item.thumbnail,
          price: item.price,
          discountPercentage: item.discountPercentage,
          stock: item.stock,
        },
        qty: item.quantity,
      })),
    )

    if (added === 0) {
      showToast('Nothing could be added: not enough stock', 'error')
      return
    }
    showToast(
      skipped > 0
        ? `Items added to cart ✓ (${skipped} skipped: not enough stock)`
        : 'Items added to cart ✓',
    )
    navigate('/cart')
  }

  return (
    <section>
      <Link
        to="/orders"
        className="mb-4 inline-flex min-h-11 items-center px-1 text-sm font-bold underline decoration-2 underline-offset-4 hover:bg-lime-300"
      >
        ← All orders
      </Link>

      {wasJustPlaced(location.state) && (
        <p
          role="status"
          className="mb-6 rounded-xl border-2 border-neutral-950 bg-lime-300 px-4 py-3 text-lg font-extrabold shadow-[4px_4px_0_0_#0a0a0a]"
        >
          Thank you! Your order has been placed.
        </p>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Order #{order.number}
          </h1>
          <p className="mt-1 text-neutral-600">Placed on {formatDate(order.placedAt)}</p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      <div className="mt-6">
        <OrderStatusTimeline status={status} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 overflow-x-auto rounded-2xl border-2 border-neutral-950 bg-white shadow-[4px_4px_0_0_#0a0a0a]">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">Items in this order</caption>
            <thead className="border-b-2 border-neutral-950 bg-lime-200 text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Product
                </th>
                <th scope="col" className="px-4 py-3">
                  Qty
                </th>
                <th scope="col" className="px-4 py-3">
                  Unit price
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Line total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-dashed divide-neutral-950/25">
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.thumbnail}
                        alt=""
                        width={48}
                        height={48}
                        className="size-12 shrink-0 rounded-lg border-2 border-neutral-950 bg-lime-200 object-contain p-0.5"
                      />
                      <Link
                        to={`/products/${item.productId}`}
                        className="inline-flex min-h-11 items-center font-bold hover:underline"
                      >
                        {item.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{formatPrice(getUnitPrice(item))}</td>
                  <td className="px-4 py-3 text-right font-bold">
                    {formatPrice(getLineTotal(item))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <section
            aria-labelledby="shipping-heading"
            className="rounded-2xl border-2 border-neutral-950 bg-white p-5 shadow-[4px_4px_0_0_#0a0a0a]"
          >
            <h2 id="shipping-heading" className="text-xl font-extrabold tracking-tight">
              Shipping address
            </h2>
            <address className="mt-2 not-italic leading-relaxed">
              {order.shipping.fullName}
              <br />
              {order.shipping.address}
              <br />
              {order.shipping.city}
              <br />
              <span className="text-neutral-600">{order.shipping.email}</span>
            </address>
          </section>

          <section
            aria-labelledby="totals-heading"
            className="rounded-2xl border-2 border-neutral-950 bg-lime-300 p-5 shadow-[4px_4px_0_0_#0a0a0a]"
          >
            <h2 id="totals-heading" className="mb-3 text-xl font-extrabold tracking-tight">
              Totals
            </h2>
            <TotalsList
              subtotal={order.subtotal}
              discount={order.discount}
              shipping={order.shippingCost}
              total={order.total}
              promoLabel={promoLabel}
            />
          </section>

          <Button variant="dark" fullWidth onClick={handleReorder}>
            Reorder
          </Button>
        </div>
      </div>
    </section>
  )
}
