import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { Cart } from '../models/Cart'
import type { AddItemResult, CartItem, CartProduct } from '../types/cart'
import { loadCartState, saveCartState } from '../utils/storage'
import { cartReducer, getAddError } from './cart.reducer'

interface ReorderEntry {
  product: CartProduct
  qty: number
}

interface CartContextValue {
  items: CartItem[]
  promoCode: string | null
  cart: Cart
  itemCount: number
  addItem: (product: CartProduct, quantity: number) => AddItemResult
  addItems: (entries: ReorderEntry[]) => { added: number; skipped: number }
  setQuantity: (productId: number, quantity: number) => void
  removeItem: (productId: number) => void
  clearCart: () => void
  applyPromo: (code: string) => boolean
  removePromo: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCartState)

  useEffect(() => {
    saveCartState(state)
  }, [state])

  const addItem = useCallback(
    (product: CartProduct, quantity: number): AddItemResult => {
      const error = getAddError(state.items, product, quantity)
      if (error !== null) {
        return { added: false, message: error }
      }
      dispatch({ type: 'ADD_ITEM', product, qty: quantity })
      return { added: true, message: 'Added to cart ✓' }
    },
    [state.items],
  )

  // Adds several products at once (reorder). Each one is checked against the running contents.
  const addItems = useCallback(
    (entries: ReorderEntry[]) => {
      let working = state.items
      let added = 0
      let skipped = 0

      for (const { product, qty } of entries) {
        if (getAddError(working, product, qty) !== null) {
          skipped += 1
          continue
        }
        const action = { type: 'ADD_ITEM', product, qty } as const
        working = cartReducer({ items: working, promoCode: null }, action).items
        dispatch(action)
        added += 1
      }

      return { added, skipped }
    },
    [state.items],
  )

  const setQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: 'SET_QTY', productId, qty: quantity })
  }, [])

  const removeItem = useCallback((productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', productId })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const applyPromo = useCallback((code: string): boolean => {
    if (!Cart.isValidPromo(code)) {
      return false
    }
    dispatch({ type: 'APPLY_PROMO', code })
    return true
  }, [])

  const removePromo = useCallback(() => {
    dispatch({ type: 'REMOVE_PROMO' })
  }, [])

  const cart = useMemo(() => new Cart(state.items, state.promoCode), [state])

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      promoCode: state.promoCode,
      cart,
      itemCount: cart.itemCount,
      addItem,
      addItems,
      setQuantity,
      removeItem,
      clearCart,
      applyPromo,
      removePromo,
    }),
    [state, cart, addItem, addItems, setQuantity, removeItem, clearCart, applyPromo, removePromo],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}
