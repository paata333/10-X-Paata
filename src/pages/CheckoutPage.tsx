import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { OrderConfirmation } from '../components/checkout/OrderConfirmation'
import { OrderItemsList } from '../components/checkout/OrderItemsList'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { Page } from '../components/ui/Page'
import { useCart } from '../context/CartContext'
import type {
  CheckoutFormErrors,
  CheckoutFormValues,
  OrderSummary,
} from '../types/checkout'
import { validateCheckout } from '../utils/validation'

const ORDER_PROCESSING_MS = 700

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const [values, setValues] = useState<CheckoutFormValues>({
    fullName: '',
    email: '',
    address: '',
    city: '',
  })
  const [errors, setErrors] = useState<CheckoutFormErrors>({})
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [order, setOrder] = useState<OrderSummary | null>(null)

  useEffect(() => {
    if (!isPlacingOrder) {
      return
    }

    const timer = window.setTimeout(() => {
      setOrder({ items, total: subtotal, customer: values })
      clearCart()
      setIsPlacingOrder(false)
    }, ORDER_PROCESSING_MS)

    return () => window.clearTimeout(timer)
  }, [isPlacingOrder, items, subtotal, values, clearCart])

  if (order) {
    return <OrderConfirmation order={order} />
  }

  if (items.length === 0) {
    return (
      <Navigate
        to="/cart"
        replace
        state={{ notice: 'Your cart is empty. Add some products before checking out.' }}
      />
    )
  }

  const handleChange =
    (field: keyof CheckoutFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validateCheckout(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsPlacingOrder(true)
  }

  return (
    <Page title="Checkout">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="h-fit rounded-2xl border-2 border-neutral-950 bg-white p-6 shadow-[6px_6px_0_0_#0a0a0a] sm:p-8"
        >
          <h2 className="text-2xl font-extrabold tracking-tight">Shipping details</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Demo checkout: nothing is charged and no data leaves your browser.
          </p>
          <fieldset disabled={isPlacingOrder} className="mt-6 space-y-4">
            <FormField
              id="fullName"
              label="Full name"
              value={values.fullName}
              error={errors.fullName}
              autoComplete="name"
              onChange={handleChange('fullName')}
            />
            <FormField
              id="email"
              label="Email"
              type="email"
              value={values.email}
              error={errors.email}
              autoComplete="email"
              onChange={handleChange('email')}
            />
            <FormField
              id="address"
              label="Address"
              value={values.address}
              error={errors.address}
              autoComplete="street-address"
              onChange={handleChange('address')}
            />
            <FormField
              id="city"
              label="City"
              value={values.city}
              error={errors.city}
              autoComplete="address-level2"
              onChange={handleChange('city')}
            />
            <Button type="submit" fullWidth disabled={isPlacingOrder}>
              {isPlacingOrder ? 'Placing order…' : 'Place order'}
            </Button>
          </fieldset>
        </form>

        <aside
          aria-label="Your order"
          className="h-fit rounded-2xl border-2 border-neutral-950 bg-lime-300 p-5 shadow-[6px_6px_0_0_#0a0a0a] lg:sticky lg:top-6"
        >
          <h2 className="mb-2 text-2xl font-extrabold tracking-tight">Your order</h2>
          <OrderItemsList items={items} total={subtotal} />
        </aside>
      </div>
    </Page>
  )
}
