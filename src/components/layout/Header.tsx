import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Button } from '../ui/Button'
import { buttonClasses } from '../ui/buttonStyles'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useLogout } from '../../hooks/useLogout'

interface NavItemProps {
  to: string
  end?: boolean
  children: ReactNode
}

function NavItem({ to, end, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `inline-flex min-h-11 items-center rounded-lg border-2 px-3 py-1.5 text-sm font-bold transition-colors motion-reduce:transition-none lg:min-h-9 ${
          isActive
            ? 'border-lime-300 bg-lime-300 text-neutral-950'
            : 'border-transparent text-white hover:border-white/40'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export function Header() {
  const { user } = useAuth()
  const { itemCount } = useCart()
  const handleLogout = useLogout()
  const displayName = user.firstName || user.username

  return (
    <header className="border-b-2 border-neutral-950 bg-neutral-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-h-11 items-center gap-2">
          <span
            data-display
            className="-rotate-3 rounded-md bg-lime-300 px-2 py-0.5 text-xl font-extrabold text-neutral-950"
          >
            10X
          </span>
          <span data-display className="text-xl font-extrabold tracking-tight">
            Shop
          </span>
        </Link>
        <nav aria-label="Main" className="flex basis-full flex-wrap items-center gap-2 sm:basis-auto">
          <NavItem to="/" end>
            Catalog
          </NavItem>
          <NavItem to="/cart">
            Cart{' '}
            {itemCount > 0 && (
              <span className="rounded-full bg-orange-400 px-1.5 py-0.5 text-xs font-extrabold text-neutral-950">
                {itemCount}{' '}
                <span className="sr-only">items in cart</span>
              </span>
            )}
          </NavItem>
          {user.isLoggedIn ? (
            <>
              <NavItem to="/orders">Orders</NavItem>
              <NavItem to="/profile">Profile</NavItem>
              <span className="ml-1 hidden items-center gap-2 text-sm font-semibold text-neutral-300 sm:inline-flex">
                <span aria-hidden="true" className="size-2 rounded-full bg-lime-300" />
                {displayName}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className={buttonClasses('outline', 'sm')}>
                Log in
              </Link>
              <Link to="/register" className={buttonClasses('primary', 'sm')}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
