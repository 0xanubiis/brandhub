import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Product, getProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Settings } from 'lucide-react';
import { CartDropdown } from '../components/CartDropdown';
import { ProductCard } from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch, state } = useCart();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
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
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">
              Home
            </button>
            <button onClick={() => navigate('/products')} className="text-gray-600 hover:text-gray-900">
              Products
            </button>
            <button onClick={() => navigate('/why-us')} className="text-gray-600 hover:text-gray-900">
              Why Us
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => navigate(currentUser ? '/admin' : '/admin/login')}>
              {currentUser ? <Settings size={20} /> : <User size={20} />}
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
                src={product.images[0]}
                alt={product.name}
                className="w-full h-[500px] object-cover object-center"
              />
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
              onClick={() => {
                dispatch({
                  type: 'ADD_TO_CART',
                  payload: { ...product, quantity: 1 },
                });
                toast.success(`${product.name} added to cart!`);
              }}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* More Products Section */}
        <div className="mt-16 pb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">More Products</h2>
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
      </div>

      {/* Cart Dropdown */}
      {isCartOpen && <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
    </div>
  );
}