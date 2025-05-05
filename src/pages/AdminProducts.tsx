import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { getAdminProducts, Product, deleteProduct, getStoreName } from '../data/products';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ProductUploadForm } from '../components/ProductUploadForm';
import { ProductsTable } from '../components/ProductsTable';

export function AdminProducts() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  // Removed unused 'products' state variable
  const [storeName, setStoreName] = useState('');
  // Removed unused 'searchQuery' state variable
  // Removed unused 'selectedCategory' state variable
  // Removed unused 'isLoading' state variable

  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
      return;
    }

    const loadData = async () => {
      // Removed 'setIsLoading(true)' as 'isLoading' is unused
      try {
        const name = await getStoreName();
        setStoreName(name || '');
        await getAdminProducts(); // Fetch products without storing them
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error loading data');
      }
      // Removed 'setIsLoading(false)' as 'isLoading' is unused
    };

    loadData();

    const handleProductsUpdated = () => loadData();
    window.addEventListener('productsUpdated', handleProductsUpdated);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, [currentUser, navigate]);

  const handleDeleteProduct = async (product: Product) => {
    try {
      await deleteProduct(product.id);
      toast.success('Product deleted successfully');
      window.dispatchEvent(new Event('productsUpdated'));
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600">Manage your store products</p>
        </div>
        {storeName ? (
          <button
            onClick={() => setIsUploadFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
          >
            <Upload className="h-5 w-5" />
            Upload New Product
          </button>
        ) : (
          <p className="text-sm text-red-600">Please set your store name in the dashboard first</p>
        )}
      </div>

      {/* New Product Upload Form Modal */}
      {isUploadFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <ProductUploadForm 
              onSuccess={() => {
                setIsUploadFormOpen(false);
                window.dispatchEvent(new Event('productsUpdated'));
              }}
              onCancel={() => setIsUploadFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Products Table */}
      <ProductsTable 
        adminView={true}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
}