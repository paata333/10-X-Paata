import { Cart } from '../models/Cart'
import { StorageService } from '../models/StorageService'
import type { CartItem, CartState } from '../types/cart'
import type { OrderData, ShippingInfo } from '../types/order'
import type { Review } from '../types/product'

export const STORAGE_KEYS = {
  cart: 'shop_cart',
  orders: 'shop_orders',
  reviews: 'shop_reviews',
  theme: 'shop_theme',
} as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCartItem(value: unknown): value is CartItem {
  return (
    isRecord(value) &&
    typeof value.productId === 'number' &&
    typeof value.title === 'string' &&
    typeof value.thumbnail === 'string' &&
    typeof value.price === 'number' &&
    typeof value.discountPercentage === 'number' &&
    typeof value.stock === 'number' &&
    typeof value.quantity === 'number' &&
    Number.isInteger(value.quantity) &&
    value.quantity >= 1
  )
}

function isReview(value: unknown): value is Review {
  return (
    isRecord(value) &&
    typeof value.rating === 'number' &&
    value.rating >= 1 &&
    value.rating <= 5 &&
    typeof value.comment === 'string' &&
    typeof value.date === 'string' &&
    typeof value.reviewerName === 'string'
  )
}

function isShippingInfo(value: unknown): value is ShippingInfo {
  return (
    isRecord(value) &&
    typeof value.fullName === 'string' &&
    typeof value.email === 'string' &&
    typeof value.address === 'string' &&
    typeof value.city === 'string'
  )
}

function isOrderData(value: unknown): value is OrderData {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.number === 'string' &&
    Array.isArray(value.items) &&
    value.items.every(isCartItem) &&
    isShippingInfo(value.shipping) &&
    typeof value.subtotal === 'number' &&
    typeof value.discount === 'number' &&
    typeof value.shippingCost === 'number' &&
    typeof value.total === 'number' &&
    typeof value.placedAt === 'string'
  )
}

// Older saved carts have no promoCode and a damaged item must not break the whole cart.
function parseCartState(raw: unknown): CartState | null {
  if (!isRecord(raw) || !Array.isArray(raw.items)) {
    return null
  }
  const promo = raw.promoCode
  return {
    items: raw.items.filter(isCartItem),
    promoCode: typeof promo === 'string' && Cart.isValidPromo(promo) ? Cart.PROMO_CODE : null,
  }
}

function parseReviewMap(raw: unknown): Record<string, Review[]> | null {
  if (!isRecord(raw)) {
    return null
  }
  const result: Record<string, Review[]> = {}
  for (const [productId, entry] of Object.entries(raw)) {
    if (Array.isArray(entry)) {
      result[productId] = entry.filter(isReview)
    }
  }
  return result
}

function parseOrders(raw: unknown): OrderData[] | null {
  return Array.isArray(raw) ? raw.filter(isOrderData) : null
}

const cartStorage = new StorageService<CartState>(STORAGE_KEYS.cart, parseCartState)
const reviewsStorage = new StorageService<Record<string, Review[]>>(
  STORAGE_KEYS.reviews,
  parseReviewMap,
)
const ordersStorage = new StorageService<OrderData[]>(STORAGE_KEYS.orders, parseOrders)

export function loadCartState(): CartState {
  return cartStorage.get() ?? { items: [], promoCode: null }
}

export function saveCartState(state: CartState): void {
  cartStorage.set(state)
}

export function loadLocalReviews(productId: number): Review[] {
  return reviewsStorage.get()?.[String(productId)] ?? []
}

export function saveLocalReviews(productId: number, reviews: Review[]): void {
  reviewsStorage.set({ ...(reviewsStorage.get() ?? {}), [String(productId)]: reviews })
}

export function loadOrders(): OrderData[] {
  return ordersStorage.get() ?? []
}

export function saveOrders(orders: OrderData[]): void {
  ordersStorage.set(orders)
}

// Used by "Clear local data": the session (React state) and the theme are not touched.
export function clearLocalData(): void {
  cartStorage.remove()
  ordersStorage.remove()
  reviewsStorage.remove()
}
