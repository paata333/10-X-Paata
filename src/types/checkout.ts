import type { CartItem } from './cart'

export interface CheckoutFormValues {
  fullName: string
  email: string
  address: string
  city: string
}

export interface CheckoutFormErrors {
  fullName?: string
  email?: string
  address?: string
  city?: string
}

export interface OrderSummary {
  items: CartItem[]
  total: number
  customer: CheckoutFormValues
}
