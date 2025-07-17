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
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone and will remove the product from all pages including the store.`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      // Call the deleteProduct function to remove the product permanently
      await deleteProduct(product.id);

      // Update the UI by removing the deleted product from the table
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== product.id));

      // Show success notification
      toast.success(`"${product.name}" has been deleted successfully`);
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
    <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 overflow-hidden">
      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-black/80 text-white">
              <th className="px-4 py-3 font-medium text-sm">Image</th>
              <th className="px-4 py-3 font-medium text-sm">Name</th>
              <th className="px-4 py-3 font-medium text-sm">Category</th>
              <th className="px-4 py-3 font-medium text-sm">Price</th>
              <th className="px-4 py-3 font-medium text-sm">Discount</th>
              <th className="px-4 py-3 font-medium text-sm">Date Added</th>
              <th className="px-4 py-3 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-white bg-black/40">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-white/10">
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
                <tr key={product.id} className="border-b border-white/10 hover:bg-black/60 transition-all duration-300">
                  <td className="px-4 py-3">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-md shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{product.name}</td>
                  <td className="px-4 py-3 text-gray-300">{product.category}</td>
                  <td className="px-4 py-3 font-bold text-white">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {product.discount ? (
                      <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow">
                        {product.discount}%
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">No Discount</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-xs">
                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md transition-all duration-300 hover:scale-105 shadow-sm"
                        title="View Product"
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                      {adminView && onEdit && (
                        <button
                          onClick={() => onEdit(product)}
                          className="p-1.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-md transition-all duration-300 hover:scale-105 shadow-sm"
                          title="Edit Product"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      )}
                      {adminView && (
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="p-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-md transition-all duration-300 hover:scale-105 shadow-sm"
                          title="Delete Product"
                        >
                          <Trash2 className="h-3 w-3" />
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
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} products
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all duration-300"
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
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-all duration-300 ${
                      pageNum === page 
                        ? 'bg-gradient-to-r from-gray-900 to-black text-white shadow-md' 
                        : 'border border-gray-300 hover:bg-gray-100 hover:scale-105'
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
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all duration-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}