import type { Product, ProductsResponse } from '../types/product'
import { ApiError } from './ApiError'

const API_BASE_URL = 'https://dummyjson.com'

async function getOk(url: string, signal?: AbortSignal): Promise<Response> {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed with status ${response.status}`)
  }

  return response
}

export async function fetchProducts(
  limit: number,
  skip: number,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  const response = await getOk(`${API_BASE_URL}/products?limit=${limit}&skip=${skip}`, signal)
  const data: ProductsResponse = await response.json()
  return data
}

export async function fetchProduct(id: number, signal?: AbortSignal): Promise<Product> {
  const response = await getOk(`${API_BASE_URL}/products/${id}`, signal)
  const data: Product = await response.json()
  return data
}
