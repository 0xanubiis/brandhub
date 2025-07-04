import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, ShoppingBag, User, Settings, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-black">
      {/* Navigation Bar */}
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
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white sm:hidden pt-16">
          <div className="p-4 space-y-4">
            <button onClick={() => scrollToSection('hero')} className="block text-[#29292B] hover:text-gray-600 py-2">Home</button>
            <button onClick={() => navigate('/products')} className="block text-[#29292B] hover:text-gray-600 py-2">Products</button>
            <button onClick={() => navigate('/AboutUs')} className="block text-[#29292B] hover:text-gray-600 py-2">About Us</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div id="hero" className="pt-16 relative">
        <div 
          className="min-h-[600px] relative"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                Your Brands In One Place
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl">
                Discover our latest arrivals featuring breathable fabrics and modern designs.
              </p>
              <div className="mt-8 max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 text-black bg-white/90 backdrop-blur-sm rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                </div>
              </div>
              <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center">
                <button
                  onClick={() => scrollToSection('products')}
                  className="w-full sm:w-auto px-8 py-4 text-white bg-black rounded-full hover:bg-gray-900 transition-all duration-300 shadow-lg font-medium"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="bg-[#29292B] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Latest Products</h2>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              See All Products
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex gap-6 overflow-x-auto pb-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse flex-none w-72">
                  <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-white mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white text-[#29292B] rounded-md hover:bg-gray-100"
              >
                Try Again
              </button>
            </div>
          ) : displayedProducts.length === 0 ? (
            <p className="text-center text-white py-8">No products found.</p>
          ) : (
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6">
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-none w-72 transform transition-transform duration-300 hover:scale-105"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
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