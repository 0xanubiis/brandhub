import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PayPalButtons } from '@paypal/react-paypal-js';

interface CheckoutFormProps {
  onClose: () => void;
  total: number;
  onSuccess: () => void;
  onSendShippingInfo: (shippingInfo: FormData, storeIds: string[]) => void; // Callback to send shipping info to relevant stores
  cartItems: CartItem[]; // Cart items to determine the stores
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  storeId: string; // Store ID associated with the product
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
};

export function CheckoutForm({
  onClose,
  total,
  onSuccess,
  onSendShippingInfo,
  cartItems,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isPayPalVisible, setIsPayPalVisible] = useState(false);
  const [isPayPalProcessing, setIsPayPalProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'city', 'state', 'postalCode'];
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        toast.error(`Please fill in your ${field}`);
        return false;
      }
    }
    return true;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Show PayPal payment section
    setIsPayPalVisible(true);
  };

  const handlePayPalSuccess = async () => {
    // Extract unique store IDs from the cart items
    const storeIds = Array.from(new Set(cartItems.map((item) => item.storeId)));

    // Send shipping info to relevant stores
    onSendShippingInfo(formData, storeIds);

    // Notify the user of success
    toast.success('Payment successful!');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {isPayPalVisible ? 'Pay with PayPal' : 'Shipping Information'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {!isPayPalVisible ? (
          // Shipping Information Form
          <form onSubmit={handleShippingSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors"
            >
              Proceed to Payment
            </button>
          </form>
        ) : (
          // PayPal Payment Section
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
        )}
      </div>
    </div>
  );
}