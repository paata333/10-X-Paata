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
