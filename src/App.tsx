import { ScrollToTop } from './components/layout/ScrollToTop'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <ScrollToTop />
          <AppRoutes />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
