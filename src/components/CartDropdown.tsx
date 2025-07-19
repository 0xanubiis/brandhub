import { useState } from 'react';
import { X, ShoppingBag, Trash2, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CheckoutForm } from './CheckoutForm';
import { toast } from 'react-hot-toast';

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
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 glass-dark transform transition-all duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/20 bg-black/40 backdrop-blur-xl text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 to-white/5 rounded-xl backdrop-blur-sm">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Shopping Cart</h3>
                  <p className="text-sm text-gray-300">You have {state.items.length} items</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-gray-600" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">Your cart is empty</p>
                <p className="text-gray-400 text-sm">Add some products to get started!</p>
              </div>
            ) : (
              state.items.map((item) => {
                const discountedPrice = item.discount
                  ? item.price * (1 - item.discount / 100)
                  : item.price;
                return (
                  <div key={item.id} className="glass-dark p-4 rounded-xl border border-white/10 animate-fade-up">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-200">
                        {item.images && item.images[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-600 mb-1">{item.category}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-gray-900">
                              ${discountedPrice.toFixed(2)}
                            </span>
                            {item.discount && (
                              <span className="text-xs line-through text-gray-400">
                                ${item.price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 bg-red-100 rounded-full transition-colors duration-200 group"
                            >
                              <Trash2 className="h-4 text-red-500 hover:text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-white/20 p-6 bg-black/40 backdrop-blur-xl text-white">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium">Total:</span>
                <div className="text-right">
                              <span className="text-2xl font-bold text-white">
              ${total.toFixed(2)}
            </span>
                  <p className="text-sm text-gray-400">Free shipping</p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-white hover:bg-gray-200 text-black py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl transform flex items-center justify-center space-x-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>Proceed to Checkout</span>
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