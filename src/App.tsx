import { ScrollToTop } from './components/layout/ScrollToTop'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
