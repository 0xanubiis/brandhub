import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { CheckoutForm } from './CheckoutForm';

const cartItems = [
  { id: '1', name: 'Product A', quantity: 2, price: 50, discount: 10 },
  { id: '2', name: 'Product B', quantity: 1, price: 100 },
];

const calculateTotal = () => {
  return cartItems.reduce((total, item) => {
    const discountedPrice = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return total + discountedPrice * item.quantity;
  }, 0);
};

const App = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <PayPalScriptProvider
      options={{
        clientId: 'BAABwcP0Y_Fjwz59xvaFHbLXnZr93-r9l7W4A0DDW_WG8WW1yNoTUWVoE081NWwQRxHtsrUCZnqIER0Rxs', // Replace with your actual PayPal client ID
        currency: 'USD', // Ensure the currency matches your requirements
      }}
    >
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
        <CheckoutForm
          onClose={() => console.log('Checkout closed')}
          onSuccess={() => console.log('Payment successful')}
          cartItems={cartItems} // Pass actual cart items here
          total={calculateTotal()} // Dynamically calculate the total amount
        />
      </div>
    </PayPalScriptProvider>
  </div>
);

export default App;