import type { CartItem } from '../types/cart'
import { discountedPrice } from './format'

export function getUnitPrice(item: CartItem): number {
  return discountedPrice(item.price, item.discountPercentage)
}

export function getLineTotal(item: CartItem): number {
  return Math.round(getUnitPrice(item) * item.quantity * 100) / 100
}

export function getSubtotal(items: CartItem[]): number {
  const sum = items.reduce((total, item) => total + getLineTotal(item), 0)
  return Math.round(sum * 100) / 100
}

export function getItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}
