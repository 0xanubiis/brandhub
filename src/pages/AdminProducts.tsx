import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { getAdminProducts, getStoreName } from '../data/products';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ProductUploadForm } from '../components/ProductUploadForm';
import { ProductsTable } from '../components/ProductsTable';

export function AdminProducts() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
      return;
    }

    const loadData = async () => {
      try {
        const name = await getStoreName();
        setStoreName(name || '');
        await getAdminProducts();
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error loading data');
      }
    };

    loadData();

    const handleProductsUpdated = () => loadData();
    window.addEventListener('productsUpdated', handleProductsUpdated);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, [currentUser, navigate]);



  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600">Manage your store products</p>
        </div>
        {storeName ? (
          <button
            onClick={() => setIsUploadFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors"
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
      />
    </div>
  );
}