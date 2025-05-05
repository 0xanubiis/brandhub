import { supabase } from '../config/supabase';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  admin_id: string;
  store_name: string;
  size?: string;
}

export interface Order {
  id: string;
  customer: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled' | 'Refunded';
  date: string;
  customer_details: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    paymentMethod: string;
  };
}

// Get all orders
export const getOrders = async (): Promise<Order[]> => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .order('date', { ascending: false });

    if (error) throw error;

    return (orders || []).map(order => ({
      ...order,
      items: order.order_items.map((item: any) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        admin_id: item.product.admin_id,
        store_name: item.product.store_name,
        size: item.size
      }))
    }));
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

// Get orders for specific admin
export const getAdminOrders = async (adminId: string): Promise<Order[]> => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .order('date', { ascending: false });

    if (error) throw error;

    return (orders || [])
      .map(order => ({
        ...order,
        items: order.order_items
          .filter((item: any) => item.product.admin_id === adminId)
          .map((item: any) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            admin_id: item.product.admin_id,
            store_name: item.product.store_name,
            size: item.size
          }))
      }))
      .filter(order => order.items.length > 0);
  } catch (error) {
    console.error('Error getting admin orders:', error);
    return [];
  }
};

// Add a new order
export const addOrder = async (order: Omit<Order, 'id'>): Promise<void> => {
  try {
    // Start a Supabase transaction
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer: order.customer,
        total: order.total,
        status: order.status,
        date: order.date,
        customer_details: order.customer_details
      })
      .select()
      .single();

    if (orderError) throw orderError;
    if (!orderData) throw new Error('Failed to create order');

    // Insert order items
    const orderItems = order.items.map(item => ({
      order_id: orderData.id,
      product_id: item.admin_id, // This should be the actual product ID
      quantity: item.quantity,
      price: item.price,
      size: item.size
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    window.dispatchEvent(new Event('ordersUpdated'));
  } catch (error) {
    console.error('Error adding order:', error);
    throw new Error('Failed to add order');
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled' | 'Refunded'
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) throw error;
    window.dispatchEvent(new Event('ordersUpdated'));
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

// Subscribe to orders changes
export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  const subscription = supabase
    .channel('orders_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders'
      },
      async () => {
        // Fetch updated orders when changes occur
        const orders = await getOrders();
        callback(orders);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};