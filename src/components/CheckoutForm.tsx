import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PayPalButtons } from '@paypal/react-paypal-js';

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
    toast.success('Payment successful!');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {isShippingInfoComplete ? 'Pay with PayPal' : 'Shipping Information'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {!isShippingInfoComplete ? (
          <form onSubmit={handleShippingInfoSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={shippingInfo.name}
                onChange={handleShippingInfoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={shippingInfo.address}
                onChange={handleShippingInfoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={shippingInfo.city}
                  onChange={handleShippingInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={shippingInfo.postalCode}
                  onChange={handleShippingInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                value={shippingInfo.country}
                onChange={handleShippingInfoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors"
            >
              Continue
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
              <ul className="space-y-2">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>
                      $
                      {(
                        item.quantity *
                        (item.discount
                          ? item.price * (1 - item.discount / 100)
                          : item.price)
                      ).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mt-4 font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              {isPayPalProcessing && <div className="spinner">Processing...</div>}
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
                  return actions.order.capture().then(() => {
                    setIsPayPalProcessing(false);
                    handlePayPalSuccess();
                  });
                }}
                onError={(err) => {
                  console.error('PayPal error:', err);
                  toast.error('PayPal payment failed. Please try again.');
                  setIsPayPalProcessing(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}