export interface AuthUser {
  username: string
  isLoggedIn: boolean
}

export interface LoginFormValues {
  username: string
  password: string
}

export interface LoginFormErrors {
  username?: string
  password?: string
}

export interface SignUpFormValues {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface SignUpFormErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}
