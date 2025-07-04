import { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CheckoutForm } from './CheckoutForm';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export function CartDropdown({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state, dispatch } = useCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const handleCheckout = () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setShowCheckoutForm(true);
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    toast.success('Item removed from cart');
  };

  // Calculate the total dynamically
  const calculateTotal = () => {
    return state.items.reduce((total, item) => {
      const discountedPrice = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const total = calculateTotal();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity z-40"
          onClick={onClose}
        />
      )}

      {/* Cart Panel */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white/90 backdrop-blur-xl shadow-[0_0_24px_rgba(0,0,0,0.1)] transform transition-transform duration-300 ease-in-out z-50 translate-x-0">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-[#29292B] backdrop-blur-xl text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Shopping Cart</h3>
                </div>
                <button onClick={onClose} className="text-white hover:text-gray-300">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingBag className="h-12 w-12 mb-4" />
                  <p className="text-center">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border-b border-gray-200 pb-4">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded-lg shadow-md"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.name} <span className="text-gray-500">(x{item.quantity})</span>
                        </h4>
                        {item.discount ? (
                          <div>
                            <p className="text-sm text-gray-500 line-through">${item.price.toFixed(2)}</p>
                            <p className="text-sm text-red-600">
                              ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                              <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                {item.discount}% OFF
                              </span>
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                        )}
                      </div>
                      {/* Trash Icon */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                        title="Remove Item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {state.items.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-[#29292B] backdrop-blur-xl text-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">USD {total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-white/90 backdrop-blur-sm text-black py-3 px-4 rounded-md hover:bg-white transition-colors font-medium shadow-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Form Modal */}
      {showCheckoutForm && (
        <CheckoutForm
          onClose={() => setShowCheckoutForm(false)}
          cartItems={state.items}
          total={total}
          onSuccess={() => {
            setShowCheckoutForm(false);
            onClose();
            dispatch({ type: 'CLEAR_CART' });
            toast.success('Order placed successfully! Thank you for your purchase.');
          }}
        />
      )}
    </>
  );
}