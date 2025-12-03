import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import StoreClient from './StoreClient';
import type { Metadata } from 'next';

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const { data: store } = await supabase
    .from('stores')
    .select('name, description')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!store) {
    return {
      title: 'Kedai Tidak Ditemui',
    };
  }

  return {
    title: `${store.name} | KEDAI`,
    description: store.description || `Beli produk dari ${store.name} melalui WhatsApp`,
    openGraph: {
      title: store.name,
      description: store.description || `Beli produk dari ${store.name}`,
      type: 'website',
    },
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;

  // Fetch store with products
  const { data: store, error } = await supabase
    .from('stores')
    .select(`
      *,
      products (
        id,
        name,
        description,
        price,
        compare_price,
        images_json,
        variants_json,
        category,
        stock_quantity,
        sort_order,
        is_active
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !store) {
    notFound();
  }

  // Filter and sort products
  const products = (store.products || [])
    .filter((p: any) => p.is_active)
    .sort((a: any, b: any) => a.sort_order - b.sort_order);

  return <StoreClient store={store} products={products} />;
}
