import type { CheckoutFormErrors, CheckoutFormValues } from '../types/checkout'
import type { ReviewFormErrors, ReviewFormValues } from '../types/product'
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

export function validateCheckout(values: CheckoutFormValues): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {}

  if (values.fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters'
  }

  if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (values.address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters'
  }

  if (values.city.trim() === '') {
    errors.city = 'City is required'
  }

  return errors
}

export function validateReview(values: ReviewFormValues): ReviewFormErrors {
  const errors: ReviewFormErrors = {}

  if (!Number.isInteger(values.rating) || values.rating < 1 || values.rating > 5) {
    errors.rating = 'Please select a rating'
  }

  if (values.comment.trim().length < 10) {
    errors.comment = 'Comment must be at least 10 characters'
  }

  return errors
}
