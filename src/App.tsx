import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminOrders } from './pages/AdminOrders';
import { AdminProducts } from './pages/AdminProducts';
import { AdminLayout } from './components/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Store } from './pages/Store';
import { Products } from './pages/Products';
import { ProductDetailsPage } from './pages/ProductDetails';
import { StorePage } from './pages/StorePage';
import { CollectionPage } from './pages/CollectionPage';
import { AuthProvider } from './context/AuthContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PayPalTest } from './components/PayPalTest';
import './index.css';

export default function App() {
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'BAABwcP0Y_Fjwz59xvaFHbLXnZr93-r9l7W4A0DDW_WG8WW1yNoTUWVoE081NWwQRxHtsrUCZnqIER0Rxs';

  return (
    <AuthProvider>
      <PayPalScriptProvider 
        options={{ 
          clientId: paypalClientId,
          currency: 'USD',
          intent: 'capture'
        }}
      >
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="" element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="orders" element={<AdminOrders />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/store/:storeName" element={<StorePage />} />
            <Route path="/collection/:category" element={<CollectionPage />} />
            <Route path="/paypal-test" element={<PayPalTest />} />
            <Route path="/" element={<Store />} />
          </Routes>
        </Router>
      </PayPalScriptProvider>
    </AuthProvider>
  );
}