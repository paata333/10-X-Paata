import type { Category, Product, ProductsResponse } from '../types/product'
import { SORT_OPTIONS, type SortValue } from '../utils/catalogParams'
import { guardToParser, isProduct, isProductsResponse, parseCategories } from '../utils/guards'
import { ApiClient } from './ApiClient'

const apiClient = new ApiClient('https://dummyjson.com')

export interface ProductsQuery {
  q?: string
  category?: string
  sort?: SortValue
  limit: number
  skip: number
}

export function buildProductsPath(query: ProductsQuery): string {
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

  return `${path}?${params.toString()}`
}

export function fetchProducts(query: ProductsQuery, signal?: AbortSignal): Promise<ProductsResponse> {
  return apiClient.get(buildProductsPath(query), guardToParser(isProductsResponse), signal)
}

export function fetchProduct(id: number, signal?: AbortSignal): Promise<Product> {
  return apiClient.get(`/products/${id}`, guardToParser(isProduct), signal)
}

export function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  return apiClient.get('/products/categories', parseCategories, signal)
}
