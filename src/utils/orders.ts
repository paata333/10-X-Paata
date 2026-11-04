import type { OrderData, OrderStatus } from '../types/order'

const MINUTE_MS = 60_000

export const ORDER_STATUSES: OrderStatus[] = ['Processing', 'Shipped', 'Delivered']

// The status is never stored: it is calculated from the time that has passed since the order.
export function getOrderStatus(placedAt: string, now: Date = new Date()): OrderStatus {
  const elapsed = now.getTime() - new Date(placedAt).getTime()

  if (Number.isNaN(elapsed) || elapsed < MINUTE_MS) {
    return 'Processing'
  }
  if (elapsed <= 3 * MINUTE_MS) {
    return 'Shipped'
  }
  return 'Delivered'
}

export function getNextOrderNumber(orders: OrderData[]): string {
  const highest = orders.reduce((max, order) => {
    const sequence = Number(order.number.replace('10X-', ''))
    return Number.isFinite(sequence) && sequence > max ? sequence : max
  }, 0)
  return `10X-${String(highest + 1).padStart(5, '0')}`
}

export function sortNewestFirst(orders: OrderData[]): OrderData[] {
  return [...orders].sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
  )
}
