import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './ui/Button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="mx-auto my-16 max-w-md rounded-2xl border-2 border-neutral-950 bg-red-200 p-8 text-center shadow-[6px_6px_0_0_#0a0a0a]"
        >
          <p data-display className="text-3xl font-extrabold tracking-tight">
            Something went wrong.
          </p>
          <p className="mt-2 text-neutral-800">
            An unexpected error occurred. Reloading the page usually fixes it.
          </p>
          <Button variant="dark" className="mt-6" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
