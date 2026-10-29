import type {
  LoginFormErrors,
  LoginFormValues,
  SignUpFormErrors,
  SignUpFormValues,
} from '../types/user'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

function getPasswordError(password: string): string | undefined {
  if (password === '') {
    return 'Password is required'
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters'
  }
  return undefined
}

export function validateLogin(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {}

  if (values.username.trim() === '') {
    errors.username = 'Username is required'
  }

  const passwordError = getPasswordError(values.password)
  if (passwordError) {
    errors.password = passwordError
  }

  return errors
}

export function validateSignUp(values: SignUpFormValues): SignUpFormErrors {
  const errors: SignUpFormErrors = {}
  const username = values.username.trim()

  if (username === '') {
    errors.username = 'Username is required'
  } else if (username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
  }

  if (values.email.trim() === '') {
    errors.email = 'Email is required'
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address'
  }

  const passwordError = getPasswordError(values.password)
  if (passwordError) {
    errors.password = passwordError
  }

  if (values.confirmPassword === '') {
    errors.confirmPassword = 'Please confirm your password'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}
