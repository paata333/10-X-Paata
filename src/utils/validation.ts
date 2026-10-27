import type { LoginFormErrors, LoginFormValues } from '../types/user'

export function validateLogin(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {}

  if (values.username.trim() === '') {
    errors.username = 'Username is required'
  }

  if (values.password === '') {
    errors.password = 'Password is required'
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  return errors
}
