import type { CartItem } from '../types/cart'
import type { Review } from '../types/product'

export const CART_STORAGE_KEY = 'shop_cart'

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const item = value as Record<string, unknown>
  return (
    typeof item.productId === 'number' &&
    typeof item.title === 'string' &&
    typeof item.thumbnail === 'string' &&
    typeof item.price === 'number' &&
    typeof item.discountPercentage === 'number' &&
    typeof item.stock === 'number' &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1
  )
}

export function loadCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (raw === null) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('items' in parsed) ||
      !Array.isArray(parsed.items)
    ) {
      return []
    }
    return parsed.items.filter(isCartItem)
  } catch {
    return []
  }
}

export function saveCartItems(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }))
  } catch {
    // Storage can be unavailable (private mode, quota): the cart then lives in memory only.
  }
}

export const REVIEWS_STORAGE_KEY = 'shop_reviews'

function isReview(value: unknown): value is Review {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const review = value as Record<string, unknown>
  return (
    typeof review.rating === 'number' &&
    review.rating >= 1 &&
    review.rating <= 5 &&
    typeof review.comment === 'string' &&
    typeof review.date === 'string' &&
    typeof review.reviewerName === 'string'
  )
}

function readReviewMap(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY)
    if (raw === null) {
      return {}
    }
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
    return {}
  } catch {
    return {}
  }
}

export function loadLocalReviews(productId: number): Review[] {
  const entry = readReviewMap()[String(productId)]
  return Array.isArray(entry) ? entry.filter(isReview) : []
}

export function saveLocalReviews(productId: number, reviews: Review[]): void {
  try {
    const map = readReviewMap()
    map[String(productId)] = reviews
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Storage can be unavailable: the review then lives in memory until the page is closed.
  }
}
