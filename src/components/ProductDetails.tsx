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
  const dispatch = useDispatch();
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      const products: Product[] = await fetchProducts();

      async function fetchProducts(): Promise<Product[]> {
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
        setMainImage(foundProduct.images[0]);
      } else {
        navigate('/products');
        toast.error('Product not found');
      }
    };

    loadProduct();
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="glass-dark p-8 rounded-2xl animate-pulse">
          <div className="w-16 h-16 gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={mainImage || product.images[0]}
              alt={product.name}
              className="w-full rounded-lg"
            />
            <div className="flex gap-2 mt-4">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-16 h-16 rounded-lg cursor-pointer"
                  onClick={() => setMainImage(image)}
                />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
            <button className="mt-4 bg-black text-white py-2 px-4 rounded">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}