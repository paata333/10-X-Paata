import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ErrorBoundary } from '../ErrorBoundary'
import { Spinner } from '../ui/Spinner'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f0e6] bg-[radial-gradient(#0a0a0a1f_1px,transparent_1px)] bg-size-[22px_22px] text-neutral-950">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
        {/* key resets the boundary, so leaving a broken page clears the error */}
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
