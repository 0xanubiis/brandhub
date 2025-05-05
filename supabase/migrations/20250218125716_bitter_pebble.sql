/*
  # Initial Schema Setup

  1. New Tables
    - `admins` - Store admin information and store names
    - `products` - Product catalog
    - `orders` - Customer orders
    - `order_items` - Individual items in orders

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and anonymous access
    - Safe policy creation with existence checks
*/

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  store_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  images text[] NOT NULL,
  category text NOT NULL,
  description text,
  store_name text NOT NULL,
  admin_id uuid REFERENCES admins(id) ON DELETE CASCADE,
  sizes text[] DEFAULT '{}',
  free_shipping boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer text NOT NULL,
  total numeric NOT NULL,
  status text NOT NULL,
  date timestamptz DEFAULT now(),
  customer_details jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  size text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Safe policy creation for products
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Anyone can read products'
  ) THEN
    CREATE POLICY "Anyone can read products"
      ON products
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admins can insert own products'
  ) THEN
    CREATE POLICY "Admins can insert own products"
      ON products
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid()::text = admin_id::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admins can update own products'
  ) THEN
    CREATE POLICY "Admins can update own products"
      ON products
      FOR UPDATE
      TO authenticated
      USING (auth.uid()::text = admin_id::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admins can delete own products'
  ) THEN
    CREATE POLICY "Admins can delete own products"
      ON products
      FOR DELETE
      TO authenticated
      USING (auth.uid()::text = admin_id::text);
  END IF;
END $$;

-- Safe policy creation for orders
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Anyone can create orders'
  ) THEN
    CREATE POLICY "Anyone can create orders"
      ON orders
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Admins can read all orders'
  ) THEN
    CREATE POLICY "Admins can read all orders"
      ON orders
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Safe policy creation for order items
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Anyone can create order items'
  ) THEN
    CREATE POLICY "Anyone can create order items"
      ON order_items
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Admins can read all order items'
  ) THEN
    CREATE POLICY "Admins can read all order items"
      ON order_items
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_admin_id_idx ON products(admin_id);
CREATE INDEX IF NOT EXISTS products_store_name_idx ON products(store_name);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON order_items(product_id);