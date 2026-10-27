import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FormField } from '../components/ui/FormField'
import { useAuth } from '../context/AuthContext'
import type { LoginFormErrors, LoginFormValues } from '../types/user'
import { validateLogin } from '../utils/validation'

function getRedirectPath(state: unknown): string {
  if (
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    typeof state.from === 'string'
  ) {
    return state.from
  }
  return '/'
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState<LoginFormValues>({ username: '', password: '' })
  const [errors, setErrors] = useState<LoginFormErrors>({})

  const handleChange =
    (field: keyof LoginFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validateLogin(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    login(values.username.trim())
    navigate(getRedirectPath(location.state), { replace: true })
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Log in</h1>
        <p className="mt-1 text-sm text-stone-500">
          Demo login: use any username and a password with at least 6 characters.
        </p>
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <FormField
            id="username"
            label="Username"
            value={values.username}
            error={errors.username}
            autoComplete="username"
            onChange={handleChange('username')}
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            value={values.password}
            error={errors.password}
            autoComplete="current-password"
            onChange={handleChange('password')}
          />
          <button
            type="submit"
            className="w-full rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
          >
            Log In
          </button>
        </form>
      </div>
      <Link to="/" className="mt-4 inline-block text-sm text-stone-600 hover:text-stone-900">
        ← Back to catalog
      </Link>
    </div>
  )
}
