import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discount?: number;
  freeShipping?: boolean;
  images: string[];
}

export function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  // Duplicate declaration removed
  const dispatch = useDispatch();
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      // Import or define fetchProducts function
            const products: Product[] = await fetchProducts();
      
      async function fetchProducts(): Promise<Product[]> {
        // Mock implementation for fetching products
        return [
          {
            id: '1',
            name: 'Sample Product',
            category: 'Category',
            description: 'Description',
            price: 100,
            discount: 10,
            freeShipping: true,
            images: ['image1.jpg', 'image2.jpg'],
          },
        ];
      }
      const foundProduct = products.find((p) => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setMainImage(foundProduct.images[0]); // Set the first image as the main image
      } else {
        navigate('/products');
        toast.error('Product not found');
      }
    };

    loadProduct();
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={mainImage || ''}
                alt={product.name}
                className="w-full h-[500px] object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-24 w-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                  onClick={() => setMainImage(image)} // Swap the clicked image with the main image
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-500">{product.category}</p>
            <p className="text-gray-600">{product.description}</p>
            <div className="flex items-center">
              {product.discount ? (
                <div className="mr-4">
                  <p className="text-lg sm:text-3xl font-bold text-gray-900 line-through mb-1">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-lg sm:text-3xl font-bold text-red-600">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                    <span className="ml-2 text-sm sm:text-lg bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-lg sm:text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              )}
              {product.freeShipping && (
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Free shipping
                </p>
              )}
            </div>
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
      </div>
    </div>
  );
}