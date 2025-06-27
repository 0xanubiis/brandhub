import { supabase } from '../config/supabase';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

export interface Product {
  dateAdded: string | number | Date;
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description: string;
  storeName: string;
  adminId: string;
  createdAt: string;
  updatedAt?: string;
  sizes: string[];
  freeShipping?: boolean;
  discount?: number | null;
}

// Ensure products bucket exists
const ensureProductsBucket = async () => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const productsBucket = buckets?.find(bucket => bucket.name === 'products');

    if (!productsBucket) {
      // Create the bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket('products', {
        public: true,
        fileSizeLimit: 5242880, // 5MB in bytes
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error ensuring products bucket exists:', error);
    throw new Error('Failed to setup storage');
  }
};

// Upload image to Supabase Storage with automatic bucket creation
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Ensure bucket exists before upload
    await ensureProductsBucket();

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed.');
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
};

// Get store name with improved error handling
export const getStoreName = async (adminId?: string): Promise<string> => {
  if (!adminId) {
    const session = await supabase.auth.getSession();
    adminId = session.data.session?.user.id;
  }
  if (!adminId) return '';

  try {
    // First check if admin exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('store_name')
      .eq('id', adminId)
      .single();

    if (checkError) throw checkError;

    // If admin doesn't exist, create a new record
    if (!existingAdmin) {
      const session = await supabase.auth.getSession();
      const email = session.data.session?.user.email;
      
      if (!email) return '';

      const { error: insertError } = await supabase
        .from('admins')
        .insert({
          id: adminId,
          email,
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;
      return '';
    }

    return existingAdmin.store_name || '';
  } catch (error) {
    console.error('Error getting store name:', error);
    return '';
  }
};

// Get store by name
export const getStoreByName = async (storeName: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('store_name', storeName)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting store by name:', error);
    return null;
  }
};

// Subscribe to store name changes
export const subscribeToStoreName = (adminId: string, callback: (name: string) => void) => {
  const subscription = supabase
    .channel('store_name_changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'admins',
        filter: `id=eq.${adminId}`
      },
      async (payload) => {
        if (payload.new && payload.new.store_name) {
          callback(payload.new.store_name);
        }
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};

// Set store name
export const setStoreName = async (name: string): Promise<void> => {
  const session = await supabase.auth.getSession();
  const currentUser = session.data.session?.user;
  if (!currentUser) throw new Error('Not authenticated');

  try {
    // Check if the new store name already exists
    const { data: existingStore } = await supabase
      .from('admins')
      .select('id')
      .eq('store_name', name)
      .neq('id', currentUser.id)
      .single();

    if (existingStore) {
      throw new Error('Store name already exists');
    }

    // Update or insert the admin's store name
    const { error: upsertError } = await supabase
      .from('admins')
      .upsert({
        id: currentUser.id,
        email: currentUser.email,
        store_name: name,
        updated_at: new Date().toISOString(),
      });

    if (upsertError) throw upsertError;

    // Update all products with the new store name
    const { error: updateError } = await supabase
      .from('products')
      .update({
        store_name: name,
        updated_at: new Date().toISOString(),
      })
      .eq('admin_id', currentUser.id);

    if (updateError) throw updateError;

    // Trigger a refresh of products
    window.dispatchEvent(new Event('productsUpdated'));
    toast.success('Store name updated successfully');
  } catch (error: any) {
    console.error('Error setting store name:', error);
    throw error;
  }
};

// Add a new product
export const addProduct = async (product: Omit<Product, 'id' | 'storeName' | 'adminId' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const session = await supabase.auth.getSession();
  const currentUser = session.data.session?.user;
  if (!currentUser) throw new Error('Not authenticated');

  try {
    // Get store name first
    const storeName = await getStoreName(currentUser.id);
    if (!storeName) throw new Error('Store name not set. Please set your store name first.');

    // Ensure storage is set up
    await ensureProductsBucket();

    // Upload images to Supabase Storage
    const imageUploadPromises = product.images.map(async (imageFile: any) => {
      if (imageFile instanceof File) {
        return await uploadImage(imageFile);
      }
      return imageFile; // If it's already a URL, keep it as is
    });

    const uploadedImageUrls = await Promise.all(imageUploadPromises);

    const { data, error } = await supabase
      .from('products')
      .insert({
        ...product,
        images: uploadedImageUrls,
        store_name: storeName,
        admin_id: currentUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        throw new Error('A product with this name already exists');
      }
      throw new Error('Failed to add product: ' + error.message);
    }
    
    if (!data) {
      throw new Error('No data returned from product creation');
    }

    window.dispatchEvent(new Event('productsUpdated'));
    return data;
  } catch (error: any) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, admins!products_admin_id_fkey(store_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map the data to ensure store_name is properly set
    return (data || []).map(product => ({
      ...product,
      storeName: product.store_name || (product.admins?.store_name || '')
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

// Subscribe to products changes
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const subscription = supabase
    .channel('products_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products'
      },
      async () => {
        // Fetch updated products when changes occur
        const products = await getProducts();
        callback(products);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};

// Get products for specific store by store name
export const getStoreProductsByName = async (storeName: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_name', storeName)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting store products:', error);
    return [];
  }
};

// Get products for current admin
export const getAdminProducts = async (): Promise<Product[]> => {
  const session = await supabase.auth.getSession();
  const currentUser = session.data.session?.user;
  if (!currentUser) return [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, admins!products_admin_id_fkey(store_name)')
      .eq('admin_id', currentUser.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map the data to ensure store_name is properly set
    return (data || []).map(product => ({
      ...product,
      storeName: product.store_name || (product.admins?.store_name || '')
    }));
  } catch (error) {
    console.error('Error getting admin products:', error);
    return [];
  }
};

// Update a product
export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  const session = await supabase.auth.getSession();
  const currentUser = session.data.session?.user;
  if (!currentUser) throw new Error('Not authenticated');

  try {
    // Get current store name
    const storeName = await getStoreName(currentUser.id);
    if (!storeName) throw new Error('Store name not set');

    // If there are new images to upload
    if (product.images) {
      const imageUploadPromises = product.images.map(async (imageFile: any) => {
        if (imageFile instanceof File) {
          return await uploadImage(imageFile);
        }
        return imageFile; // If it's already a URL, keep it as is
      });

      const uploadedImageUrls = await Promise.all(imageUploadPromises);
      product.images = uploadedImageUrls;
    }

    const { error } = await supabase
      .from('products')
      .update({
        ...product,
        store_name: storeName, // Ensure store name is always up to date
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('admin_id', currentUser.id);

    if (error) throw error;
    window.dispatchEvent(new Event('productsUpdated'));
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

// Delete a product and its images
export const deleteProduct = async (id: string): Promise<void> => {
  const session = await supabase.auth.getSession();
  const currentUser = session.data.session?.user;
  if (!currentUser) throw new Error('Not authenticated');

  try {
    // Get the product to get image URLs
    const { data: product, error: getError } = await supabase
      .from('products')
      .select('images')
      .eq('id', id)
      .eq('admin_id', currentUser.id)
      .single();

    if (getError) throw getError;

    // Delete the product from the database first
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('admin_id', currentUser.id);

    if (deleteError) throw deleteError;

    // After successful product deletion, delete associated images from storage
    if (product && product.images && product.images.length > 0) {
      const imagePaths = (product.images as string[]).map((imageUrl: string) => {
        // Extract the file path from the URL
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/');
        // Get the last two parts of the path (e.g., 'product-images/filename.jpg')
        return pathParts.slice(-2).join('/');
      });

      // Delete all images associated with the product
      const { error: storageError } = await supabase.storage
        .from('products')
        .remove(imagePaths);

      if (storageError) {
        console.error('Error deleting product images:', storageError);
        // Don't throw here since the product is already deleted
        toast.error('Product deleted but some images could not be removed');
      }
    }

    window.dispatchEvent(new Event('productsUpdated'));
    toast.success('Product and associated images deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};