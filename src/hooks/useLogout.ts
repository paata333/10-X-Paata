import { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Logs out and goes to the catalog. React Router applies the location change inside a
// transition; doing the same for logout keeps both updates in one render, so a protected
// page never sees a guest and does not redirect to /login first.
export function useLogout(): () => void {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return () => {
    startTransition(() => {
      logout()
      navigate('/')
    })
  }
}
