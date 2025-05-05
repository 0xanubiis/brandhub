import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Product, getProducts } from '../data/products';
import { useCart } from '../context/CartContext';

export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const products = await getProducts();
        const foundProduct = products.find((p) => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>
    </div>
  );
}