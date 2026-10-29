import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { useAuth } from '../context/AuthContext'
import type { SignUpFormErrors, SignUpFormValues } from '../types/user'
import { getRedirectPath } from '../utils/navigation'
import { validateSignUp } from '../utils/validation'

export function SignUpPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState<SignUpFormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<SignUpFormErrors>({})

  const handleChange =
    (field: keyof SignUpFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validateSignUp(values)
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
          New here?
        </span>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Demo sign-up: nothing is stored or sent anywhere. You are simply signed in for this
          visit.
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
            id="email"
            label="Email"
            type="email"
            value={values.email}
            error={errors.email}
            autoComplete="email"
            onChange={handleChange('email')}
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            value={values.password}
            error={errors.password}
            autoComplete="new-password"
            onChange={handleChange('password')}
          />
          <FormField
            id="confirmPassword"
            label="Confirm password"
            type="password"
            value={values.confirmPassword}
            error={errors.confirmPassword}
            autoComplete="new-password"
            onChange={handleChange('confirmPassword')}
          />
          <Button type="submit" fullWidth>
            Create account
          </Button>
        </form>
      </div>
      <p className="mt-5 text-center text-sm font-medium">
        Already have an account?{' '}
        <Link
          to="/login"
          state={location.state}
          className="font-bold underline decoration-2 underline-offset-4 hover:bg-lime-300"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}
