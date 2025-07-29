import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product, getProducts } from '../data/products';
import { Footer } from '../components/Footer';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStore, setSelectedStore] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();

    // Listen for product updates (including deletions)
    const handleProductsUpdate = () => {
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, []);

  const categories = ['All', ...new Set(products.map(product => product.category))];
  const stores = ['All', ...new Set(products.map(product => product.storeName))];

  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesStore = selectedStore === 'All' || product.storeName === selectedStore;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesCategory && matchesStore && matchesSearch && matchesPrice;
    });
    
    setFilteredProducts(filtered);
  }, [selectedCategory, selectedStore, searchQuery, priceRange, products]);

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="h-12 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-white hover:text-gray-300 text-sm"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white">All Products</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-white/10 rounded-full text-white"
              title="Toggle filters"
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          {/* Search and Filters */}
          <div className="mb-6 sm:mb-8">
            <div className="relative mb-4 sm:mb-6">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-8 sm:pl-10 bg-white/10 border border-white/20 rounded-lg focus:ring-white/50 focus:border-white/50 text-white placeholder-gray-400 text-sm"
              />
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            {showFilters && (
              <div className="bg-black/40 backdrop-blur-xl p-4 sm:p-6 rounded-lg space-y-4 sm:space-y-6 border border-white/10">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors
                          ${selectedCategory === category
                            ? 'bg-white text-black'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stores */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Stores</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {stores.map((store) => (
                      <button
                        key={store}
                        onClick={() => setSelectedStore(store)}
                        className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors
                          ${selectedStore === store
                            ? 'bg-white text-black'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                          }`}
                      >
                        {store}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-300">to</span>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-700 h-[250px] sm:h-[300px] rounded-lg mb-3 sm:mb-4"></div>
                  <div className="h-3 sm:h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 text-sm"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}