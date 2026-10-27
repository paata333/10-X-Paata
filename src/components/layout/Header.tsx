import { startTransition, type ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

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
        `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-teal-50 text-teal-800'
            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    // React Router updates the location inside a transition. Doing the same for
    // logout keeps both updates in one render, so ProtectedRoute never sees a
    // guest on /checkout and does not redirect to /login.
    startTransition(() => {
      logout()
      navigate('/')
    })
  }

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-3">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-teal-800">
          10X Shop
        </Link>
        <nav aria-label="Main" className="flex basis-full items-center gap-1 sm:basis-auto">
          <NavItem to="/" end>
            Catalog
          </NavItem>
          <NavItem to="/cart">Cart</NavItem>
          {user.isLoggedIn ? (
            <>
              <span className="hidden px-2 text-sm text-stone-500 sm:inline">
                {user.username}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
              >
                Log out
              </button>
            </>
          ) : (
            <NavItem to="/login">Log in</NavItem>
          )}
        </nav>
      </div>
    </header>
  )
}
