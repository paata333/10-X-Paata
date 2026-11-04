import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { Page } from '../components/ui/Page'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useLogout } from '../hooks/useLogout'
import type { ProfileFormErrors, ProfileFormValues } from '../types/user'
import { clearLocalData, loadOrders } from '../utils/storage'
import { validateProfile } from '../utils/validation'

export function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { clearCart } = useCart()
  const { showToast } = useToast()
  const logout = useLogout()

  const [values, setValues] = useState<ProfileFormValues>({
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
  })
  const [errors, setErrors] = useState<ProfileFormErrors>({})
  const [orderCount, setOrderCount] = useState(() => loadOrders().length)

  const handleChange =
    (field: keyof ProfileFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validateProfile(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    updateProfile({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    })
    showToast('Profile saved ✓')
  }

  const handleClearData = () => {
    if (
      window.confirm('Clear your cart, orders and reviews? Your session and theme are kept.')
    ) {
      clearLocalData()
      clearCart()
      setOrderCount(0)
      showToast('Local data cleared')
    }
  }

  return (
    <Page title="Profile">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="h-fit rounded-2xl border-2 border-neutral-950 bg-white p-6 shadow-[6px_6px_0_0_#0a0a0a] sm:p-8"
        >
          <h2 className="text-2xl font-extrabold tracking-tight">Your details</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Saved in this visit only: nothing is sent anywhere.
          </p>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="firstName"
                label="First name"
                value={values.firstName}
                error={errors.firstName}
                autoComplete="given-name"
                onChange={handleChange('firstName')}
              />
              <FormField
                id="lastName"
                label="Last name"
                value={values.lastName}
                error={errors.lastName}
                autoComplete="family-name"
                onChange={handleChange('lastName')}
              />
            </div>
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
              id="phone"
              label="Phone (optional)"
              value={values.phone}
              error={errors.phone}
              autoComplete="tel"
              onChange={handleChange('phone')}
            />
            <Button type="submit">Save changes</Button>
          </div>
        </form>

        <div className="space-y-6">
          <section
            aria-labelledby="account-heading"
            className="rounded-2xl border-2 border-neutral-950 bg-lime-300 p-5 shadow-[4px_4px_0_0_#0a0a0a]"
          >
            <h2 id="account-heading" className="text-xl font-extrabold tracking-tight">
              Account
            </h2>
            <dl className="mt-3 space-y-2 text-sm font-medium">
              <div className="flex justify-between gap-4">
                <dt>Username</dt>
                <dd className="font-bold">{user.username}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Orders</dt>
                <dd className="font-bold">{orderCount}</dd>
              </div>
            </dl>
          </section>

          <section
            aria-labelledby="data-heading"
            className="rounded-2xl border-2 border-neutral-950 bg-white p-5 shadow-[4px_4px_0_0_#0a0a0a]"
          >
            <h2 id="data-heading" className="text-xl font-extrabold tracking-tight">
              Local data
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Removes your cart, orders and reviews from this browser.
            </p>
            <Button variant="outline" fullWidth onClick={handleClearData} className="mt-4">
              Clear local data
            </Button>
          </section>

          <Button variant="dark" fullWidth onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </Page>
  )
}
