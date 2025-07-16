import React from 'react';
import { Product } from '../data/products';
import { useNavigate } from 'react-router-dom';

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
      className="group cursor-pointer relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-200"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 right-2">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
              {product.discount}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-600 mb-2">{product.category}</p>
        <div className="mb-2">
          {product.discount ? (
            <div className="space-y-1">
              <p className="text-xs line-through text-gray-400">${product.price.toFixed(2)}</p>
              <p className="text-lg font-bold text-gray-900">${discountedPrice.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
          )}
        </div>

        {/* Store Name */}
        <button
          onClick={handleNavigateToStore}
          className="w-full py-2 px-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white rounded-md text-xs font-medium transition-all duration-300 hover:scale-105 shadow-md"
        >
          Visit {product.storeName}
        </button>
      </div>
    </div>
  );
}