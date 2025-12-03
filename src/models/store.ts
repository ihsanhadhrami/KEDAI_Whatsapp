// Store model types

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily?: string;
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  whatsapp: string;
  email: string | null;
  logo_url: string | null;
  banner_url: string | null;
  theme_json: ThemeConfig;
  template_key: string | null;
  is_active: boolean;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateStoreInput {
  slug: string;
  name: string;
  description?: string;
  whatsapp: string;
  email?: string;
  logo_url?: string;
  banner_url?: string;
  theme_json?: ThemeConfig;
  template_key?: string;
  is_premium?: boolean;
}

export interface UpdateStoreInput {
  name?: string;
  description?: string;
  whatsapp?: string;
  email?: string;
  logo_url?: string;
  banner_url?: string;
  theme_json?: ThemeConfig;
  is_active?: boolean;
  is_premium?: boolean;
}

// Product types
export interface ProductVariant {
  name: string;
  options: string[];
  prices?: Record<string, number>;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  images_json: string[];
  variants_json: ProductVariant[];
  category: string | null;
  is_active: boolean;
  stock_quantity: number;
  sku: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  store_id: string;
  name: string;
  description?: string;
  price: number;
  compare_price?: number;
  images_json?: string[];
  variants_json?: ProductVariant[];
  category?: string;
  stock_quantity?: number;
  sku?: string;
}

// Template types
export interface SampleProduct {
  name: string;
  price: number;
  image: string;
}

export interface Template {
  id: string;
  key: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  theme_json: ThemeConfig;
  sample_products_json: SampleProduct[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Store with products
export interface StoreWithProducts extends Store {
  products: Product[];
}

// Store with template
export interface StoreWithTemplate extends Store {
  template: Template | null;
}
