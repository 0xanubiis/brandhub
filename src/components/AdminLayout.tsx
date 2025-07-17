import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Package, BarChart2, LogOut, LayoutGrid, Menu, X } from 'lucide-react';
import { supabase } from '../config/supabase';
import { toast } from 'react-hot-toast';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const navItems = [
    { path: '/admin', icon: BarChart2, label: 'Dashboard' },
    { path: '/admin/products', icon: LayoutGrid, label: 'Products' },
    { path: '/admin/orders', icon: Package, label: 'Orders' },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Mobile Sidebar Toggle */}
      <button
        className="fixed top-4 left-4 z-50 hidden p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900/50 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-out lg:translate-x-0 z-40 ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-6 py-6 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => navigate('/')}
        >
          <div className="p-2 bg-gradient-to-r from-white to-gray-200 rounded-xl">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Brand Hub</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <a
                key={item.path}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full animate-pulse" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 rounded-xl w-full transition-all duration-300 group"
          >
            <LogOut className="h-5 w-5 text-gray-400 hover:text-white" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">       {/* Top Bar */}
        <div className="bg-gray-900/50 backdrop-blur-xl border-b border-white/10 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          <div className="animate-fade-in-up">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl max-w-md w-full p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Logout</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to log out? You'll need to sign in again to access the admin
              panel.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 to-red-700 rounded-xl transition-all duration-300"
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