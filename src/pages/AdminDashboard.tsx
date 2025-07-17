import { useState, useEffect } from 'react';
import { DollarSign, Package, Store, ShoppingBag, TrendingUp, Users, Eye, Edit2, Check, X } from 'lucide-react';
import { getAdminProducts } from '../data/products';
import { getAdminOrders } from '../data/orders';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getStoreName, setStoreName } from '../data/products';

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
  const [storeName, setStoreNameValue] = useState('');
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
  const [isEditing, setIsEditing] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');

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

        const name = await getStoreName();
        setStoreNameValue(name || '');
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        const name = await getStoreName();
        setStoreNameValue(name || '');
      } catch (error) {
        console.error('Error fetching store name:', error);
        toast.error('Failed to fetch store name');
      }
    };

    fetchStoreName();
  }, []);

  const handleStoreNameUpdate = async () => {
    if (!newStoreName.trim()) {
      toast.error('Store name cannot be empty');
      return;
    }

    try {
      await setStoreName(newStoreName);
      setStoreNameValue(newStoreName);
      setIsEditing(false);
      toast.success('Store name updated successfully');
    } catch (error) {
      console.error('Error updating store name:', error);
      toast.error('Failed to update store name');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back, Admin</p>
      </div>

      {/* Store Name Section */}
      <div className="bg-gray-900/10 p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-white to-gray-200 rounded-xl">
              <Store className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Your Store</h2>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                className="px-4 bg-gray-800 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-white/50 focus:border-white/50 placeholder-gray-400"
              />
              <button
                onClick={handleStoreNameUpdate}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-gray-300">{storeName || 'No store name set'}</p>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setNewStoreName(storeName);
                }}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900/10 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-green-400 to-green-600 rounded-xl">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-1">${stats.totalSales.toFixed(2)}</h3>
          <p className="text-gray-400">Total Sales</p>
        </div>

        <div className="bg-gray-900/10 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl">
              <Package className="h-6 w-6 text-blue-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-1">{stats.totalProducts}</h3>
          <p className="text-gray-400">Total Products</p>
        </div>

        <div className="bg-gray-900/10 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-purple-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-1">{stats.totalOrders}</h3>
          <p className="text-gray-400">Total Orders</p>
        </div>

        <div className="bg-gray-900/10 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl">
              <Users className="h-6 w-6 text-amber-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-amber-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-1">${stats.averageOrderValue.toFixed(2)}</h3>
          <p className="text-gray-400">Avg Order Value</p>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-gray-900/10 p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Top Products</h3>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm rounded-full">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-gray-400 text-sm">${product.sales.toFixed(2)}</p>
                  </div>
                </div>
                <Eye className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-gray-900/10 p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Order Status</h3>
          <div className="space-y-4">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'completed' ? 'bg-green-400' :
                    status === 'pending' ? 'bg-yellow-400' :
                    status === 'cancelled' ? 'bg-red-400' :
                    'bg-blue-400'
                  }`}></div>
                  <p className="text-white font-medium capitalize">{status}</p>
                </div>
                <span className="text-gray-400 font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}