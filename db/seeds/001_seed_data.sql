-- KEDAI Whatsapp Seed Data
-- Sample templates and products

-- ============================================
-- SEED TEMPLATES
-- ============================================
INSERT INTO templates (key, title, description, thumbnail_url, theme_json, sample_products_json) VALUES
(
  'minimalis-moden',
  'Minimalis Moden',
  'Templat bersih dan moden untuk kedai fesyen',
  'https://placehold.co/600x400/1e1b4b/a78bfa?text=Minimalis',
  '{
    "primaryColor": "#8b5cf6",
    "secondaryColor": "#a78bfa",
    "backgroundColor": "#0f172a",
    "textColor": "#f8fafc",
    "fontFamily": "Inter"
  }',
  '[
    {"name": "T-Shirt Basic", "price": 49.90, "image": "https://placehold.co/400x400/334155/f8fafc?text=T-Shirt"},
    {"name": "Hoodie Premium", "price": 129.90, "image": "https://placehold.co/400x400/334155/f8fafc?text=Hoodie"},
    {"name": "Cap Streetwear", "price": 39.90, "image": "https://placehold.co/400x400/334155/f8fafc?text=Cap"}
  ]'
),
(
  'butik-elegan',
  'Butik Elegan',
  'Templat elegan untuk produk kecantikan dan kosmetik',
  'https://placehold.co/600x400/312e81/c4b5fd?text=Elegan',
  '{
    "primaryColor": "#ec4899",
    "secondaryColor": "#f472b6",
    "backgroundColor": "#1e1b4b",
    "textColor": "#fdf4ff",
    "fontFamily": "Playfair Display"
  }',
  '[
    {"name": "Lip Matte", "price": 35.00, "image": "https://placehold.co/400x400/831843/fdf4ff?text=Lip+Matte"},
    {"name": "Foundation Set", "price": 89.00, "image": "https://placehold.co/400x400/831843/fdf4ff?text=Foundation"},
    {"name": "Skincare Bundle", "price": 159.00, "image": "https://placehold.co/400x400/831843/fdf4ff?text=Skincare"}
  ]'
),
(
  'kedai-segar',
  'Kedai Segar',
  'Templat segar untuk kedai makanan dan minuman',
  'https://placehold.co/600x400/3730a3/ddd6fe?text=Segar',
  '{
    "primaryColor": "#22c55e",
    "secondaryColor": "#4ade80",
    "backgroundColor": "#052e16",
    "textColor": "#f0fdf4",
    "fontFamily": "Poppins"
  }',
  '[
    {"name": "Nasi Lemak Set", "price": 12.00, "image": "https://placehold.co/400x400/166534/f0fdf4?text=Nasi+Lemak"},
    {"name": "Air Bandung", "price": 5.00, "image": "https://placehold.co/400x400/166534/f0fdf4?text=Bandung"},
    {"name": "Kuih Raya Set", "price": 45.00, "image": "https://placehold.co/400x400/166534/f0fdf4?text=Kuih"}
  ]'
),
(
  'gadget-tech',
  'Gadget Tech',
  'Templat tech untuk kedai elektronik dan gadget',
  'https://placehold.co/600x400/1e293b/60a5fa?text=Tech',
  '{
    "primaryColor": "#3b82f6",
    "secondaryColor": "#60a5fa",
    "backgroundColor": "#0c0a09",
    "textColor": "#fafaf9",
    "fontFamily": "Space Grotesk"
  }',
  '[
    {"name": "Wireless Earbuds", "price": 79.00, "image": "https://placehold.co/400x400/1e3a8a/fafaf9?text=Earbuds"},
    {"name": "Phone Case", "price": 29.00, "image": "https://placehold.co/400x400/1e3a8a/fafaf9?text=Case"},
    {"name": "Power Bank 20000mAh", "price": 89.00, "image": "https://placehold.co/400x400/1e3a8a/fafaf9?text=PowerBank"}
  ]'
);

-- ============================================
-- SEED SAMPLE STORE (for testing)
-- ============================================
INSERT INTO stores (slug, name, description, whatsapp, email, template_key, theme_json) VALUES
(
  'demo-store',
  'Kedai Demo',
  'Ini adalah kedai demo untuk testing',
  '60123456789',
  'demo@kedai.my',
  'minimalis-moden',
  '{
    "primaryColor": "#8b5cf6",
    "secondaryColor": "#a78bfa",
    "backgroundColor": "#0f172a",
    "textColor": "#f8fafc"
  }'
);

-- Get the demo store ID for products
DO $$
DECLARE
  demo_store_id UUID;
BEGIN
  SELECT id INTO demo_store_id FROM stores WHERE slug = 'demo-store';
  
  -- Insert sample products for demo store
  INSERT INTO products (store_id, name, description, price, compare_price, images_json, category, stock_quantity, sort_order) VALUES
  (demo_store_id, 'T-Shirt Basic Hitam', 'T-shirt cotton berkualiti tinggi', 49.90, 69.90, '["https://placehold.co/400x400/334155/f8fafc?text=T-Shirt+Hitam"]', 'Pakaian', 100, 1),
  (demo_store_id, 'T-Shirt Basic Putih', 'T-shirt cotton berkualiti tinggi', 49.90, 69.90, '["https://placehold.co/400x400/f8fafc/334155?text=T-Shirt+Putih"]', 'Pakaian', 80, 2),
  (demo_store_id, 'Hoodie Premium', 'Hoodie tebal dan selesa', 129.90, 159.90, '["https://placehold.co/400x400/1e293b/f8fafc?text=Hoodie"]', 'Pakaian', 50, 3),
  (demo_store_id, 'Cap Snapback', 'Cap streetwear limited edition', 39.90, NULL, '["https://placehold.co/400x400/0f172a/f8fafc?text=Cap"]', 'Aksesori', 200, 4),
  (demo_store_id, 'Tote Bag Canvas', 'Beg canvas mesra alam', 35.00, 45.00, '["https://placehold.co/400x400/422006/fef3c7?text=Tote+Bag"]', 'Aksesori', 150, 5);
END $$;

-- ============================================
-- SEED ADMIN USER
-- ============================================
INSERT INTO admins (email, name, role) VALUES
('admin@kedai.my', 'Admin KEDAI', 'super_admin');
