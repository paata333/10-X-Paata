import type { Parser } from '../types/api'
import { ApiError } from './ApiError'

// One place for the shared request logic: network failures, HTTP errors and unexpected data
// all become an ApiError, so the pages only have to deal with one kind of failure.
export class ApiClient {
  // The public products API needs no login or authorization headers.
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(path: string, parse: Parser<T>, init: RequestInit = {}): Promise<T> {
    let response: Response
    try {
      response = await fetch(`${this.baseUrl}${path}`, init)
    } catch (error) {
      // A request cancelled on purpose is not a failure: pass the AbortError on untouched.
      if (init.signal?.aborted) {
        throw error
      }
      throw new ApiError(0, 'Could not reach the server')
    }

    if (!response.ok) {
      throw new ApiError(response.status, `Request failed with status ${response.status}`)
    }

    let raw: unknown
    try {
      raw = await response.json()
    } catch (error) {
      if (init.signal?.aborted) {
        throw error
      }
      throw new ApiError(response.status, 'The server returned an unreadable response')
    }

    const data = parse(raw)
    if (data === null) {
      throw new ApiError(502, 'The server returned unexpected data')
    }
    return data
  }

  get<T>(path: string, parse: Parser<T>, signal?: AbortSignal): Promise<T> {
    return this.request(path, parse, { signal })
  }
}
