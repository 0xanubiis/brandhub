import { useState, useEffect } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Product, deleteProduct, subscribeToProducts } from '../data/products'; // Import subscription function
import { getProductsWithPagination } from '../api/products';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface ProductsTableProps {
  onEdit?: (product: Product) => void;
  adminView?: boolean;
}

export function ProductsTable({ onEdit, adminView = false }: ProductsTableProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadProducts();

    // Subscribe to product changes
    const unsubscribe = subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [page]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, count } = await getProductsWithPagination(page, pageSize);
      setProducts(data);
      setTotalCount(count);
    } catch (error: any) {
      console.error('Error loading products:', error);
      setError(error.message || 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      await deleteProduct(product.id); // Permanently delete the product
      toast.success('Product deleted successfully');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewProduct = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Discount</th>
              <th className="px-6 py-4 font-medium">Date Added</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {product.discount ? `${product.discount}%` : 'No Discount'}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        title="View Product"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {adminView && onEdit && (
                        <button
                          onClick={() => onEdit(product)}
                          className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      {adminView && (
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} products
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
              return (
                pageNum > 0 &&
                pageNum <= totalPages && (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-md ${
                      pageNum === page ? 'bg-black text-white' : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              );
            })}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}