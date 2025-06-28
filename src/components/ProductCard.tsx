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
      className="group cursor-pointer relative overflow-hidden rounded-xl bg-gray-100 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
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
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              {product.discount}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <div className="mt-2">
          {product.discount ? (
            <>
              <p className="text-sm line-through text-gray-400">${product.price.toFixed(2)}</p>
              <p className="text-lg font-bold">${discountedPrice.toFixed(2)}</p>
            </>
          ) : (
            <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
          )}
        </div>

        {/* Store Name */}
        <button
          onClick={handleNavigateToStore}
          className="mt-4 text-sm text-blue-500 hover:underline"
        >
          Visit {product.storeName}
        </button>
      </div>
    </div>
  );
}