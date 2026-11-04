// The single gateway to localStorage. JSON has no types, so every read goes through `revive`:
// it turns unknown data into a T, or returns null when the data is unusable.
export class StorageService<T> {
  private readonly key: string
  private readonly revive: (raw: unknown) => T | null

  constructor(key: string, revive: (raw: unknown) => T | null) {
    this.key = key
    this.revive = revive
  }

  get(): T | null {
    try {
      const raw = localStorage.getItem(this.key)
      if (raw === null) {
        return null
      }
      return this.revive(JSON.parse(raw))
    } catch {
      return null
    }
  }

  set(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value))
    } catch {
      // Storage can be unavailable (private mode, quota): the data then lives in memory only.
    }
  }

  remove(): void {
    try {
      localStorage.removeItem(this.key)
    } catch {
      // Nothing to remove if storage is unavailable.
    }
  }
}
