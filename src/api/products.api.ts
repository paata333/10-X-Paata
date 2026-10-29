import type { ProductsResponse } from '../types/product'

const API_BASE_URL = 'https://dummyjson.com'

export async function fetchProducts(
  limit: number,
  skip: number,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  const response = await fetch(`${API_BASE_URL}/products?limit=${limit}&skip=${skip}`, { signal })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const data: ProductsResponse = await response.json()
  return data
}
