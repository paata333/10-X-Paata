import type { Category, Product, ProductsResponse } from '../types/product'
import { SORT_OPTIONS, type SortValue } from '../utils/catalogParams'
import { ApiError } from './ApiError'

const API_BASE_URL = 'https://dummyjson.com'

export interface ProductsQuery {
  q?: string
  category?: string
  sort?: SortValue
  limit: number
  skip: number
}

async function getOk(url: string, signal?: AbortSignal): Promise<Response> {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed with status ${response.status}`)
  }

  return response
}

export function buildProductsUrl(query: ProductsQuery): string {
  const params = new URLSearchParams()

  if (query.q) {
    params.set('q', query.q)
  }
  params.set('limit', String(query.limit))
  params.set('skip', String(query.skip))

  const sortOption = SORT_OPTIONS.find((option) => option.value === query.sort)
  if (sortOption?.sortBy && sortOption.order) {
    params.set('sortBy', sortOption.sortBy)
    params.set('order', sortOption.order)
  }

  // Search and category are different endpoints, so only one of them is used.
  let path = '/products'
  if (query.q) {
    path = '/products/search'
  } else if (query.category) {
    path = `/products/category/${encodeURIComponent(query.category)}`
  }

  return `${API_BASE_URL}${path}?${params.toString()}`
}

export async function fetchProducts(
  query: ProductsQuery,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  const response = await getOk(buildProductsUrl(query), signal)
  const data: ProductsResponse = await response.json()
  return data
}

export async function fetchProduct(id: number, signal?: AbortSignal): Promise<Product> {
  const response = await getOk(`${API_BASE_URL}/products/${id}`, signal)
  const data: Product = await response.json()
  return data
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const response = await getOk(`${API_BASE_URL}/products/categories`, signal)
  const data: Category[] = await response.json()
  return data
}
