import { useState, useEffect } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import { Product } from '../data/products';
import { getProductsWithPagination, subscribeToProductUpdates } from '../api/products';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface ProductsTableProps {
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  adminView?: boolean;
}

export function ProductsTable({ onEdit, onDelete, adminView = false }: ProductsTableProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [showNotification, setShowNotification] = useState(false);
  const [newProductAdded, setNewProductAdded] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToProductUpdates((updatedProducts) => {
      // Check if there's a new product
      if (products.length > 0 && updatedProducts.length > products.length) {
        const newProduct = updatedProducts[0]; // Assuming sorted by created_at desc
        setNewProductAdded(newProduct);
        setShowNotification(true);
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
      
      // Update products list
      loadProducts();
    });
    
    return () => {
      unsubscribe();
    };
  }, [page, pageSize, searchQuery, selectedCategory]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filters = {
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery || undefined
      };
      
      const { data, count } = await getProductsWithPagination(page, pageSize, filters);
      setProducts(data);
      setTotalCount(count);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(data.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (error: any) {
      console.error('Error loading products:', error);
      setError(error.message || 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
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
      {/* Real-time notification */}
      {showNotification && newProductAdded && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg z-50 max-w-md animate-slideIn">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {newProductAdded.images && newProductAdded.images[0] && (
                <img 
                  src={newProductAdded.images[0]} 
                  alt={newProductAdded.name} 
                  className="w-12 h-12 object-cover rounded"
                />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium">New Product Added</h4>
              <p className="text-sm">{newProductAdded.name}</p>
              <p className="text-xs text-gray-300 mt-1">Just now</p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md whitespace-nowrap ${
                  category === selectedCategory
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Store</th>
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
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
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
                  <td className="px-6 py-4">{product.storeName}</td>
                  <td className="px-6 py-4">
                    {new Date(product.createdAt).toLocaleDateString()}
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
                      
                      {adminView && onDelete && (
                        <button
                          onClick={() => onDelete(product)}
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
              // Show pages around current page
              let pageNum = page;
              if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-md ${
                      pageNum === page
                        ? 'bg-black text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
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