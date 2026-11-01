import { Link } from 'react-router-dom'
import type { OrderSummary } from '../../types/checkout'
import { buttonClasses } from '../ui/buttonStyles'
import { OrderItemsList } from './OrderItemsList'

interface OrderConfirmationProps {
  order: OrderSummary
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const { customer } = order

  return (
    <section className="mx-auto max-w-2xl">
      <div className="rounded-2xl border-2 border-neutral-950 bg-lime-300 p-6 shadow-[6px_6px_0_0_#0a0a0a] sm:p-8">
        <span
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-full border-2 border-neutral-950 bg-white text-2xl font-extrabold"
        >
          ✓
        </span>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          Thank you! Your order has been placed.
        </h1>
        <p className="mt-2 font-medium">
          Shipping to {customer.fullName}, {customer.address}, {customer.city}.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border-2 border-neutral-950 bg-white p-5 shadow-[4px_4px_0_0_#0a0a0a]">
        <h2 className="mb-2 text-xl font-extrabold tracking-tight">Order summary</h2>
        <OrderItemsList items={order.items} total={order.total} />
      </div>

      <Link to="/" className={`${buttonClasses('dark')} mt-8`}>
        Continue shopping
      </Link>
    </section>
  )
}
