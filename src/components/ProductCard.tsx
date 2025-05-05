import React from 'react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Store } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity: 1 } });
    toast.success('Added to cart!');
  };

  const handleStoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/store/${encodeURIComponent(product.storeName)}`);
  };

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div
      className="group cursor-pointer relative overflow-hidden rounded-xl bg-gray-100 transition-transform duration-300 hover:scale-105"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              {product.discount}% OFF
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90 group-hover:opacity-75 transition-opacity rounded-xl"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{product.name}</h3>
            <div className="flex items-center justify-between">
              <div className="text-right">
                {product.discount ? (
                  <>
                    <p className="text-lg line-through text-gray-400">${product.price.toFixed(2)}</p>
                    <p className="text-xl font-bold text-white">${discountedPrice.toFixed(2)}</p>
                  </>
                ) : (
                  <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
                )}
              </div>
            </div>

            <button
              onClick={handleStoreClick}
              className="flex items-center gap-2 text-gray-300 hover:text-white group/store mt-2"
            >
              <Store className="h-4 w-4 group-hover/store:scale-110 transition-transform" />
              <span className="text-sm group-hover/store:underline">{product.storeName}</span>
            </button>
          </div>
        </div>

        <div className="absolute top-4 right-4 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-black hover:text-white transition-colors"
          >
            Add to Cart
          </button>
        </div>

        {product.freeShipping && (
          <div className="absolute top-4 left-4">
            <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
              Free Shipping
            </span>
          </div>
        )}
      </div>
    </div>
  );
}