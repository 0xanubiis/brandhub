/*
  # Storage Policies for Products Bucket

  1. Storage Setup
    - Create Products bucket
    - Enable RLS
    - Add policies for authenticated users and public access

  2. Security
    - Enable RLS on storage.buckets and objects
    - Set up appropriate access policies
*/

-- Enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create Products bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('Products', 'Products', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket policies
CREATE POLICY "Give users authenticated access to bucket"
ON storage.buckets FOR ALL TO authenticated
USING (name = 'Products');

CREATE POLICY "Give public access to bucket"
ON storage.buckets FOR SELECT TO public
USING (name = 'Products');

-- Storage object policies
CREATE POLICY "Give authenticated users access to their own objects"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'Products' AND owner = auth.uid())
WITH CHECK (bucket_id = 'Products' AND owner = auth.uid());

CREATE POLICY "Give public read-only access to objects"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'Products');