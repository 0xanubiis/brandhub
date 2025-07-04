import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Percent } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createProduct, CreateProductPayload as BaseCreateProductPayload } from '../api/products';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CreateProductPayload extends BaseCreateProductPayload {
  discount?: number | null;
}

interface ProductUploadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductUploadForm({ onSuccess, onCancel }: ProductUploadFormProps) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<CreateProductPayload, 'images'> & { images: (File | string)[] }>({
    name: '',
    price: 0,
    category: '',
    description: '',
    sizes: [],
    freeShipping: false,
    discount: null,
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['T-Shirt', 'Hoodie', 'Shoes', 'Pants', 'Accessories'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const discounts = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  if (!currentUser) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
        <p className="mb-4">You need to be logged in as a seller to upload products.</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/admin/login')}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? value === ''
            ? 0
            : parseFloat(value)
          : type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleMultipleImageUpload(files);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await handleMultipleImageUpload(files);
    }
  };

  const handleMultipleImageUpload = async (files: File[]) => {
    try {
      const validFiles = files.filter((file) => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          return false;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        toast.error('No valid images to upload');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
      }));

      toast.success(`${validFiles.length} image(s) ready for upload`);
    } catch (error) {
      toast.error('Failed to process images');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return false;
    }

    if (!formData.price || formData.price <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      return false;
    }

    if (formData.images.length === 0) {
      toast.error('Please upload at least one product image');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const imageFiles = formData.images.filter((img) => img instanceof File) as File[];

      await createProduct({
        ...formData,
        images: imageFiles,
      });

      toast.success('Product added successfully');
      setFormData({
        name: '',
        price: 0,
        category: '',
        description: '',
        sizes: [],
        freeShipping: false,
        discount: null,
        images: [],
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Upload New Product</h2>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            placeholder="Enter price"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  formData.sizes.includes(size)
                    ? 'bg-black text-white'
                    : 'border border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
          <div className="relative">
            <select
              name="discount"
              value={formData.discount || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  discount: e.target.value ? parseInt(e.target.value) : null,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black appearance-none pr-10"
            >
              <option value="">No discount</option>
              {discounts.map((discount) => (
                <option key={discount} value={discount}>
                  {discount}% OFF
                </option>
              ))}
            </select>
            <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          {formData.discount && (
            <p className="mt-1 text-sm text-gray-500">
              Original price: ${formData.price.toFixed(2)} → Discounted price: $
              {(formData.price * (1 - formData.discount / 100)).toFixed(2)}
            </p>
          )}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Images*</label>
          <div
            className={`mt-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
              isDragging ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-black'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your images here, or click to select
            </p>
            <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Formats: JPEG, PNG, WebP</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              multiple
              className="hidden"
            />
          </div>
          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image instanceof File ? URL.createObjectURL(image) : image}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 text-white bg-black rounded-md hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}