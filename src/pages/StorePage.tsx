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
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <StoreIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Store Not Found</h2>
            <p className="mt-1 text-sm text-gray-500">The store you're looking for doesn't exist.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-900"
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
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-64 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
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
          <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-lg p-8 mb-8">
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
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found for this store.</p>
            </div>
          ) : (
            <div className="mb-16"> {/* Added margin-bottom here */}
              <h2 className="text-xl font-semibold mb-6">All Products</h2>
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