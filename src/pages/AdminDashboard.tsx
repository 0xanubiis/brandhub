import { useState, useEffect } from 'react';
import { DollarSign, Package, Store, ShoppingBag } from 'lucide-react';
import { getAdminProducts } from '../data/products';
import { getAdminOrders } from '../data/orders';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getStoreName } from '../data/products';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
  topProducts: { name: string; sales: number }[];
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    completed: number;
    cancelled: number;
    refunded: number;
  };
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    topProducts: [],
    ordersByStatus: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      completed: 0,
      cancelled: 0,
      refunded: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
      return;
    }

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [products, orders] = await Promise.all([
          getAdminProducts(),
          getAdminOrders(currentUser?.id || ''),
        ]);

        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const totalProducts = products.length;
        const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;

        const ordersByStatus = orders.reduce(
          (acc, order) => {
            acc[order.status.toLowerCase() as keyof typeof acc] += 1;
            return acc;
          },
          {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            completed: 0,
            cancelled: 0,
            refunded: 0,
          }
        );

        const productSales = new Map<string, number>();
        orders.forEach((order) => {
          order.items.forEach((item) => {
            productSales.set(
              item.name,
              (productSales.get(item.name) || 0) + item.price * item.quantity
            );
          });
        });

        const topProducts = Array.from(productSales.entries())
          .map(([name, sales]) => ({ name, sales }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);

        setStats({
          totalSales,
          totalOrders,
          totalProducts,
          averageOrderValue,
          topProducts,
          ordersByStatus,
        });

        const store = await getStoreName();
        setStoreName(store || '');
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [currentUser, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back, Admin</p>
        </div>
      </div>

      {/* Store Name Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-medium text-gray-900">Your Store</h2>
          </div>
          <p className="text-gray-600">{storeName || 'No store name set'}</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">
              ${stats.totalSales.toFixed(2)}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Total Sales</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600">
              {stats.totalProducts}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Total Products</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-100 p-2 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-amber-600">
              {stats.totalOrders}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Total Orders</h3>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
        <ul className="space-y-2">
          {stats.topProducts.map((product, index) => (
            <li key={index} className="flex justify-between">
              <span>{product.name}</span>
              <span>${product.sales.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}