import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AuthUser, ProfileFormValues } from '../types/user'

interface AuthContextValue {
  user: AuthUser
  login: (username: string) => void
  logout: () => void
  updateProfile: (values: ProfileFormValues) => void
}

const guestUser: AuthUser = { username: '', isLoggedIn: false }

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser>(guestUser)

  const login = (username: string) => {
    setUser({ username, isLoggedIn: true })
  }

  const logout = () => {
    setUser(guestUser)
  }

  const updateProfile = (values: ProfileFormValues) => {
    setUser((prev) => ({ ...prev, ...values }))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
