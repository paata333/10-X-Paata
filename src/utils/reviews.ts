import type { Review } from '../types/product'

export function getAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) {
    return 0
  }
  const sum = reviews.reduce((total, review) => total + review.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

// Reviews written in this browser come first, then the ones that came with the API.
export function mergeReviews(local: Review[], remote: Review[] | undefined): Review[] {
  return [...local, ...(remote ?? [])]
}

export function formatReviewDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
