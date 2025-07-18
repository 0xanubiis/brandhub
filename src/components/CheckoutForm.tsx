import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { addOrder } from '../data/orders';

interface CheckoutFormProps {
  onClose: () => void;
  cartItems: CartItem[];
  onSuccess: () => void;
  total: number;
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  discount?: number | null;
  size?: string;
  adminId?: string;
  storeName?: string;
}

export function CheckoutForm({ onClose, onSuccess, cartItems, total }: CheckoutFormProps) {
  const [isPayPalProcessing, setIsPayPalProcessing] = useState(false);
  const [isShippingInfoComplete, setIsShippingInfoComplete] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateShippingInfo = () => {
    const { name, address, city, postalCode, country } = shippingInfo;
    if (!name || !address || !city || !postalCode || !country) {
      toast.error('Please complete all shipping information fields.');
      return false;
    }
    return true;
  };

  const handleShippingInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingInfo()) {
      setIsShippingInfoComplete(true);
      toast.success('Shipping information saved!');
    }
  };

  const handlePayPalSuccess = async () => {
    try {
      // Create order in database
      const orderData = {
        customer: shippingInfo.name,
        total: total,
        status: 'Pending' as const,
        date: new Date().toISOString(),
        customer_details: {
          firstName: shippingInfo.name.split(' ')[0] || '',
          lastName: shippingInfo.name.split(' ').slice(1).join(' ') || '',
          email: '', // Could be added to shipping form
          phoneNumber: '', // Could be added to shipping form
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: '', // Could be added to shipping form
          zipCode: shippingInfo.postalCode,
          country: shippingInfo.country,
          paymentMethod: 'PayPal'
        },
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.discount ? item.price * (1 - item.discount / 100) : item.price,
          admin_id: item.adminId || item.id, // Use adminId if available, fallback to id
          store_name: item.storeName || '', // Use storeName if available
          size: item.size
        }))
      };

      await addOrder(orderData);
      toast.success('Payment successful! Order created.');
      onSuccess();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Payment successful but order creation failed. Please contact support.');
      onSuccess(); // Still clear cart even if order creation fails
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 z-50">
      <div className="glass-dark rounded-2xl max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl font-bold gradient-text">
            {isShippingInfoComplete ? 'Pay with PayPal' : 'Shipping Information'}
          </h2>
          <button onClick={onClose} className="text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-200">
            <X size={20} />
          </button>
        </div>

        {!isShippingInfoComplete ? (
          <form onSubmit={handleShippingInfoSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-200 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={shippingInfo.name}
                onChange={handleShippingInfoChange}
                className="w-full bg-black/40 text-white border border-white/10 rounded-md px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-xs font-semibold text-gray-200 mb-1">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={shippingInfo.address}
                onChange={handleShippingInfoChange}
                className="w-full bg-black/40 text-white border border-white/10 rounded-md px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent placeholder-gray-400"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="city" className="block text-xs font-semibold text-gray-200 mb-1">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={shippingInfo.city}
                  onChange={handleShippingInfoChange}
                  className="w-full bg-black/40 text-white border border-white/10 rounded-md px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-xs font-semibold text-gray-200 mb-1">
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={shippingInfo.postalCode}
                  onChange={handleShippingInfoChange}
                  className="w-full bg-black/40 text-white border border-white/10 rounded-md px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent placeholder-gray-400"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="country" className="block text-xs font-semibold text-gray-200 mb-1">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                value={shippingInfo.country}
                onChange={handleShippingInfoChange}
                className="w-full bg-black/40 text-white border border-white/10 rounded-md px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent placeholder-gray-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-2 px-4 rounded-md hover:bg-gray-200 transition-all duration-200 shadow-md"
            >
              Continue
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold gradient-text mb-2">Order Summary</h3>
              <ul className="space-y-2">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm text-gray-200">
                    <span>
                      {item.name} x {item.quantity}
                      {item.size && <span className="text-gray-400 ml-2">• Size: {item.size}</span>}
                    </span>
                    <span>
                      {item.discount ? (
                        <div className="text-right">
                          <p className="text-xs line-through text-gray-400">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm font-bold text-white">
                            ${(
                              item.quantity *
                              (item.price * (1 - item.discount / 100))
                            ).toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-white">${(
                          item.quantity *
                          (item.discount
                            ? item.price * (1 - item.discount / 100)
                            : item.price)
                        ).toFixed(2)}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mt-4 font-bold text-lg text-white">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              {isPayPalProcessing && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <span className="ml-2 text-gray-300">Processing payment...</span>
                </div>
              )}
              <PayPalButtons
                createOrder={(_data, actions) => {
                  setIsPayPalProcessing(true);
                  return actions.order.create({
                    intent: 'CAPTURE',
                    purchase_units: [
                      {
                        amount: {
                          currency_code: 'USD',
                          value: total.toFixed(2),
                        },
                        description: `Order from BrandHub - ${cartItems.length} item(s)`,
                      },
                    ],
                  });
                }}
                onApprove={(_data, actions) => {
                  if (!actions.order) {
                    toast.error('PayPal order actions are unavailable.');
                    setIsPayPalProcessing(false);
                    return Promise.reject(new Error('PayPal order actions are unavailable.'));
                  }
                  return actions.order.capture().then((details) => {
                    console.log('Payment completed successfully:', details);
                    setIsPayPalProcessing(false);
                    handlePayPalSuccess();
                  });
                }}
                onError={(err) => {
                  console.error('PayPal error:', err);
                  toast.error('PayPal payment failed. Please try again.');
                  setIsPayPalProcessing(false);
                }}
                onCancel={() => {
                  console.log('PayPal payment cancelled');
                  toast.error('Payment was cancelled.');
                  setIsPayPalProcessing(false);
                }}
                style={{
                  layout: 'vertical',
                  color: 'silver',
                  shape: 'rect',
                  label: 'pay'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}