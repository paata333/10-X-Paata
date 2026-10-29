import { Link } from 'react-router-dom'
import { buttonClasses } from '../components/ui/buttonStyles'

export function NotFoundPage() {
  return (
    <section className="py-12 text-center">
      <p
        data-display
        aria-hidden="true"
        className="text-8xl font-extrabold leading-none tracking-tighter sm:text-9xl"
      >
        <span className="rounded-2xl border-2 border-neutral-950 bg-lime-300 px-4 shadow-[6px_6px_0_0_#0a0a0a]">
          404
        </span>
      </p>
      <h1 className="mt-10 text-3xl font-extrabold tracking-tight">Page not found</h1>
      <p className="mt-3 text-neutral-600">The page you are looking for does not exist.</p>
      <Link to="/" className={`${buttonClasses('dark')} mt-8`}>
        Go to catalog
      </Link>
    </section>
  )
}
