import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store as StoreIcon, ArrowLeft } from 'lucide-react';
import { Product, getStoreProductsByName, getStoreByName } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Footer } from '../components/Footer';
import { toast } from 'react-hot-toast';

export function StorePage() {
  const { storeName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeExists, setStoreExists] = useState(true);

  useEffect(() => {
    const loadStoreProducts = async () => {
      if (!storeName) {
        setError('Store not found');
        setStoreExists(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // First check if store exists
        const store = await getStoreByName(decodeURIComponent(storeName));
        if (!store) {
          setError('Store not found');
          setStoreExists(false);
          setIsLoading(false);
          return;
        }

        const storeProducts = await getStoreProductsByName(decodeURIComponent(storeName));
        setProducts(storeProducts);
        setStoreExists(true);
      } catch (error) {
        console.error('Error loading store products:', error);
        setError('Failed to load store products');
        toast.error('Failed to load store products');
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreProducts();

    // Listen for product updates (including deletions)
    const handleProductsUpdate = () => {
      loadStoreProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, [storeName]);

  if (!storeExists) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <StoreIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-white">Store Not Found</h2>
            <p className="mt-1 text-sm text-gray-400">The store you're looking for doesn't exist.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-200"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-700 rounded w-64"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-64 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white hover:text-gray-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Store Info */}
          <div className="bg-black/40 backdrop-blur-xl text-white rounded-lg p-8 mb-8 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <StoreIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{decodeURIComponent(storeName || '')}</h1>
                <p className="text-gray-300 mt-1">{products.length} Products</p>
              </div>
            </div>
          </div>

          {error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No products found for this store.</p>
            </div>
          ) : (
            <div className="mb-16"> {/* Added margin-bottom here */}
              <h2 className="text-xl font-semibold mb-6 text-white">All Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}