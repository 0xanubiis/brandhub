import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, ShoppingBag, User, Settings, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { CartDropdown } from '../components/CartDropdown';
import { Footer } from '../components/Footer';
import { Product, getProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function Store() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        setDisplayedProducts(fetchedProducts.slice(0, 20));
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();

    window.addEventListener('productsUpdated', loadProducts);
    return () => window.removeEventListener('productsUpdated', loadProducts);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const products = await getProducts();
        const uniqueCategories = Array.from(new Set(products.map((product) => product.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setDisplayedProducts(filtered.slice(0, 20));
  }, [selectedCategory, searchQuery, products]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-12">
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
                  <ShoppingBag className="h-4 w-4"/>
                </div>
                <span className="text-lg font-bold text-white group-hover:text-gray-200 transition-all duration-300">
                  Brand Hub
                </span>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center justify-center space-x-6">
              <button 
                onClick={() => scrollToSection('hero')} 
                className="text-white hover:text-gray-300 font-medium relative group transition-all duration-300 text-sm">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button 
                onClick={() => navigate('/products')} 
                className="text-white hover:text-gray-300 font-medium relative group transition-all duration-300 text-sm">
                Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button 
                onClick={() => navigate('/AboutUs')} 
                className="text-white hover:text-gray-300 font-medium relative group transition-all duration-300 text-sm">
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>

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
                  className="p-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-lg relative text-white transition-all duration-300 hover:scale-105 shadow-lg border border-white/10">
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
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl sm:hidden pt-16">
          <div className="p-4 space-y-4">
            <button onClick={() => scrollToSection('hero')} className="block text-white hover:text-gray-300 py-2 text-base font-medium transition-all duration-300 hover:translate-x-2">Home</button>
            <button onClick={() => navigate('/products')} className="block text-white hover:text-gray-300 py-2 text-base font-medium transition-all duration-300 hover:translate-x-2">Products</button>
            <button onClick={() => navigate('/AboutUs')} className="block text-white hover:text-gray-300 py-2 text-base font-medium transition-all duration-300 hover:translate-x-2">About Us</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div id="hero" className="min-h-[300px] sm:min-h-[400px] flex items-center justify-center overflow-hidden py-6 sm:py-8 pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-white/5 animate-float blur-xl"></div>
          <div className="absolute top-20 sm:top-40 right-10 sm:right-40 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-white/5 animate-float-slow blur-xl" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-10 sm:bottom-20 left-1/3 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-white/5 animate-float blur-xl" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-20 sm:bottom-40 right-10 sm:right-20 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-white/5 animate-float-slow blur-xl" style={{ animationDelay: '6s' }}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 text-center">
          <div className="animate-fade-in-up">          {/* Main Heading */}
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white mr-2 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white">
                Your Brands
              </h1>
              <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white ml-2 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
              In One Place
            </h2>
            <p className="mt-2 max-w-2xl mx-auto text-sm sm:text-base text-gray-300 leading-snug mb-3 sm:mb-4 px-4">
              Discover our curated collection featuring premium quality products with modern designs and exceptional craftsmanship.
            </p>
            {/* Search Bar */}
            <div className="mt-3 sm:mt-4 max-w-md mx-auto mb-3 sm:mb-4 px-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-white bg-white/10 backdrop-blur-xl rounded-lg sm:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder-gray-400 text-sm shadow-lg hover:shadow-white/10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5"/>
              </div>
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center px-4">
              <button
                onClick={() => scrollToSection('products')}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-black font-semibold bg-gradient-to-r from-white to-gray-200 hover:from-gray-200 hover:to-white rounded-lg sm:rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-white/20 flex items-center justify-center gap-2 text-sm">
                Explore Products
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/products')}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-transparent text-white border-2 border-white/30 hover:border-white/60 rounded-lg sm:rounded-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                View All
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="bg-black relative overflow-hidden py-6 sm:py-8">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-white/5 animate-float blur-xl"></div>
          <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-white/5 animate-float-slow blur-xl" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 z-10">
          <div className="text-center mb-6 sm:mb-8 animate-fade-in-up">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Featured Products
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto px-4">
              Discover our handpicked selection of premium products designed for modern lifestyles.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800/20 p-3 rounded-lg sm:rounded-xl">
                  <div className="bg-gray-700/20 h-32 rounded-lg mb-2"></div>
                  <div className="bg-gray-700/20 h-3 rounded w-2/3 mb-1"></div>
                  <div className="bg-gray-700/20 h-3 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-8 sm:py-12">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {displayedProducts.length > 0 && (
            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={() => navigate('/products')}
                className="px-4 py-2 text-black font-semibold bg-gradient-to-r from-white to-gray-200 hover:from-gray-200 hover:to-white rounded-lg transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-white/20 flex items-center gap-2 mx-auto text-sm">
                View All Products
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Section */}
      <div className="pt-6 sm:pt-8 pb-4 sm:pb-6 bg-black">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white px-4">Shop by Category</h2>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-[80px] sm:h-[120px] rounded-md"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  className="glass-dark p-2 sm:p-3 rounded-lg w-full text-left text-white font-semibold shadow border border-white/10 hover:border-white/20 transition-all duration-200 text-xs sm:text-sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
