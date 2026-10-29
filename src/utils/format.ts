const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatPrice(value: number): string {
  return priceFormatter.format(value)
}

export function discountedPrice(price: number, discountPercentage: number): number {
  return Math.round(price * (1 - discountPercentage / 100) * 100) / 100
}

export function formatCategory(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
