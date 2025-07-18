import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ORDER_STATUSES = [
  'Pending',
  'Delivered',
  'Cancelled',
  'Refunded',
] as const;

type OrderStatus = typeof ORDER_STATUSES[number];

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    paymentMethod: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    discount?: number | null;
    size?: string;
    adminId: string;
  }[];
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          throw error;
        }

        const filteredOrders = data
          ?.filter((order: Order) =>
            order.items.some((item) => item.adminId === currentUser.id)
          )
          .sort((a, b) => {
            if (a.status === b.status) {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            return a.status === 'Pending' ? -1 : 1;
          });

        setOrders(filteredOrders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders');
      }
    };

    fetchOrders();
  }, [currentUser]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success(`Order status updated to ${newStatus.toLowerCase()}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-800 bg-green-100';
      case 'Cancelled':
        return 'text-red-800 bg-red-100';
      case 'Processing':
        return 'text-blue-800 bg-blue-100';
      case 'Shipped':
        return 'text-indigo-800 bg-indigo-100';
      case 'Delivered':
        return 'text-purple-800 bg-purple-100';
      case 'Refunded':
        return 'text-orange-800 bg-orange-100';
      default:
        return 'text-yellow-800 bg-yellow-100';
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">Orders Management</h1>
          <p className="text-gray-300 text-sm mt-1">View and manage your store orders</p>
        </div>
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 bg-black/80 text-white">
          <h2 className="text-lg font-semibold">Your Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-black/80 text-white">
                <th className="px-4 py-3 font-medium text-sm">Order ID</th>
                <th className="px-4 py-3 font-medium text-sm">Date</th>
                <th className="px-4 py-3 font-medium text-sm">Customer</th>
                <th className="px-4 py-3 font-medium text-sm">Contact</th>
                <th className="px-4 py-3 font-medium text-sm">Address</th>
                <th className="px-4 py-3 font-medium text-sm">Products</th>
                <th className="px-4 py-3 font-medium text-sm">Payment</th>
                <th className="px-4 py-3 font-medium text-sm">Status</th>
                <th className="px-4 py-3 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-white bg-black/40">
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-white/10 hover:bg-black/60 transition-all duration-300">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{order.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-white text-xs">{new Date(order.date).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(order.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-white text-xs">{order.customerDetails.firstName} {order.customerDetails.lastName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-300 text-xs">{order.customerDetails.email}</p>
                    <p className="text-gray-400 text-xs">{order.customerDetails.phoneNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-300 text-xs">{order.customerDetails.address}</p>
                    <p className="text-gray-400 text-xs">{order.customerDetails.city}, {order.customerDetails.state}</p>
                  </td>
                  <td className="px-4 py-3">
                    {order.items.map((item, index) => (
                      <p key={index} className="mb-0.5 text-xs">
                        <span className="font-medium text-white">{item.name}</span>
                        <span className="text-gray-400"> x {item.quantity}</span>
                        {item.size && <span className="text-gray-500 ml-1">• Size: {item.size}</span>}
                      </p>
                    ))}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {order.customerDetails.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="px-2 py-1 border border-white/10 rounded-md focus:ring-1 focus:ring-white focus:border-white text-xs bg-black/40 text-white shadow-sm transition-all duration-300"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}