-- KEDAI Whatsapp Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TEMPLATES TABLE
-- Store pre-built templates for stores
-- ============================================
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  theme_json JSONB DEFAULT '{}',
  sample_products_json JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STORES TABLE
-- Each customer's store
-- ============================================
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  whatsapp VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  logo_url TEXT,
  banner_url TEXT,
  theme_json JSONB DEFAULT '{}',
  template_key VARCHAR(50) REFERENCES templates(key),
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- Products for each store
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_price DECIMAL(10, 2),
  images_json JSONB DEFAULT '[]',
  variants_json JSONB DEFAULT '[]',
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  sku VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- Customer orders/purchases
-- ============================================
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'deploying', 'completed', 'failed', 'refunded');

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  store_slug VARCHAR(100),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  template_key VARCHAR(50) NOT NULL,
  plan_type VARCHAR(20) DEFAULT 'free',
  amount DECIMAL(10, 2) NOT NULL,
  status order_status DEFAULT 'pending',
  toyyib_bill_code VARCHAR(50),
  toyyib_ref VARCHAR(100),
  payment_url TEXT,
  meta_json JSONB DEFAULT '{}',
  paid_at TIMESTAMP WITH TIME ZONE,
  deployed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- WEBHOOK_LOGS TABLE
-- Log all incoming webhooks for debugging
-- ============================================
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider VARCHAR(50) NOT NULL,
  provider_event_id VARCHAR(100),
  endpoint VARCHAR(100),
  raw_payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index to prevent duplicate webhook processing
CREATE UNIQUE INDEX idx_webhook_provider_event 
ON webhook_logs(provider, provider_event_id) 
WHERE provider_event_id IS NOT NULL;

-- ============================================
-- ADMINS TABLE
-- Admin users (if not using Supabase Auth)
-- ============================================
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'support');

CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  role admin_role DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_is_active ON stores(is_active);
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_store_slug ON orders(store_slug);
CREATE INDEX idx_orders_toyyib_bill_code ON orders(toyyib_bill_code);
CREATE INDEX idx_webhook_logs_provider ON webhook_logs(provider);
CREATE INDEX idx_webhook_logs_processed ON webhook_logs(processed);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Public can read active templates
CREATE POLICY "Templates are viewable by everyone" 
ON templates FOR SELECT 
USING (is_active = true);

-- Public can read active stores
CREATE POLICY "Active stores are viewable by everyone" 
ON stores FOR SELECT 
USING (is_active = true);

-- Public can read active products of active stores
CREATE POLICY "Active products are viewable by everyone" 
ON products FOR SELECT 
USING (
  is_active = true 
  AND EXISTS (
    SELECT 1 FROM stores 
    WHERE stores.id = products.store_id 
    AND stores.is_active = true
  )
);

-- Service role has full access (for API routes)
CREATE POLICY "Service role has full access to templates"
ON templates FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to stores"
ON stores FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to products"
ON products FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to orders"
ON orders FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to webhook_logs"
ON webhook_logs FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to admins"
ON admins FOR ALL
USING (auth.role() = 'service_role');
