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
  const [selectedCategory] = useState<string>('All');
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
      <nav className="fixed top-0 w-full glass-nav z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <button
                className="sm:hidden text-gray-700 hover:text-gray-900 transition-colors duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div 
                className="flex items-center ml-4 cursor-pointer group"
                onClick={() => navigate('/')}
              >
                <div className="p-2 gradient-to-r from-gray-800 to-gray-700 rounded-xl mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <ShoppingBag className="h-6 w-6"/>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:to-gray-800 transition-all duration-300">
                  Brand Hub
                </span>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center justify-center space-x-8">
              <button 
                onClick={() => scrollToSection('hero')} 
                className="text-gray-700 hover:text-gray-900 font-medium relative group transition-all duration-300">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-to-r from-gray-800 to-gray-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button 
                onClick={() => navigate('/products')} 
                className="text-gray-700 hover:text-gray-900 font-medium relative group transition-all duration-300">
                Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-to-r from-gray-800 to-gray-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button 
                onClick={() => navigate('/why-us')} 
                className="text-gray-700 hover:text-gray-900 font-medium relative group transition-all duration-300">
                Why Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-to-r from-gray-800 to-gray-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/login')}
                className="p-3 gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-xl text-white transition-all duration-300 scale-105 shadow-lg"
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
                  className="p-3 gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-xl relative text-white transition-all duration-300 scale-105 shadow-lg">
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
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
        <div className="fixed inset-0 z-40 glass-nav sm:hidden pt-20">
          <div className="p-6 space-y-6">
            <button onClick={() => scrollToSection('hero')} className="block text-gray-700 hover:text-gray-900 py-3 text-lg font-medium transition-all duration-300 hover:translate-x-2">Home</button>
            <button onClick={() => navigate('/products')} className="block text-gray-700 hover:text-gray-900 py-3 text-lg font-medium transition-all duration-300 hover:translate-x-2">Products</button>
            <button onClick={() => navigate('/AboutUs')} className="block text-gray-700 hover:text-gray-900 py-3 text-lg font-medium transition-all duration-300 hover:translate-x-2">About Us</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div id="hero" className="pt-20 relative">
        <div 
          className="min-h-[600px] relative hero-gradient"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd6008?q=80&w=2070&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 low-hidden pointer-events-none">
            <div 
              className="absolute -top-40 -right-40 w-80 h-80 rounded-full backdrop-blur-xl animate-float border border-white/20"
              style={{ animationDelay: '0s' }}
            />
            <div 
              className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full backdrop-blur-xl animate-float border border-white/20"
              style={{ animationDelay: '2s' }}
            />
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full backdrop-blur-xl animate-float border border-white/20"
              style={{ animationDelay: '4s' }}
            />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="text-center animate-fade-up">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-white mr-3 animate-pulse" />
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-300 sm:text-6xl">
                  Your Brands In One Place
                </h1>
                <Sparkles className="h-8 w-8 text-white ml-3 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300 sm:text-2xl leading-relaxed">
                Discover our latest arrivals featuring breathable fabrics and modern designs with premium quality.
              </p>
              
              {/* Search Bar */}
              <div className="mt-10 max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 text-white bg-white/10 backdrop-blur-xl rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder-gray-400 shadow-0_4px_12px_rgba(0,0,0,0.1) hover:shadow-0_4px_16px_rgba(0,0,0,0.2)"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center">
                <button
                  onClick={() => scrollToSection('products')}
                  className="w-full sm:w-auto px-8 py-4 text-white font-semibold bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg border border-white/20">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 low-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 rounded-full blur-2 animate-float" />
          <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full blur-2 animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold text-white mb-6 gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Latest Products
            </h2>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 group">
              See All Products
              <ArrowRight className="h-5 w-5 up-hover:translate-x-1 transition-transform duration-300"/>
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="glass-card h-96 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-white mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 gradient-to-r from-white to-gray-100 text-gray-800 rounded-xl hover:from-gray-100 hover:to-white transition-all duration-300 shadow-lg">
                Try Again
              </button>
            </div>
          ) : displayedProducts.length === 0 ? (
            <p className="text-center text-white py-8">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayedProducts.map((product, index) => (
                <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Section */}
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-[200px] rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div
                  key={category}
                  className="bg-black text-white h-[250px] rounded-xl flex items-center justify-center text-xl font-bold cursor-pointer hover:scale-105 transition-transform pb-2"
                  onClick={() => navigate(`/collection/${category.toLowerCase()}`)}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}