import type { OrderData, OrderStatus, ShippingInfo } from '../types/order'
import { getNextOrderNumber, getOrderStatus } from '../utils/orders'
import type { Cart } from './Cart'

export class Order {
  private readonly data: OrderData

  private constructor(data: OrderData) {
    this.data = data
  }

  // Builds an order from the cart as it is right now. No card data exists in this project.
  static create(
    cart: Cart,
    shipping: ShippingInfo,
    existingOrders: OrderData[],
    now: Date = new Date(),
  ): Order {
    return new Order({
      id: now.getTime(),
      number: getNextOrderNumber(existingOrders),
      items: cart.lines,
      shipping: { ...shipping },
      subtotal: cart.subtotal(),
      discount: cart.discount(),
      shippingCost: cart.shipping(),
      total: cart.total(),
      placedAt: now.toISOString(),
    })
  }

  static fromJSON(data: OrderData): Order {
    return new Order(data)
  }

  get id(): number {
    return this.data.id
  }

  // Does not change the order: the same input always gives the same answer.
  getStatus(now: Date = new Date()): OrderStatus {
    return getOrderStatus(this.data.placedAt, now)
  }

  toJSON(): OrderData {
    return { ...this.data, items: this.data.items.map((item) => ({ ...item })) }
  }
}
