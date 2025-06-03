import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase'; // Import Supabase client
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

// Define available order statuses
const ORDER_STATUSES = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Completed',
  'Cancelled',
  'Refunded'
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
    discount?: number | null; // Added discount field
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
            // Sort orders: Pending first, then by date
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

      toast.success(`Order status updated to ${newStatus.toLowerCase()}`, {
        position: 'bottom-left',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status', {
        position: 'bottom-left',
        duration: 3000,
      });
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">View and manage your store orders</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer Details</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Shipping Address</th>
                <th className="px-6 py-4 font-medium">Products</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium">{order.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p>{new Date(order.date).toLocaleDateString()}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(order.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">
                        {order.customerDetails.firstName} {order.customerDetails.lastName}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p>{order.customerDetails.email}</p>
                      <p>{order.customerDetails.phoneNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p>{order.customerDetails.address}</p>
                      <p>{order.customerDetails.streetAddress}</p>
                      <p>{order.customerDetails.city}</p>
                      <p>{order.customerDetails.state}, {order.customerDetails.postalCode}</p>
                      <p>{order.customerDetails.country}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      {order.items.map((item, index) => (
                        <div key={index} className="mb-2">
                          <p className="font-medium">{item.name}</p>
                          <div className="text-sm text-gray-500">
                            <span>Qty: {item.quantity}</span>
                            {item.size && (
                              <span className="ml-2">Size: {item.size}</span>
                            )}
                            <p>${item.price} each</p>
                          </div>
                        </div>
                      ))}
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="font-medium">Total: ${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      {order.items.map((item, index) => (
                        <p key={index}>
                          {item.discount
                            ? `${item.discount}% OFF`
                            : 'No Discount'}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p>Method: {order.customerDetails.paymentMethod}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
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
                  <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                    No orders yet
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