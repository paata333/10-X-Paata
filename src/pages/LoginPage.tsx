import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { useAuth } from '../context/AuthContext'
import type { LoginFormErrors, LoginFormValues } from '../types/user'
import { getRedirectPath } from '../utils/navigation'
import { validateLogin } from '../utils/validation'

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
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border-2 border-neutral-950 bg-white p-6 shadow-[6px_6px_0_0_#0a0a0a] sm:p-8">
        <span className="inline-block -rotate-2 rounded-md border-2 border-neutral-950 bg-lime-300 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wider">
          Welcome back
        </span>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Log in</h1>
        <p className="mt-2 text-sm text-neutral-600">
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
          <Button type="submit" fullWidth>
            Log In
          </Button>
        </form>
      </div>
      <p className="mt-5 text-center text-sm font-medium">
        New here?{' '}
        <Link
          to="/register"
          state={location.state}
          className="font-bold underline decoration-2 underline-offset-4 hover:bg-lime-300"
        >
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-sm">
        <Link to="/" className="font-medium text-neutral-600 hover:text-neutral-950">
          ← Back to catalog
        </Link>
      </p>
    </div>
  )
}
