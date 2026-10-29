interface StockBadgeProps {
  stock: number
}

const badgeClasses = 'rounded-full border-2 border-neutral-950 px-2 py-0.5 text-xs font-bold'

export function StockBadge({ stock }: StockBadgeProps) {
  if (stock === 0) {
    return <span className={`${badgeClasses} bg-red-300`}>Out of stock</span>
  }

  if (stock <= 5) {
    return <span className={`${badgeClasses} bg-orange-300`}>Only {stock} left!</span>
  }

  return <span className={`${badgeClasses} bg-green-300`}>In stock</span>
}
