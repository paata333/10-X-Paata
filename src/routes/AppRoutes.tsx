import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProtectedRoute } from './ProtectedRoute'

// Every page is a separate chunk that is downloaded the first time it is opened.
// The pages use named exports, so each import is mapped to the `default` that lazy() expects.
const CatalogPage = lazy(() =>
  import('../pages/CatalogPage').then((module) => ({ default: module.CatalogPage })),
)
const ProductPage = lazy(() =>
  import('../pages/ProductPage').then((module) => ({ default: module.ProductPage })),
)
const CartPage = lazy(() =>
  import('../pages/CartPage').then((module) => ({ default: module.CartPage })),
)
const CheckoutPage = lazy(() =>
  import('../pages/CheckoutPage').then((module) => ({ default: module.CheckoutPage })),
)
const LoginPage = lazy(() =>
  import('../pages/LoginPage').then((module) => ({ default: module.LoginPage })),
)
const SignUpPage = lazy(() =>
  import('../pages/SignUpPage').then((module) => ({ default: module.SignUpPage })),
)
const OrdersPage = lazy(() =>
  import('../pages/OrdersPage').then((module) => ({ default: module.OrdersPage })),
)
const OrderDetailsPage = lazy(() =>
  import('../pages/OrderDetailsPage').then((module) => ({ default: module.OrderDetailsPage })),
)
const ProfilePage = lazy(() =>
  import('../pages/ProfilePage').then((module) => ({ default: module.ProfilePage })),
)

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<SignUpPage />} />
        <Route path="products/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
