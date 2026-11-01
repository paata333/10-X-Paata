import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AddItemResult, CartItem } from '../types/cart'
import type { Product } from '../types/product'
import { getItemCount, getSubtotal } from '../utils/cart'
import { loadCartItems, saveCartItems } from '../utils/storage'

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (product: Product, quantity: number) => AddItemResult
  setQuantity: (productId: number, quantity: number) => void
  removeItem: (productId: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(loadCartItems)

  useEffect(() => {
    saveCartItems(items)
  }, [items])

  const addItem = useCallback(
    (product: Product, quantity: number): AddItemResult => {
      if (!Number.isInteger(quantity) || quantity < 1) {
        return { added: false, message: 'Quantity must be at least 1' }
      }
      if (product.stock === 0) {
        return { added: false, message: 'This product is out of stock' }
      }

      const existing = items.find((item) => item.productId === product.id)
      const inCart = existing ? existing.quantity : 0

      if (inCart + quantity > product.stock) {
        const message =
          inCart > 0
            ? `Only ${product.stock} in stock. You already have ${inCart} in your cart.`
            : `Only ${product.stock} in stock.`
        return { added: false, message }
      }

      if (existing) {
        setItems((prev) =>
          prev.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        )
      } else {
        const newItem: CartItem = {
          productId: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          price: product.price,
          discountPercentage: product.discountPercentage,
          stock: product.stock,
          quantity,
        }
        setItems((prev) => [...prev, newItem])
      }

      return { added: true, message: 'Added to cart ✓' }
    },
    [items],
  )

  const setQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.stock) }
          : item,
      ),
    )
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: getItemCount(items),
      subtotal: getSubtotal(items),
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [items, addItem, setQuantity, removeItem, clearCart],
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
