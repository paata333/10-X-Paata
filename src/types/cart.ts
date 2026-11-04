import type { Product } from './product'

export interface CartItem {
  productId: number
  title: string
  thumbnail: string
  price: number
  discountPercentage: number
  stock: number
  quantity: number
}

export interface CartState {
  items: CartItem[]
  promoCode: string | null
}

// Only the fields the cart needs: a full Product and a reordered item both fit.
export type CartProduct = Pick<
  Product,
  'id' | 'title' | 'thumbnail' | 'price' | 'discountPercentage' | 'stock'
>

export interface AddItemResult {
  added: boolean
  message: string
}
