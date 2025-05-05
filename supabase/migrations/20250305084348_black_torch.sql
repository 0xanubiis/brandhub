/*
  # Create storage policies for product images

  1. Storage Policies
    - Create public bucket for product images
    - Set up policies for authenticated users to upload images
    - Allow public read access to product images
*/

-- Create storage bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('Products', 'Products', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to the Products bucket
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'Products' AND
  (storage.foldername(name))[1] = 'product-images'
);

-- Allow authenticated users to update their own files
CREATE POLICY "Authenticated users can update their own product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'Products' AND
  (storage.foldername(name))[1] = 'product-images' AND
  owner = auth.uid()
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete their own product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'Products' AND
  (storage.foldername(name))[1] = 'product-images' AND
  owner = auth.uid()
);

-- Allow public read access to all files in the Products bucket
CREATE POLICY "Public read access for product images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'Products' AND
  (storage.foldername(name))[1] = 'product-images'
);