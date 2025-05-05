interface Product {
  price: number;
  discount?: number;
  freeShipping?: boolean;
}

const ProductDetails = ({ product }: { product: Product }) => (
  <div>
    <div className="flex items-center justify-between">
      {product.discount ? (
        <div>
          <p className="text-3xl font-bold text-gray-900 line-through mb-1">${product.price}</p>
          <p className="text-3xl font-bold text-red-600">
            ${(product.price * (1 - product.discount / 100)).toFixed(2)}
            <span className="ml-2 text-lg bg-red-100 text-red-600 px-2 py-1 rounded-full">
              {product.discount}% OFF
            </span>
          </p>
        </div>
      ) : (
        <p className="text-3xl font-bold text-gray-900">${product.price}</p>
      )}
    </div>
    <p className="text-sm text-gray-500 mt-1">
      {product.freeShipping ? 'Free shipping' : 'Free shipping on orders over $50'}
    </p>
  </div>
);

export default ProductDetails;