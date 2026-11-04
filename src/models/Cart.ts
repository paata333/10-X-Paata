import type { CartItem } from '../types/cart'
import { getItemCount, getSubtotal } from '../utils/cart'

export interface ICart {
  subtotal(): number
  discount(): number
  shipping(): number
  total(): number
}

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100
}

// All cart arithmetic lives here, without any UI, so it can be tested on its own.
export class Cart implements ICart {
  static readonly PROMO_CODE = '10X10'
  static readonly PROMO_RATE = 0.1
  static readonly FREE_SHIPPING_FROM = 100
  static readonly SHIPPING_COST = 10

  private readonly items: CartItem[]
  private readonly promoCode: string | null

  constructor(items: CartItem[], promoCode: string | null = null) {
    this.items = items
    this.promoCode = promoCode
  }

  static isValidPromo(code: string): boolean {
    return code.trim().toUpperCase() === Cart.PROMO_CODE
  }

  // A copy, so callers cannot change the cart by accident.
  get lines(): CartItem[] {
    return this.items.map((item) => ({ ...item }))
  }

  get itemCount(): number {
    return getItemCount(this.items)
  }

  get isEmpty(): boolean {
    return this.items.length === 0
  }

  get hasPromo(): boolean {
    return this.promoCode !== null && Cart.isValidPromo(this.promoCode)
  }

  subtotal(): number {
    return getSubtotal(this.items)
  }

  discount(): number {
    return this.hasPromo ? roundToCents(this.subtotal() * Cart.PROMO_RATE) : 0
  }

  // Shipping is free when the goods cost at least FREE_SHIPPING_FROM after the discount.
  shipping(): number {
    if (this.isEmpty) {
      return 0
    }
    const goods = roundToCents(this.subtotal() - this.discount())
    return goods >= Cart.FREE_SHIPPING_FROM ? 0 : Cart.SHIPPING_COST
  }

  total(): number {
    return roundToCents(this.subtotal() - this.discount() + this.shipping())
  }
}
