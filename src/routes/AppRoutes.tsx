import { Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { CartPage } from '../pages/CartPage'
import { CatalogPage } from '../pages/CatalogPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { OrderDetailsPage } from '../pages/OrderDetailsPage'
import { OrdersPage } from '../pages/OrdersPage'
import { ProductPage } from '../pages/ProductPage'
import { ProfilePage } from '../pages/ProfilePage'
import { SignUpPage } from '../pages/SignUpPage'
import { ProtectedRoute } from './ProtectedRoute'

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
