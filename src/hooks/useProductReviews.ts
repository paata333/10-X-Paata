import { useCallback, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import type { Product, Review, ReviewFormValues } from '../types/product'
import { getAverageRating, mergeReviews } from '../utils/reviews'
import { loadLocalReviews, saveLocalReviews } from '../utils/storage'

export function useProductReviews(product: Product) {
  const { user } = useAuth()
  const [localReviews, setLocalReviews] = useState<Review[]>(() => loadLocalReviews(product.id))

  const reviews = useMemo(
    () => mergeReviews(localReviews, product.reviews),
    [localReviews, product.reviews],
  )

  const averageRating = useMemo(
    () => (reviews.length > 0 ? getAverageRating(reviews) : product.rating),
    [reviews, product.rating],
  )

  const addReview = useCallback(
    (values: ReviewFormValues) => {
      const review: Review = {
        rating: values.rating,
        comment: values.comment.trim(),
        date: new Date().toISOString(),
        reviewerName: user.isLoggedIn ? user.username : 'Guest',
      }
      const next = [review, ...localReviews]
      setLocalReviews(next)
      saveLocalReviews(product.id, next)
    },
    [localReviews, product.id, user],
  )

  return { reviews, averageRating, addReview }
}
