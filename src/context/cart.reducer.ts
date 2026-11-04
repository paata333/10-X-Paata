import type { CartItem, CartProduct, CartState } from '../types/cart'
import { Cart } from '../models/Cart'

export type CartAction =
  | { type: 'ADD_ITEM'; product: CartProduct; qty: number }
  | { type: 'SET_QTY'; productId: number; qty: number }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'CLEAR' }
  | { type: 'APPLY_PROMO'; code: string }
  | { type: 'REMOVE_PROMO' }

export const emptyCart: CartState = { items: [], promoCode: null }

// Returns why a product cannot be added, or null when it can. Shared by the reducer and the UI.
export function getAddError(items: CartItem[], product: CartProduct, qty: number): string | null {
  if (!Number.isInteger(qty) || qty < 1) {
    return 'Quantity must be at least 1'
  }
  if (product.stock === 0) {
    return 'This product is out of stock'
  }

  const existing = items.find((item) => item.productId === product.id)
  const inCart = existing ? existing.quantity : 0

  if (inCart + qty > product.stock) {
    return inCart > 0
      ? `Only ${product.stock} in stock. You already have ${inCart} in your cart.`
      : `Only ${product.stock} in stock.`
  }

  return null
}

// A pure function: no localStorage, no side effects.
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (getAddError(state.items, action.product, action.qty) !== null) {
        return state
      }
      const { product, qty } = action
      const exists = state.items.some((item) => item.productId === product.id)
      if (exists) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === product.id ? { ...item, quantity: item.quantity + qty } : item,
          ),
        }
      }
      const newItem: CartItem = {
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        quantity: qty,
      }
      return { ...state, items: [...state.items, newItem] }
    }
    case 'SET_QTY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: Math.min(Math.max(action.qty, 1), item.stock) }
            : item,
        ),
      }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.productId !== action.productId) }
    case 'CLEAR':
      return emptyCart
    case 'APPLY_PROMO':
      return Cart.isValidPromo(action.code) ? { ...state, promoCode: Cart.PROMO_CODE } : state
    case 'REMOVE_PROMO':
      return { ...state, promoCode: null }
    default: {
      const unhandled: never = action
      return unhandled
    }
  }
}
