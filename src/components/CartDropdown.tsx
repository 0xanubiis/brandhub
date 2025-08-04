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
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg overflow-y-auto`}>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold">Shopping Cart</h3>
          <p className="text-sm text-gray-500">You have {state.items.length} items</p>
        </div>
        <div className="p-4 space-y-4">
          {state.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded" />
              <div className="flex-1">
                <h4 className="text-sm font-bold">{item.name}</h4>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold">${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <button className="w-full bg-black text-white py-2 rounded">Checkout</button>
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