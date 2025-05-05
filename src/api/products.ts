import { supabase } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../data/products';

// Type for product creation
export interface CreateProductPayload {
  name: string;
  price: number;
  category: string;
  description: string;
  sizes: string[];
  freeShipping: boolean;
  images: File[];
}

// Validate product data
export const validateProductData = (data: Partial<CreateProductPayload>): string | null => {
  if (!data.name || data.name.trim() === '') {
    return 'Product name is required';
  }
  
  if (!data.price || data.price <= 0) {
    return 'Valid price is required';
  }
  
  if (!data.category || data.category.trim() === '') {
    return 'Category is required';
  }
  
  if (!data.images || data.images.length === 0) {
    return 'At least one product image is required';
  }
  
  return null;
};

// Upload image to Supabase Storage
export const uploadProductImage = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed.');
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    const { error: uploadError } = await supabase.storage
      .from('Products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('Products')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
};

// Create a new product
export const createProduct = async (productData: CreateProductPayload): Promise<Product> => {
  // Validate seller authentication
  const session = await supabase.auth.getSession();
  const currentUser = session.data.session?.user;
  
  if (!currentUser) {
    throw new Error('Authentication required. Please log in to upload products.');
  }
  
  // Validate product data
  const validationError = validateProductData(productData);
  if (validationError) {
    throw new Error(validationError);
  }
  
  try {
    // Get store name
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('store_name')
      .eq('id', currentUser.id)
      .single();
    
    if (adminError) throw adminError;
    
    if (!adminData?.store_name) {
      throw new Error('Store name not set. Please set up your store first.');
    }
    
    // Upload images
    const imageUploadPromises = productData.images.map(async (imageFile) => {
      return await uploadProductImage(imageFile);
    });
    
    const uploadedImageUrls = await Promise.all(imageUploadPromises);
    
    // Create product record
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        price: productData.price,
        category: productData.category,
        description: productData.description,
        sizes: productData.sizes,
        free_shipping: productData.freeShipping,
        images: uploadedImageUrls,
        store_name: adminData.store_name,
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
    
    // Trigger event for real-time updates
    window.dispatchEvent(new Event('productsUpdated'));
    
    return data;
  } catch (error: any) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Subscribe to product updates
export const subscribeToProductUpdates = (callback: (products: Product[]) => void) => {
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
        // Fetch all products when changes occur
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          callback(data);
        }
      }
    )
    .subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
};

// Get products with pagination
export const getProductsWithPagination = async (
  page: number = 1, 
  pageSize: number = 10,
  filters: { category?: string, storeName?: string, search?: string } = {}
): Promise<{ data: Product[], count: number }> => {
  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (filters.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }
    
    if (filters.storeName && filters.storeName !== 'All') {
      query = query.eq('store_name', filters.storeName);
    }
    
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return {
      data: data || [],
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching products with pagination:', error);
    throw error;
  }
};