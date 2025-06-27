import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Package, BarChart2, LogOut, LayoutGrid } from 'lucide-react';
import { supabase } from '../config/supabase';
import { toast } from 'react-hot-toast';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-[#29292B] border-r border-gray-700 hidden sm:block">
        <div
          className="flex items-center gap-2 px-6 py-4 border-b border-gray-700 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <ShoppingBag className="h-6 w-6 text-white" />
          <span className="text-xl font-bold text-white">Brand Hub</span>
        </div>

        <nav className="p-4 space-y-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              location.pathname === '/admin'
                ? 'text-white bg-gray-800'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <BarChart2 className="h-5 w-5" />
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin/products');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              location.pathname === '/admin/products'
                ? 'text-white bg-gray-800'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span>Products</span>
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin/orders');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              location.pathname === '/admin/orders'
                ? 'text-white bg-gray-800'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Package className="h-5 w-5" />
            <span>Orders</span>
          </a>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 sm:ml-64 p-4">
        {children}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? You'll need to sign in again to access the admin
              panel.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 text-white bg-[#29292B] rounded-md hover:bg-black"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}