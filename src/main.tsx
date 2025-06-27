import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <App />
      <Toaster
        position="bottom-left" // Ensures visibility on all screen sizes
        toastOptions={{
          duration: 3000, // Toast duration for responsiveness
          style: {
            background: '#000', // Dark background for better contrast
            color: '#fff', // White text for readability
            border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border for aesthetics
            fontSize: '0.875rem', // Responsive font size
            padding: '0.75rem', // Responsive padding
          },
          success: {
            style: {
              background: '#000',
              color: '#fff',
              fontSize: '0.875rem',
              padding: '0.75rem',
            },
            iconTheme: {
              primary: '#fff', // Icon color for success
              secondary: '#000', // Background color for success icon
            },
          },
          error: {
            style: {
              background: '#000',
              color: '#fff',
              fontSize: '0.875rem',
              padding: '0.75rem',
            },
            iconTheme: {
              primary: '#fff', // Icon color for error
              secondary: '#000', // Background color for error icon
            },
          },
        }}
      />
    </CartProvider>
  </StrictMode>
);