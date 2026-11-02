import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { ReviewFormErrors, ReviewFormValues } from '../../types/product'
import { validateReview } from '../../utils/validation'
import { Button } from '../ui/Button'
import { StarInput } from './StarRating'

interface ReviewFormProps {
  onSubmit: (values: ReviewFormValues) => void
}

const emptyValues: ReviewFormValues = { rating: 0, comment: '' }

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [values, setValues] = useState<ReviewFormValues>(emptyValues)
  const [errors, setErrors] = useState<ReviewFormErrors>({})
  const [notice, setNotice] = useState<string | null>(null)

  const handleRatingChange = (rating: number) => {
    setValues((prev) => ({ ...prev, rating }))
    setErrors((prev) => ({ ...prev, rating: undefined }))
    setNotice(null)
  }

  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, comment: event.target.value }))
    setErrors((prev) => ({ ...prev, comment: undefined }))
    setNotice(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validateReview(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    onSubmit(values)
    setValues(emptyValues)
    setNotice('Review added ✓')
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-2xl border-2 border-neutral-950 bg-white p-5 shadow-[4px_4px_0_0_#0a0a0a]"
    >
      <h2 className="text-xl font-extrabold tracking-tight">Write a review</h2>
      <StarInput value={values.rating} error={errors.rating} onChange={handleRatingChange} />
      <div>
        <label
          htmlFor="review-comment"
          className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-700"
        >
          Comment
        </label>
        <textarea
          id="review-comment"
          rows={4}
          value={values.comment}
          onChange={handleCommentChange}
          aria-invalid={errors.comment ? true : undefined}
          aria-describedby={errors.comment ? 'review-comment-error' : undefined}
          className={`w-full rounded-lg border-2 bg-white px-3.5 py-2.5 text-base transition-shadow focus-visible:shadow-[3px_3px_0_0_#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 motion-reduce:transition-none ${
            errors.comment ? 'border-red-600' : 'border-neutral-950'
          }`}
        />
        {errors.comment && (
          <p
            id="review-comment-error"
            role="alert"
            className="mt-1.5 text-sm font-semibold text-red-700"
          >
            {errors.comment}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit">Submit review</Button>
        {notice && (
          <p role="status" className="text-sm font-bold">
            {notice}
          </p>
        )}
      </div>
    </form>
  )
}
