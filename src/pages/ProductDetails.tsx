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
      <Header />

      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={mainImage || product.images[0]}
                alt={product.name}
                className="w-full h-[500px] object-cover object-center"
              />
            </div>
            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className={`h-24 w-24 object-cover rounded-lg cursor-pointer transition-all duration-200 hover:opacity-80 ${
                      mainImage === image ? 'ring-2 ring-black' : ''
                    }`}
                    onClick={() => setMainImage(image)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-500">{product.category}</p>
            <p className="text-gray-600">{product.description}</p>
            <div className="flex items-center space-x-4">
              {product.discount ? (
                <div className="space-y-1">
                  <p className="text-lg line-through text-gray-400">${product.price.toFixed(2)}</p>
                  <p className="text-3xl font-bold text-black">${discountedPrice.toFixed(2)}</p>
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                    {product.discount}% OFF
                  </span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-black">${product.price.toFixed(2)}</p>
              )}
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* More Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">More Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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