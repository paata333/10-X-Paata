import type { Review } from '../../types/product'
import { formatDate } from '../../utils/format'
import { StarDisplay } from './StarRating'

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-dashed border-neutral-950/40 p-6 text-neutral-700">
        No reviews yet. Be the first to write one.
      </p>
    )
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review, index) => (
        <li
          key={`${review.date}-${review.reviewerName}-${index}`}
          className="rounded-2xl border-2 border-neutral-950 bg-white p-4"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="font-bold">{review.reviewerName}</p>
            <StarDisplay rating={review.rating} />
            <time dateTime={review.date} className="text-sm text-neutral-600">
              {formatDate(review.date)}
            </time>
          </div>
          <p className="mt-2 text-neutral-800">{review.comment}</p>
        </li>
      ))}
    </ul>
  )
}
