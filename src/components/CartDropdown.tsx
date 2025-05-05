import { useState } from 'react';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
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

    const missingSize = state.items.find(item => !item.size);

    if (missingSize) {
      toast.error(`Please select a size for ${missingSize.name}`);
      return;
    }

    setShowCheckoutForm(true);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 0) {
      toast.error('Quantity cannot be negative');
      return;
    }
    
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
      toast.success('Item removed from cart');
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id, quantity: newQuantity }
      });
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    toast.success('Item removed from cart');
  };

  const handleSizeChange = (id: string, size: string) => {
    dispatch({
      type: 'UPDATE_SIZE',
      payload: { id, size }
    });
    toast.success('Size updated');
  };

  return (
    <>
      {/* Backdrop with blur */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sliding Cart Panel with Glass Effect */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white/90 backdrop-blur-xl shadow-[0_0_24px_rgba(0,0,0,0.1)] transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
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
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      {item.discount ? (
                        <div>
                          <p className="text-sm text-gray-500 line-through">
                            ${item.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-red-600">
                            ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                            <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                              {item.discount}% OFF
                            </span>
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)}
                        </p>
                      )}
                      
                      {/* Size Selection with Glass Effect */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeChange(item.id, size)}
                            className={`px-2 py-1 text-xs rounded backdrop-blur-sm transition-all ${
                              item.size === size
                                ? 'bg-black text-white shadow-md'
                                : 'border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}

                <div className="space-y-2">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} (x{item.quantity})
                      </span>
                      <span className="font-medium">USD {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>USD {state.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-[#29292B] backdrop-blur-xl text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Subtotal:</span>
                <span className="font-bold">USD {state.total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-300 mb-4">
                Shipping and taxes calculated at checkout
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

      {/* Checkout Form Modal */}
      {showCheckoutForm && (
        <CheckoutForm 
          onClose={() => setShowCheckoutForm(false)} 
          cartItems={state.items}
          total={state.total}
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