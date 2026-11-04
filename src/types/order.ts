import type { CartItem } from './cart'

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered'

export interface ShippingInfo {
  fullName: string
  email: string
  address: string
  city: string
}

export interface OrderTotals {
  subtotal: number
  discount: number
  shippingCost: number
  total: number
}

export interface OrderData extends OrderTotals {
  id: number
  number: string
  items: CartItem[]
  shipping: ShippingInfo
  placedAt: string
}
