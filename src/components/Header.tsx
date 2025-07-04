import { useState } from 'react';
import { ShoppingCart, Menu, X, ShoppingBag, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartDropdown } from './CartDropdown';

export function Header() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { state } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              className="sm:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div 
              className="flex items-center ml-4 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <ShoppingBag className="h-6 w-6 mr-2" />
              <span className="text-xl font-bold text-[#29292B]">Brand Hub</span>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center justify-center space-x-8">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="text-[#29292B] hover:text-gray-600 font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/products')} 
              className="text-[#29292B] hover:text-gray-600 font-medium"
            >
              Products
            </button>
            <button 
              onClick={() => navigate('/why-us')} 
              className="text-[#29292B] hover:text-gray-600 font-medium"
            >
              Why Us
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/login')}
              className="p-2 hover:bg-gray-100 rounded-full text-black"
              title={currentUser ? 'Admin Dashboard' : 'Admin Login'}
            >
              {currentUser ? (
                <Settings size={20} />
              ) : (
                <User size={20} />
              )}
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="p-2 hover:bg-gray-100 rounded-full relative text-black"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white sm:hidden pt-16">
          <div className="p-4 space-y-4">
            <button onClick={() => scrollToSection('hero')} className="block text-[#29292B] hover:text-gray-600 py-2">Home</button>
            <button onClick={() => navigate('/products')} className="block text-[#29292B] hover:text-gray-600 py-2">Products</button>
            <button onClick={() => navigate('/AboutUs')} className="block text-[#29292B] hover:text-gray-600 py-2">About Us</button>
          </div>
        </div>
      )}
    </nav>
  );
}