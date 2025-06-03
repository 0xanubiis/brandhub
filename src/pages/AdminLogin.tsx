import React, { useState, useEffect } from 'react';
import { LogIn, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { getStoreName, setStoreName } from '../data/products';

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStoreNameInput, setShowStoreNameInput] = useState(false);
  const [storeName, setStoreNameValue] = useState('');

  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    const checkStoreSetup = async () => {
      if (currentUser) {
        const existingStoreName = await getStoreName(currentUser.id);
        if (existingStoreName) {
          navigate(from);
        } else {
          setShowStoreNameInput(true);
        }
      }
    };

    checkStoreSetup();
  }, [currentUser, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const existingStoreName = await getStoreName(user?.id);

      if (!existingStoreName) {
        setShowStoreNameInput(true);
      } else {
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName.trim()) {
      toast.error('Please enter a valid store name');
      return;
    }

    setLoading(true);

    try {
      await setStoreName(storeName);
      toast.success('Store setup completed!');
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Failed to set store name');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-white flex items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 flex items-center bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Return to Home
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        {/* Gradient Behind Form */}
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 via-gray-100 to-white rounded-lg -z-10"></div>

        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-r from-black to-gray-800 p-3 rounded-full">
            <LogIn className="h-6 w-6 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          {showStoreNameInput ? 'Set Your Store Name' : 'Admin Login'}
        </h2>

        {showStoreNameInput ? (
          <form onSubmit={handleStoreNameSubmit} className="space-y-6">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                Store Name
              </label>
              <input
                id="storeName"
                type="text"
                value={storeName}
                onChange={(e) => setStoreNameValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                required
                disabled={loading}
                placeholder="Enter your store name"
              />
              <p className="mt-1 text-sm text-gray-500">
                This name will be displayed to your customers.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}