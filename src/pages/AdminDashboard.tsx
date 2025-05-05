import { useState, useEffect } from 'react';
import { DollarSign, Users, Package, Store, BarChart2, TrendingUp, ShoppingBag, Clock, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { getAdminProducts } from '../data/products';
import { getAdminOrders, Order, subscribeToOrders } from '../data/orders';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getStoreName, setStoreName, subscribeToStoreName } from '../data/products';

interface DashboardStats {
  totalSales: number;
  activeUsers: number;
  totalOrders: number;
  recentSales: { date: string; amount: number }[];
  topProducts: { name: string; sales: number; growth: number }[];
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    completed: number;
    cancelled: number;
    refunded: number;
  };
  salesMetrics: {
    dailySales: number;
    weeklySales: number;
    monthlySales: number;
    yearToDate: number;
    averageOrderValue: number;
    growthRate: number;
  };
  customerMetrics: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    customerRetentionRate: number;
  };
  productMetrics: {
    totalProducts: number;
    outOfStock: number;
    lowStock: number;
    topCategories: { category: string; count: number }[];
  };
  timeMetrics: {
    peakHours: { hour: number; orders: number }[];
    peakDays: { day: string; orders: number }[];
  };
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth() as { currentUser: { uid: string } | null };
  const [storeName, setStoreNameState] = useState('');
  const [isEditingStoreName, setIsEditingStoreName] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    activeUsers: 0,
    totalOrders: 0,
    recentSales: [],
    topProducts: [],
    ordersByStatus: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      completed: 0,
      cancelled: 0,
      refunded: 0
    },
    salesMetrics: {
      dailySales: 0,
      weeklySales: 0,
      monthlySales: 0,
      yearToDate: 0,
      averageOrderValue: 0,
      growthRate: 0
    },
    customerMetrics: {
      totalCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0,
      customerRetentionRate: 0
    },
    productMetrics: {
      totalProducts: 0,
      outOfStock: 0,
      lowStock: 0,
      topCategories: []
    },
    timeMetrics: {
      peakHours: [],
      peakDays: []
    }
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
      return;
    }

    const loadStoreNameAndData = async () => {
      setIsLoading(true);
      try {
        const name = await getStoreName();
        setStoreNameState(name || '');
        await loadData();
      } catch (error) {
        console.error('Error loading store data:', error);
        toast.error('Error loading store data');
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreNameAndData();
    
    const unsubscribe = subscribeToStoreName(currentUser?.uid || '', (name) => {
      setStoreNameState(name || '');
    });

    const unsubscribeOrders = subscribeToOrders((orders) => {
      const adminOrders = orders.filter(order => 
        order.items.some(item => item.admin_id === currentUser.uid)
      );
      setRecentActivities(
        [...adminOrders]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10)
      );
      updateStats(adminOrders);
    });
    
    window.addEventListener('ordersUpdated', loadData);
    
    return () => {
      unsubscribe();
      unsubscribeOrders();
      window.removeEventListener('ordersUpdated', loadData);
    };
  }, [currentUser, navigate]);

  const updateStats = (orders: Order[]) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const totalSales = orders.reduce((sum, order) => {
      const adminItems = order.items.filter(item => item.admin_id === currentUser?.uid);
      return sum + adminItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
    }, 0);

    const dailySales = orders
      .filter(order => order.date.startsWith(today))
      .reduce((sum, order) => sum + order.total, 0);

    const weeklySales = orders
      .filter(order => order.date >= lastWeek)
      .reduce((sum, order) => sum + order.total, 0);

    const monthlySales = orders
      .filter(order => order.date >= lastMonth)
      .reduce((sum, order) => sum + order.total, 0);

    const customers = new Set(orders.map(order => order.customer_details.email));
    const newCustomers = new Set(
      orders
        .filter(order => order.date >= lastMonth)
        .map(order => order.customer_details.email)
    );

    const returningCustomers = new Set(
      orders
        .filter(order => {
          const customerOrders = orders.filter(o => o.customer_details.email === order.customer_details.email);
          return customerOrders.length > 1;
        })
        .map(order => order.customer_details.email)
    );

    const productSales = new Map<string, { sales: number; growth: number }>();
    orders.forEach(order => {
      order.items
        .filter(item => item.admin_id === currentUser?.uid)
        .forEach(item => {
          const current = productSales.get(item.name) || { sales: 0, growth: 0 };
          const newSales = current.sales + (item.price * item.quantity);
          const growth = ((newSales - current.sales) / current.sales) * 100;
          productSales.set(item.name, { 
            sales: newSales,
            growth: isNaN(growth) ? 0 : growth
          });
        });
    });

    const topProducts = Array.from(productSales.entries())
      .map(([name, { sales, growth }]) => ({ name, sales, growth }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

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
        refunded: 0
      }
    );

    const ordersByHour = new Map<number, number>();
    const ordersByDay = new Map<string, number>();

    orders.forEach(order => {
      const date = new Date(order.date);
      const hour = date.getHours();
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });

      ordersByHour.set(hour, (ordersByHour.get(hour) || 0) + 1);
      ordersByDay.set(day, (ordersByDay.get(day) || 0) + 1);
    });

    const peakHours = Array.from(ordersByHour.entries())
      .map(([hour, orders]) => ({ hour, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    const peakDays = Array.from(ordersByDay.entries())
      .map(([day, orders]) => ({ day, orders }))
      .sort((a, b) => b.orders - a.orders);

    setStats({
      totalSales,
      activeUsers: customers.size,
      totalOrders: orders.length,
      recentSales: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const amount = orders
          .filter(order => order.date.startsWith(dateStr))
          .reduce((sum, order) => sum + order.total, 0);
        return { date: dateStr, amount };
      }).reverse(),
      topProducts,
      ordersByStatus,
      salesMetrics: {
        dailySales,
        weeklySales,
        monthlySales,
        yearToDate: totalSales,
        averageOrderValue: orders.length ? totalSales / orders.length : 0,
        growthRate: ((weeklySales - monthlySales / 4) / (monthlySales / 4)) * 100
      },
      customerMetrics: {
        totalCustomers: customers.size,
        newCustomers: newCustomers.size,
        returningCustomers: returningCustomers.size,
        customerRetentionRate: (returningCustomers.size / customers.size) * 100
      },
      productMetrics: {
        totalProducts: productSales.size,
        outOfStock: 0,
        lowStock: 0,
        topCategories: []
      },
      timeMetrics: {
        peakHours,
        peakDays
      }
    });
  };

  const loadData = async () => {
    if (!currentUser) return;

    try {
      const [, orders] = await Promise.all([
        getAdminProducts(),
        getAdminOrders(currentUser.uid)
      ]);
      
      updateStats(orders);
    } catch (error) {
      toast.error('Error loading data');
    }
  };

  const handleStoreNameUpdate = async () => {
    if (storeName.trim()) {
      try {
        await setStoreName(storeName);
        toast.success('Store name updated successfully');
        setIsEditingStoreName(false);
      } catch (error) {
        toast.error('Failed to update store name');
      }
    } else {
      toast.error('Store name cannot be empty');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          <p className="text-gray-500">Please wait while we fetch your store data</p>
        </div>
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
          {!isEditingStoreName && storeName && (
            <button
              onClick={() => setIsEditingStoreName(true)}
              className="text-gray-700 hover:text-black"
            >
              Edit
            </button>
          )}
        </div>
        {isEditingStoreName ? (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreNameState(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              placeholder="Enter your store name"
            />
            <button
              onClick={handleStoreNameUpdate}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
            >
              Save
            </button>
            {storeName && (
              <button
                onClick={() => {
                  getStoreName().then(name => setStoreNameState(name || ''));
                  setIsEditingStoreName(false);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <p className="mt-2 text-lg text-gray-900">{storeName || 'Please set your store name'}</p>
        )}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span className={`text-sm font-medium ${stats.salesMetrics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.salesMetrics.growthRate >= 0 ? (
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  {stats.salesMetrics.growthRate.toFixed(1)}%
                </div>
              ) : (
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  {Math.abs(stats.salesMetrics.growthRate).toFixed(1)}%
                </div>
              )}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Total Sales</h3>
          <p className="text-2xl font-bold text-gray-900">${stats.totalSales.toFixed(2)}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="font-medium">Daily: ${stats.salesMetrics.dailySales.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1" />
                {((stats.customerMetrics.newCustomers / stats.customerMetrics.totalCustomers) * 100).toFixed(1)}%
              </div>
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Customers</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.customerMetrics.totalCustomers}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="font-medium">{stats.customerMetrics.newCustomers} new this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm">Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="font-medium">Avg. ${stats.salesMetrics.averageOrderValue.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-100 p-2 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm">Products</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.productMetrics.totalProducts}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="font-medium">{stats.topProducts.length} top sellers</span>
          </div>
        </div>
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Last 7 days</span>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="h-64">
            <div className="flex h-full items-end">
              {stats.recentSales.map((sale) => (
                <div
                  key={sale.date}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-gradient-to-t from-black to-gray-800 rounded-t"
                    style={{
                      height: `${(sale.amount / Math.max(...stats.recentSales.map(s => s.amount))) * 100}%`,
                      minHeight: '1px'
                    }}
                  />
                  <span className="text-xs text-gray-600 mt-2 transform -rotate-45">
                    {new Date(sale.date).toLocaleDateString(undefined, { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
            <BarChart2 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="text-gray-900">{product.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">${product.sales.toFixed(2)}</span>
                  <span className={`text-sm ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.growth >= 0 ? '+' : ''}{product.growth.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status and Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Order Status</h3>
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="capitalize text-gray-600">{status}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{
                        width: `${(count / stats.totalOrders) * 100}%`
                      }}
                    />
                  </div>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Peak Order Times</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">Peak Hours</h4>
              <div className="grid grid-cols-5 gap-2">
                {stats.timeMetrics.peakHours.map(({ hour, orders }) => (
                  <div key={hour} className="text-center">
                    <div className="h-20 bg-gray-100 rounded-lg relative">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-black rounded-lg"
                        style={{
                          height: `${(orders / Math.max(...stats.timeMetrics.peakHours.map(h => h.orders))) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 mt-1 block">
                      {hour}:00
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">Peak Days</h4>
              <div className="space-y-2">
                {stats.timeMetrics.peakDays.map(({ day, orders }) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-gray-600">{day}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black rounded-full"
                          style={{
                            width: `${(orders / Math.max(...stats.timeMetrics.peakDays.map(d => d.orders))) * 100}%`
                          }}
                        />
                      </div>
                      <span className="font-medium text-gray-900">{orders} orders</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Customer Insights</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm text-gray-600 mb-1">New Customers</h4>
                <p className="text-2xl font-bold text-gray-900">{stats.customerMetrics.newCustomers}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm text-gray-600 mb-1">Returning</h4>
                <p className="text-2xl font-bold text-gray-900">{stats.customerMetrics.returningCustomers}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">Retention Rate</h4>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-gray-600">
                      {stats.customerMetrics.customerRetentionRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex h-2 mb-4 overflow-hidden bg-gray-100 rounded">
                  <div
                    style={{ width: `${stats.customerMetrics.customerRetentionRate}%` }}
                    className="bg-black"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-black" />
                <div>
                  <p className="text-sm text-gray-900">
                    New order from {activity.customer_details.firstName} {activity.customer_details.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}