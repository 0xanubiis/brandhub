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
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300 ease-in-out z-40 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-gradient-to-br from-white to-gray-50 backdrop-blur-xl shadow-lg transform transition-all duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-900 to-black text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold">Shopping Cart</h3>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors duration-300">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4">
                  <ShoppingBag className="h-12 w-12" />
                </div>
                <p className="text-sm text-center font-medium">Your cart is empty</p>
                <p className="text-xs text-gray-400 mt-1">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 border-b border-gray-200 pb-4">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="h-12 w-12 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {item.name} <span className="text-gray-500">(x{item.quantity})</span>
                        {item.size && <span className="text-gray-500 ml-1">• Size: {item.size}</span>}
                      </h4>
                      {item.discount ? (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 line-through">${item.price.toFixed(2)}</p>
                          <p className="text-sm font-bold text-gray-900">
                            ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                            <span className="ml-1 text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-1.5 py-0.5 rounded-full font-medium">
                              {item.discount}% OFF
                            </span>
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-gray-900">${item.price.toFixed(2)}</p>
                      )}
                    </div>
                    {/* Trash Icon */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
                      title="Remove Item"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-900 to-black text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-lg font-bold">USD {total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-white to-gray-100 text-black py-3 px-4 rounded-lg hover:from-gray-100 hover:to-white transition-all duration-300 font-semibold text-sm shadow-md hover:scale-105"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

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