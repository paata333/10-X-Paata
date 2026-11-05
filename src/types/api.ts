export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }

// Turns unknown JSON into a T, or returns null when the data does not look right.
export type Parser<T> = (raw: unknown) => T | null
