import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CartItem } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { supabase } from '../config/supabase'; // Import Supabase client
import { PayPalButtons } from '@paypal/react-paypal-js'; // Import PayPal Buttons

interface CheckoutFormProps {
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
  onSuccess: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  paymentMethod: 'card' | 'wallet';
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: '',
  streetAddress: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  paymentMethod: 'card',
};

export function CheckoutForm({ onClose, cartItems, total, onSuccess }: CheckoutFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping');
  const [isPayPalProcessing, setIsPayPalProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateShippingInfo = () => {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'address',
      'streetAddress',
      'city',
      'state',
      'country',
      'postalCode',
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        toast.error(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handlePayPalSuccess = async (details: any) => {
    try {
      const { error } = await supabase.from('orders').insert({
        customer: `${formData.firstName} ${formData.lastName}`,
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          adminId: item.adminId,
          storeName: item.storeName,
          size: item.size,
        })),
        total,
        status: 'Paid',
        date: new Date().toISOString(),
        customerDetails: {
          ...formData,
        },
        paymentDetails: details, // Save PayPal transaction details
      });

      if (error) {
        throw error;
      }

      toast.success('Order placed successfully! You can track your order in the Orders section.');
      onSuccess();
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!total || isNaN(total)) {
      toast.error('Invalid total amount. Please try again.');
      return;
    }

    if (currentStep === 'shipping') {
      if (validateShippingInfo()) {
        setCurrentStep('payment');
      }
      return;
    }

    if (formData.paymentMethod === 'card') {
      try {
        const { error } = await supabase.from('orders').insert({
          customer: `${formData.firstName} ${formData.lastName}`,
          items: cartItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            adminId: item.adminId,
            storeName: item.storeName,
            size: item.size,
          })),
          total,
          status: 'Pending',
          date: new Date().toISOString(),
          customerDetails: {
            ...formData,
          },
        });

        if (error) {
          throw error;
        }

        toast.success('Order placed successfully! You can track your order in the Orders section.');
        onSuccess();
      } catch (error) {
        console.error('Order error:', error);
        toast.error('Failed to place order. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 'shipping' ? (
            <>
              {/* Shipping Information */}
              {/* Add your shipping form fields here */}
            </>
          ) : (
            <>
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                    />
                    <label className="ml-3">
                      <span className="block text-sm font-medium text-gray-700">Credit/Debit Card</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={formData.paymentMethod === 'wallet'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                    />
                    <label className="ml-3">
                      <span className="block text-sm font-medium text-gray-700">PayPal</span>
                    </label>
                  </div>
                </div>
              </div>

              {formData.paymentMethod === 'wallet' && (
                <div className="mt-6">
                  {isPayPalProcessing && <div className="spinner">Processing...</div>}
                  <PayPalButtons
                    disabled={isPayPalProcessing} // Disable the button during processing
                    createOrder={(_data, actions) => {
                      setIsPayPalProcessing(true); // Set loading state
                      if (!total || isNaN(total)) {
                        setIsPayPalProcessing(false); // Reset loading state
                        toast.error('Invalid total amount. Please try again.');
                        return Promise.reject(new Error('Invalid total amount'));
                      }
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              currency_code: 'USD',
                              value: total.toFixed(2),
                            },
                            description: 'Your purchase from Brand Hub',
                          },
                        ],
                        intent: 'CAPTURE',
                      });
                    }}
                    onApprove={(_data, actions) => {
                      if (!actions.order) {
                        setIsPayPalProcessing(false); // Reset loading state
                        return Promise.reject(new Error('Order actions are undefined'));
                      }
                      return actions.order.capture().then((details) => {
                        setIsPayPalProcessing(false); // Reset loading state
                        handlePayPalSuccess(details);
                      });
                    }}
                    onError={(err) => {
                      console.error('PayPal error:', err.message || err);
                      toast.error('PayPal payment failed. Please try again.');
                    }}
                  />
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}