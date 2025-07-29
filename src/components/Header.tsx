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
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex items-center">
            <button
              className="sm:hidden text-white hover:text-gray-300 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div 
              className="flex items-center ml-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="p-1.5 bg-gradient-to-r from-white to-gray-200 rounded-lg mr-2 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white group-hover:text-gray-200 transition-all duration-300">
                Brand Hub
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center justify-center space-x-6">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="text-white hover:text-gray-300 font-medium relative group transition-all duration-300 text-sm"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => navigate('/products')} 
              className="text-white hover:text-gray-300 font-medium relative group transition-all duration-300 text-sm"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => navigate('/AboutUs')} 
              className="text-white hover:text-gray-300 font-medium relative group transition-all duration-300 text-sm"
            >
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/login')}
              className="p-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-lg text-white transition-all duration-300 hover:scale-105 shadow-lg border border-white/10"
              title={currentUser ? 'Admin Dashboard' : 'Admin Login'}
            >
              {currentUser ? (
                <Settings size={16} />
              ) : (
                <User size={16} />
              )}
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="p-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-lg relative text-white transition-all duration-300 hover:scale-105 shadow-lg border border-white/10"
              >
                <ShoppingCart size={16} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
              <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl sm:hidden pt-16">
          <div className="p-4 space-y-4">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="block text-white hover:text-gray-300 py-2 text-base font-medium transition-all duration-300 hover:translate-x-2"
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/products')} 
              className="block text-white hover:text-gray-300 py-2 text-base font-medium transition-all duration-300 hover:translate-x-2"
            >
              Products
            </button>
            <button 
              onClick={() => navigate('/AboutUs')} 
              className="block text-white hover:text-gray-300 py-2 text-base font-medium transition-all duration-300 hover:translate-x-2"
            >
              About Us
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}