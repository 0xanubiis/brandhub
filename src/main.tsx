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
        position="bottom-left"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            style: {
              background: '#000',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#000',
            },
          },
          error: {
            style: {
              background: '#000',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#000',
            },
          },
        }}
      />
    </CartProvider>
  </StrictMode>
);