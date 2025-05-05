/*
  # Storage and RLS Policies Setup

  1. Storage Policies
    - Create Products bucket if not exists
    - Enable RLS on Products bucket
    - Add policies for authenticated users to manage their own files
    - Add policies for public read access

  2. Security
    - Enable RLS on storage.buckets
    - Enable RLS on storage.objects
    - Add appropriate policies for bucket and object access
*/

-- Enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create Products bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for buckets
CREATE POLICY "Bucket Public Access"
ON storage.buckets FOR SELECT
TO public
USING (name = 'products');

CREATE POLICY "Authenticated users can create buckets"
ON storage.buckets FOR INSERT
TO authenticated
WITH CHECK (name = 'products');

-- Policies for objects
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products'
  AND owner = auth.uid()
);

CREATE POLICY "Authenticated users can update their files"
ON storage.objects FOR UPDATE
TO authenticated
USING (owner = auth.uid())
WITH CHECK (owner = auth.uid());

CREATE POLICY "Authenticated users can delete their files"
ON storage.objects FOR DELETE
TO authenticated
USING (owner = auth.uid());