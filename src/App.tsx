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
import { WhyUs } from './pages/WhyUs';
import { CollectionPage } from './pages/CollectionPage';
import { AuthProvider } from './context/AuthContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js'; // Import PayPalScriptProvider

export default function App() {
  return (
    <AuthProvider>
      <PayPalScriptProvider options={{ clientId: "BAABwcP0Y_Fjwz59xvaFHbLXnZr93-r9l7W4A0DDW_WG8WW1yNoTUWVoE081NWwQRxHtsrUCZnqIER0Rxs" }}>
        <Router>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminProducts />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminOrders />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/store/:storeName" element={<StorePage />} />
            <Route path="/collection/:category" element={<CollectionPage />} />
            <Route path="/why-us" element={<WhyUs />} />
            <Route path="/" element={<Store />} />
          </Routes>
        </Router>
      </PayPalScriptProvider>
    </AuthProvider>
  );
}