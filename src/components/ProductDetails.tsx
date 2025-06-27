interface Product {
  price: number;
  discount?: number;
  freeShipping?: boolean;
}

const ProductDetails = ({ product }: { product: Product }) => (
  <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
      {product.discount ? (
        <div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 line-through mb-1">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-red-600">
            ${(product.price * (1 - product.discount / 100)).toFixed(2)}
            <span className="ml-2 text-sm sm:text-lg bg-red-100 text-red-600 px-2 py-1 rounded-full">
              {product.discount}% OFF
            </span>
          </p>
        </div>
      ) : (
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
      )}
    </div>
    <p className="text-xs sm:text-sm text-gray-500 mt-2">
      {product.freeShipping ? 'Free shipping' : 'Free shipping on orders over $50'}
    </p>
  </div>
);

export default ProductDetails;