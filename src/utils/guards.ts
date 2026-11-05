import { ApiError } from '../api/ApiError'
import type { Parser } from '../types/api'
import type { Category, Product, ProductsResponse, Review } from '../types/product'
import { formatCategory } from './format'

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function isReview(value: unknown): value is Review {
  return (
    isRecord(value) &&
    typeof value.rating === 'number' &&
    value.rating >= 1 &&
    value.rating <= 5 &&
    typeof value.comment === 'string' &&
    typeof value.date === 'string' &&
    typeof value.reviewerName === 'string'
  )
}

// JSON has no types: a Product coming from the network is only trusted after these checks.
export function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.category === 'string' &&
    (value.brand === undefined || value.brand === null || typeof value.brand === 'string') &&
    typeof value.price === 'number' &&
    typeof value.discountPercentage === 'number' &&
    typeof value.rating === 'number' &&
    typeof value.stock === 'number' &&
    typeof value.thumbnail === 'string' &&
    Array.isArray(value.images) &&
    value.images.every((image) => typeof image === 'string') &&
    (value.reviews === undefined ||
      (Array.isArray(value.reviews) && value.reviews.every(isReview)))
  )
}

export function isProductsResponse(value: unknown): value is ProductsResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.products) &&
    value.products.every(isProduct) &&
    typeof value.total === 'number' &&
    typeof value.skip === 'number' &&
    typeof value.limit === 'number'
  )
}

export function guardToParser<T>(guard: (raw: unknown) => raw is T): Parser<T> {
  return (raw) => (guard(raw) ? raw : null)
}

// The categories endpoint answers with objects ({ slug, name, url }); plain strings are
// accepted too, and anything else in the list is skipped instead of breaking the filter.
export function parseCategories(raw: unknown): Category[] | null {
  if (!Array.isArray(raw)) {
    return null
  }

  const categories: Category[] = []
  for (const entry of raw) {
    if (typeof entry === 'string') {
      categories.push({ slug: entry, name: formatCategory(entry), url: '' })
    } else if (isRecord(entry) && typeof entry.slug === 'string') {
      categories.push({
        slug: entry.slug,
        name: typeof entry.name === 'string' ? entry.name : formatCategory(entry.slug),
        url: typeof entry.url === 'string' ? entry.url : '',
      })
    }
  }
  return categories
}
