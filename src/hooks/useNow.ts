import { useEffect, useState } from 'react'

// Returns the current time and refreshes it every `intervalMs`, so values derived from the
// time (like an order status) change without a page reload.
export function useNow(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), intervalMs)
    // Without this cleanup the timer would keep running after the page is closed.
    return () => window.clearInterval(timer)
  }, [intervalMs])

  return now
}
