import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Product, getProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';

export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const products = await getProducts();
        const foundProduct = products.find((p) => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          setMainImage(foundProduct.images[0]); // Set the first image as the main image

          // Fetch related products (e.g., same category, excluding the current product)
          const related = products.filter(
            (p) => p.category === foundProduct.category && p.id !== foundProduct.id
          );
          setRelatedProducts(related.slice(0, 4)); // Limit to 4 related products
        } else {
          navigate('/products');
          toast.error('Product not found or has been deleted');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Error loading product details');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();

    // Listen for product updates (including deletions)
    const handleProductsUpdate = () => {
      loadProduct();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      // Check if size is required and selected
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        toast.error('Please select a size');
        return;
      }

      dispatch({
        type: 'ADD_TO_CART',
        payload: { ...product, quantity, size: selectedSize },
      });
      toast.success(`${product.name} (x${quantity})${selectedSize ? ` - Size: ${selectedSize}` : ''} added to cart!`);
    }
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change)); // Ensure quantity is at least 1
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center animate-fade-in">
          <div className="w-12 h-12 border-4 border-t-transparent border-b-transparent border-l-white border-r-gray-400 rounded-full animate-spin mb-4" style={{ boxShadow: '0 0 24px 0 rgba(0,0,0,0.2)' }}></div>
          <p className="text-white text-lg font-medium tracking-wide">Loading product...</p>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <Header />

      <div className="pt-20 max-w-5xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Product Images */}
          <div className="space-y-3 md:space-y-4">
            <div className="aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-lg">
              <img
                src={mainImage || product.images[0]}
                alt={product.name}
                className="w-full h-[350px] md:h-[450px] object-cover object-center"
              />
            </div>
            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 md:gap-4">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className={`h-16 w-16 md:h-20 md:w-20 object-cover rounded-xl border border-white/10 cursor-pointer transition-all duration-200 hover:opacity-80 ${
                      mainImage === image ? 'ring-2 ring-white' : ''
                    }`}
                    onClick={() => setMainImage(image)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 bg-black/60 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/10 shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{product.name}</h1>
            <p className="text-base md:text-lg text-gray-300 mb-1">{product.category}</p>
            <p className="text-gray-400 text-sm md:text-base mb-2 line-clamp-4">{product.description}</p>
            <div className="flex items-center space-x-3 md:space-x-4">
              {product.discount ? (
                <div className="space-y-1">
                  <p className="text-base md:text-lg line-through text-gray-500">${product.price.toFixed(2)}</p>
                  <p className="text-2xl md:text-3xl font-bold text-yellow-400">${discountedPrice.toFixed(2)}</p>
                  <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-medium shadow">
                    {product.discount}% OFF
                  </span>
                </div>
              ) : (
                <p className="text-2xl md:text-3xl font-bold text-white">${product.price.toFixed(2)}</p>
              )}
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-300">Size</label>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 border rounded-md text-xs md:text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-white text-black border border-white/20'
                          : 'border border-white/10 text-gray-200 bg-black/30 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <label className="text-xs font-medium text-gray-300">Quantity:</label>
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-3 py-1 bg-black/40 text-white rounded-md border border-white/10 hover:bg-black/60 transition"
              >
                -
              </button>
              <span className="text-base font-medium text-white">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-1 bg-black/40 text-white rounded-md border border-white/10 hover:bg-black/60 transition"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full mt-2 px-4 py-2 text-black bg-white rounded-md hover:bg-gray-200 border border-white/10 transition-all font-semibold text-sm md:text-base"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* More Products Section */}
        <div className="mt-10 md:mt-16">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">More Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-16">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}