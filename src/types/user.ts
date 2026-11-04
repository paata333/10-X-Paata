export interface AuthUser {
  username: string
  isLoggedIn: boolean
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
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

export type ProfileFormValues = Required<
  Pick<AuthUser, 'firstName' | 'lastName' | 'email' | 'phone'>
>

export type ProfileFormErrors = Partial<ProfileFormValues>
