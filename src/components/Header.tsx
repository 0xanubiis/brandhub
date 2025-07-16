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
    <nav className="fixed top-0 w-full bg-gradient-to-r from-black via-gray-900 to-black backdrop-blur-xl bg-opacity-95 shadow-2xl z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button
              className="sm:hidden text-white hover:text-gray-300 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div 
              className="flex items-center ml-4 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="p-2 bg-gradient-to-r from-white to-gray-200 rounded-xl mr-3 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="h-6 w-6 text-black" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-200 group-hover:to-white transition-all duration-300">
                Brand Hub
              </span>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center justify-center space-x-8">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="text-white hover:text-gray-300 font-medium relative group transition-all duration-300"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => navigate('/products')} 
              className="text-white hover:text-gray-300 font-medium relative group transition-all duration-300"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => navigate('/why-us')} 
              className="text-white hover:text-gray-300 font-medium relative group transition-all duration-300"
            >
              Why Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/login')}
              className="p-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-xl text-white transition-all duration-300 hover:scale-105 shadow-lg"
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
                className="p-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-xl relative text-white transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
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
        <div className="fixed inset-0 z-40 bg-gradient-to-b from-black via-gray-900 to-black backdrop-blur-xl bg-opacity-95 sm:hidden pt-20">
          <div className="p-6 space-y-6">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="block text-white hover:text-gray-300 py-3 text-lg font-medium transition-all duration-300 hover:translate-x-2"
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/products')} 
              className="block text-white hover:text-gray-300 py-3 text-lg font-medium transition-all duration-300 hover:translate-x-2"
            >
              Products
            </button>
            <button 
              onClick={() => navigate('/why-us')} 
              className="block text-white hover:text-gray-300 py-3 text-lg font-medium transition-all duration-300 hover:translate-x-2"
            >
              Why Us
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}