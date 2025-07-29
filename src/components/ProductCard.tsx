import React from 'react';
import { Product } from '../data/products';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const handleNavigateToStore = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the product card click event
    navigate(`/store/${encodeURIComponent(product.storeName)}`);
  };

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div
      className="group cursor-pointer relative overflow-hidden rounded-lg sm:rounded-2xl bg-black/60 border border-white/30 shadow-xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl animate-fade-up"
      onClick={() => navigate(`/products/${product.id}`)}
      style={{ animationDelay: `${Math.random() * 0.5}s` }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-black/10 opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <span className="bg-gradient-to-r from-red-500 to-pink-50 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold shadow-lg backdrop-blur-sm border border-white/20">
              {product.discount}% OFF
            </span>
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
          <div className="p-3 sm:p-4 w-full">
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 text-center">             <span className="text-white text-xs sm:text-sm font-medium">Quick View</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 z-10">
        <h3 className="text-sm sm:text-lg font-bold text-white mb-1 sm:mb-2 line-clamp-2 hover:text-gray-200 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">
          {product.category}
        </p>
        
        <div className="mb-3 sm:mb-4">
          {product.discount ? (
            <div className="space-y-1">
              <p className="text-xs sm:text-sm line-through text-gray-500">${product.price.toFixed(2)}</p>
              <p className="text-lg sm:text-2xl font-bold text-green-400">
                ${discountedPrice.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-lg sm:text-2xl font-bold text-white">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div>

        {/* Store Name Button */}
        <button
          onClick={handleNavigateToStore}
          className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/10 hover:border-white/20 flex items-center justify-center gap-1 sm:gap-2">
          <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Visit {product.storeName}</span>
          <span className="sm:hidden">{product.storeName}</span>
        </button>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-2 left-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
      <div className="absolute bottom-2 right-2 w-1 h-1 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  );
}