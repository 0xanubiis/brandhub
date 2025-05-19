import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Product, getProducts } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch, state } = useCart();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [moreProducts, setMoreProducts] = useState<Product[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const products = await getProducts();
        const foundProduct = products.find((p) => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);

          // Fetch related products (same category, excluding the current product)
          const related = products.filter(
            (p) => p.category === foundProduct.category && p.id !== foundProduct.id
          );
          setRelatedProducts(related);

          // Fetch more products from the same category
          const more = products.filter(
            (p) => p.category === foundProduct.category && p.id !== foundProduct.id
          );
          setMoreProducts(more);
        } else {
          navigate('/products');
          toast.error('Product not found');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Error loading product details');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 bg-black text-white z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/')} className="text-white hover:text-gray-300">
              Home
            </button>
            <button onClick={() => navigate('/products')} className="text-white hover:text-gray-300">
              Products
            </button>
            <button onClick={() => navigate('/why-us')} className="text-white hover:text-gray-300">
              Why Us
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/cart')} className="relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => navigate(currentUser ? '/admin' : '/admin/login')}>
              <User size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-[500px] object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                    currentImageIndex === index ? 'ring-2 ring-black' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-500">{product.category}</p>

            <div>
              {product.discount ? (
                <>
                  <p className="text-lg line-through text-gray-400">${product.price.toFixed(2)}</p>
                  <p className="text-3xl font-bold text-black">${discountedPrice.toFixed(2)}</p>
                </>
              ) : (
                <p className="text-3xl font-bold text-black">${product.price.toFixed(2)}</p>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            <button
              onClick={() =>
                dispatch({
                  type: 'ADD_TO_CART',
                  payload: { ...product, quantity: 1 },
                })
              }
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No related products found.</p>
          )}
        </div>

        {/* More Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">More Products from the Same Category</h2>
          {moreProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moreProducts.map((moreProduct) => (
                <ProductCard key={moreProduct.id} product={moreProduct} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No more products found in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}