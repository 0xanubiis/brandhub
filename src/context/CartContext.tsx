import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '../data/products';

export interface CartItem extends Product {
  quantity: number;
  size?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product & { quantity: number; size?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_SIZE'; payload: { id: string; size: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const loadCartFromStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error);
  }
  return { items: [], total: 0 };
};

const saveCartToStorage = (cart: CartState) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;

  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity, size: action.payload.size || item.size }
              : item
          ),
          total: state.total + action.payload.price * action.payload.quantity,
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload }],
          total: state.total + action.payload.price * action.payload.quantity,
        };
      }
      break;
    }
    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove ? itemToRemove.price * itemToRemove.quantity : 0),
      };
      break;
    }
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id);
      if (!item) return state;

      if (action.payload.quantity < 0) return state;

      const quantityDiff = action.payload.quantity - item.quantity;
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + item.price * quantityDiff,
      };
      break;
    }
    case 'UPDATE_SIZE': {
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, size: action.payload.size }
            : item
        ),
      };
      break;
    }
    case 'CLEAR_CART':
      newState = {
        items: [],
        total: 0,
      };
      break;
    case 'LOAD_CART':
      return loadCartFromStorage();
    default:
      return state;
  }

  saveCartToStorage(newState);
  return newState;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
  });

  useEffect(() => {
    dispatch({ type: 'LOAD_CART' });
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}